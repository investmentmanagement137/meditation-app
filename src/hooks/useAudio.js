import { useState, useEffect, useRef } from 'react';

// --- Helpers ---
const fetchYouTubeTitle = async (videoId) => {
    try {
        const response = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
        const data = await response.json();
        return {
            title: data.title || 'YouTube Track',
            creator: data.author_name || 'Unknown Artist'
        };
    } catch (error) {
        console.warn('Error fetching YT title:', error);
        return { title: 'YouTube Track', creator: 'Unknown Artist' };
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
    const audioContextRef = useRef(null);

    // Note: YouTube player is now initialized globally in App.jsx
    // We use window.ytPlayer reference

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            stopAudio();
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

    const playYouTube = (videoId, attempt = 0) => {
        if (attempt > 30) {
            console.error("YouTube Player not ready after 30 attempts");
            return;
        }

        // Check if global player is ready
        if (!window.ytPlayer || typeof window.ytPlayer.loadVideoById !== 'function') {
            console.log("Waiting for YouTube Player... attempt", attempt);
            setTimeout(() => playYouTube(videoId, attempt + 1), 200);
            return;
        }

        // Use the pre-initialized global player
        console.log("Loading video:", videoId);
        window.ytPlayer.loadVideoById(videoId);
        window.ytPlayer.setVolume(30);
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
            playYouTube(audioTrack.id);
        }
    };

    const stopAudio = () => {
        setIsPlaying(false);
        audioRef.current.pause();
        audioRef.current.currentTime = 0;

        if (window.ytPlayer && typeof window.ytPlayer.stopVideo === 'function') {
            try { window.ytPlayer.stopVideo(); } catch (e) { }
        }
    };

    const pauseAudio = () => {
        setIsPlaying(false);
        if (currentAudio?.type === 'direct') {
            audioRef.current.pause();
        } else if (currentAudio?.type === 'youtube' && window.ytPlayer && typeof window.ytPlayer.pauseVideo === 'function') {
            try { window.ytPlayer.pauseVideo(); } catch (e) { }
        }
    };

    const resumeAudio = () => {
        setIsPlaying(true);
        if (currentAudio?.type === 'direct') {
            audioRef.current.play();
        } else if (currentAudio?.type === 'youtube' && window.ytPlayer && typeof window.ytPlayer.playVideo === 'function') {
            try { window.ytPlayer.playVideo(); } catch (e) { }
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
