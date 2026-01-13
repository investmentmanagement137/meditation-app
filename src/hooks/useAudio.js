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

    // Load API on Mount
    useEffect(() => {
        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        }
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            stopAudio();
            // Clean up YouTube Player DOM
            // This prevents conflicts if the component is remounted
            const hostDiv = document.getElementById('yt-player-host');
            if (hostDiv) {
                // If the player replaced the div with an iframe, removing hostDiv removes the player.
                // We should also look for iframes that might have taken over the ID.
                hostDiv.remove();
            }

            // Also nullify ref
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
        if (attempt > 10) {
            console.error("YouTube API failed to load");
            return;
        }

        if (!window.YT || !window.YT.Player) {
            setTimeout(() => loadYouTubePlayer(videoId, attempt + 1), 500);
            return;
        }

        // Host Div Check
        // Since we remove it on unmount, we always create it fresh if missing
        let playerDiv = document.getElementById('yt-player-host');
        if (!playerDiv) {
            playerDiv = document.createElement('div');
            playerDiv.id = 'yt-player-host';
            playerDiv.style.position = 'absolute';
            playerDiv.style.top = '-9999px';
            playerDiv.style.left = '-9999px';
            document.body.appendChild(playerDiv);
        }

        // DOM verification
        if (typeof ytPlayerRef.current?.loadVideoById === 'function') {
            // If ref claims to be valid, verify it's still in document
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
                height: '0',
                width: '0',
                videoId: videoId,
                playerVars: {
                    'playsinline': 1,
                    'loop': 1,
                    'controls': 0,
                    'origin': window.location.origin
                },
                events: {
                    'onReady': (event) => {
                        event.target.setVolume(30);
                        event.target.playVideo();
                    },
                    'onStateChange': (event) => {
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
