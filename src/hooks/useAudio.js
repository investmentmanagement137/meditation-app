import { useState, useEffect, useRef } from 'react';

// --- Helpers ---
const fetchYouTubeTitle = async (videoId) => {
    try {
        const response = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
        const data = await response.json();
        return data.title || 'YouTube Track';
    } catch (error) {
        console.warn('Error fetching YT title:', error);
        return 'YouTube Track';
    }
};

const extractVideoID = (url) => {
    var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    var match = url.match(regExp);
    if (match && match[2].length === 11) {
        return match[2];
    } else {
        return null;
    }
};

export const AudioUtils = {
    fetchYouTubeTitle,
    extractVideoID,
    isYouTubePlaylist: (url) => url.includes('list='),
    isAudioURL: (url) => /\.(mp3|wav|ogg|m4a|aac|flac)$/i.test(url)
};

export function useAudio() {
    const [currentAudio, setCurrentAudio] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const audioRef = useRef(new Audio());
    const ytPlayerRef = useRef(null);
    const audioContextRef = useRef(null);

    // Note: API is now loaded in App.jsx globally.
    // We remove the local loader here to avoid redundant checks/race conditions.

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            stopAudio();
            // Clean up YouTube Player DOM
            const hostDiv = document.getElementById('yt-player-host');
            if (hostDiv) {
                hostDiv.remove();
            }
            ytPlayerRef.current = null;
        };
    }, []);

    const initAudioContext = () => {
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioContextRef.current.state === 'suspended') {
            audioContextRef.current.resume();
        }
    };

    const loadYouTubePlayer = (videoId, attempt = 0) => {
        if (attempt > 20) { // Increased attempts since we rely on App.jsx
            console.error("YouTube API failed to load (Timeout)");
            return;
        }

        if (!window.YT || !window.YT.Player) {
            // Wait for App.jsx loader to finish
            setTimeout(() => loadYouTubePlayer(videoId, attempt + 1), 200);
            return;
        }

        // Host Div Check
        let playerDiv = document.getElementById('yt-player-host');
        if (!playerDiv) {
            playerDiv = document.createElement('div');
            playerDiv.id = 'yt-player-host';
            // VISIBILITY FIX:
            // Use opacity:0 and pointer-events:none.
            // Avoid display:none or off-screen (-9999px) which browsers hinder.
            playerDiv.style.position = 'absolute';
            playerDiv.style.top = '0';
            playerDiv.style.left = '0';
            playerDiv.style.width = '1px';
            playerDiv.style.height = '1px';
            playerDiv.style.opacity = '0.01'; // Not fully 0 just in case
            playerDiv.style.pointerEvents = 'none';
            playerDiv.style.zIndex = '-1';
            document.body.appendChild(playerDiv);
        }

        // DOM verification
        if (typeof ytPlayerRef.current?.loadVideoById === 'function') {
            const iframe = ytPlayerRef.current.getIframe();
            if (iframe && document.body.contains(iframe)) {
                ytPlayerRef.current.loadVideoById(videoId);
                ytPlayerRef.current.setVolume(30);
                return;
            }
        }

        // Create New Player
        try {
            ytPlayerRef.current = new window.YT.Player('yt-player-host', {
                height: '100%', // Fill the tiny container
                width: '100%',
                videoId: videoId,
                playerVars: {
                    'playsinline': 1,
                    'loop': 1,
                    'controls': 0,
                    'origin': window.location.origin
                },
                events: {
                    'onReady': (event) => {
                        console.log("YT Player Ready");
                        event.target.setVolume(30);
                        event.target.playVideo();
                        // Verify state
                        setTimeout(() => {
                            if (event.target.getPlayerState && event.target.getPlayerState() !== 1) {
                                console.warn("YT Autoplay might be blocked. Forcing play.");
                                event.target.playVideo();
                            }
                        }, 1000);
                    },
                    'onStateChange': (event) => {
                        console.log("YT State Change:", event.data);
                        if (event.data === window.YT.PlayerState.ENDED) {
                            event.target.playVideo();
                        }
                    },
                    'onError': (e) => console.error("YT Error:", e)
                }
            });
        } catch (e) {
            console.error("Error creating YT Player", e);
        }
    };

    const playAudio = (audioTrack) => {
        initAudioContext();
        stopAudio();
        setCurrentAudio(audioTrack);
        setIsPlaying(true);

        if (audioTrack.type === 'direct') {
            audioRef.current.src = audioTrack.url;
            audioRef.current.loop = true;
            audioRef.current.volume = 0.3;
            audioRef.current.play().catch(e => console.error("Audio play failed", e));
        } else if (audioTrack.type === 'youtube') {
            loadYouTubePlayer(audioTrack.id);
        }
    };

    const stopAudio = () => {
        setIsPlaying(false);
        audioRef.current.pause();
        audioRef.current.currentTime = 0;

        if (ytPlayerRef.current && typeof ytPlayerRef.current.stopVideo === 'function') {
            try { ytPlayerRef.current.stopVideo(); } catch (e) { }
        }
    };

    const pauseAudio = () => {
        setIsPlaying(false);
        if (currentAudio?.type === 'direct') {
            audioRef.current.pause();
        } else if (currentAudio?.type === 'youtube' && ytPlayerRef.current && typeof ytPlayerRef.current.pauseVideo === 'function') {
            try { ytPlayerRef.current.pauseVideo(); } catch (e) { }
        }
    };

    const resumeAudio = () => {
        setIsPlaying(true);
        if (currentAudio?.type === 'direct') {
            audioRef.current.play();
        } else if (currentAudio?.type === 'youtube' && ytPlayerRef.current && typeof ytPlayerRef.current.playVideo === 'function') {
            try { ytPlayerRef.current.playVideo(); } catch (e) { }
        }
    };

    return {
        currentAudio,
        isPlaying,
        playAudio,
        stopAudio,
        pauseAudio,
        resumeAudio
    };
}
