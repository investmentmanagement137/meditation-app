import React, { useEffect, useState, useRef } from 'react';
import TimerRing from '../components/TimerRing';
import QuoteCarousel from '../components/QuoteCarousel';
import { useTimer } from '../hooks/useTimer';
import { useAudio } from '../hooks/useAudio';
import { getMotivationalContent } from '../services/gemini';
import useLocalStorage from '../hooks/useLocalStorage';
import { AUDIO_ASSETS } from '../conf/audioAssets';

const DEFAULT_QUOTES = [
    { text: "Breathing in, I calm body and mind. Breathing out, I smile.", author: "Thich Nhat Hanh" },
    { text: "The present moment is filled with joy and happiness.", author: "Thich Nhat Hanh" }
];

const TimerScreen = ({ sessionConfig, activeAudioId, onSelectAudio, onEndSession, setSessionAnalysis, onOpenAudioSettings }) => {
    // Logging for debug
    useEffect(() => {
        console.log("TimerScreen Mounted");
        return () => console.log("TimerScreen Unmounted");
    }, []);

    // Screen Wake Lock
    useEffect(() => {
        let wakeLock = null;

        const requestWakeLock = async () => {
            try {
                if ('wakeLock' in navigator) {
                    wakeLock = await navigator.wakeLock.request('screen');
                    console.log('Wake Lock is active');
                }
            } catch (err) {
                console.log(`${err.name}, ${err.message}`);
            }
        };

        const handleVisibilityChange = () => {
            if (wakeLock !== null && document.visibilityState === 'visible') {
                requestWakeLock();
            }
        };

        requestWakeLock();
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            if (wakeLock !== null) {
                wakeLock.release().then(() => {
                    console.log('Wake Lock released');
                });
            }
        };
    }, []);

    const { duration = 10, interval: intervalSetting = '0', audioId, note } = sessionConfig || {};
    const [quotes, setQuotes] = useState(DEFAULT_QUOTES);
    const [geminiApiKey] = useLocalStorage('gemini_api_key', '');

    // Bells
    const bellsRef = useRef(null);

    // Initializer
    const getBells = () => {
        if (!bellsRef.current && AUDIO_ASSETS) {
            console.log("Initializing Bells");
            bellsRef.current = {
                start: new Audio(AUDIO_ASSETS.START_BELL),
                interval: new Audio(AUDIO_ASSETS.INTERVAL_BELL),
                end: new Audio(AUDIO_ASSETS.END_BELL)
            };
        }
        return bellsRef.current;
    };

    const playBell = (type) => {
        const bells = getBells();
        if (bells && bells[type]) {
            bells[type].currentTime = 0;
            bells[type].play().catch(e => console.log('Bell play warn:', e));
        }
    };

    const onComplete = () => {
        console.log("Session Complete");
        playBell('end');
        onEndSession();
    };

    const onInterval = (current, total) => {
        if (!intervalSetting || intervalSetting === '0') return;

        if (intervalSetting === 'half') {
            const halfPoint = (duration * 60) / 2;
            if (current === halfPoint) playBell('interval');
        } else {
            const min = parseInt(intervalSetting);
            if (min > 0) {
                const intervalSec = min * 60;
                const elapsed = (duration * 60) - current;
                // Ring only if strictly inside the session
                if (elapsed > 0 && elapsed % intervalSec === 0 && current > 0) {
                    playBell('interval');
                }
            }
        }
    };

    const { remainingSeconds, startTimer, stopTimer, toggleTimer, isPaused } = useTimer(duration, onComplete, onInterval);
    const { playAudio, stopAudio, pauseAudio, resumeAudio } = useAudio();
    const [savedAudios] = useLocalStorage('meditation_audios', []);

    // Swipe Logic
    const touchStartRef = useRef(null);
    const minSwipeDistance = 50;

    const onTouchStart = (e) => {
        touchStartRef.current = e.targetTouches[0].clientX;
    };

    const onTouchEnd = (e) => {
        if (!touchStartRef.current) return;
        const touchEnd = e.changedTouches[0].clientX;
        const distance = touchStartRef.current - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe || isRightSwipe) {
            handleSwipeAudio(isLeftSwipe ? 'next' : 'prev');
        }
        touchStartRef.current = null;
    };

    const handleSwipeAudio = (direction) => {
        if (!savedAudios || savedAudios.length === 0) return;

        const currentId = activeAudioId !== undefined ? activeAudioId : audioId;
        const currentIndex = savedAudios.findIndex(a => a.id === currentId);

        let newIndex;
        if (direction === 'next') {
            newIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % savedAudios.length;
        } else {
            newIndex = currentIndex === -1 ? 0 : (currentIndex - 1 + savedAudios.length) % savedAudios.length;
        }

        const nextAudio = savedAudios[newIndex];
        if (nextAudio && onSelectAudio) {
            console.log(`Swiping ${direction} to: ${nextAudio.name}`);
            onSelectAudio(nextAudio.id);
        }
    };

    useEffect(() => {
        // Start Sequence (Bells & Timer only)
        playBell('start');
        startTimer();

        return () => {
            console.log("Cleaning up TimerScreen session");
            stopAudio();
            stopTimer();
        };
    }, []);

    // Reactive Audio Handling
    useEffect(() => {
        // Use activeAudioId if provided (live switching), otherwise session config fallback
        const targetAudioId = activeAudioId !== undefined ? activeAudioId : audioId;

        if (targetAudioId && targetAudioId !== '1') { // '1' is None
            const track = savedAudios.find(a => a.id === targetAudioId);
            if (track) {
                console.log("Playing Audio:", track.name);
                playAudio(track);
            } else {
                stopAudio(); // Track not found
            }
        } else {
            console.log("Stopping Audio (None selected)");
            stopAudio();
        }
    }, [activeAudioId, audioId, savedAudios]);

    useEffect(() => {
        if (isPaused) pauseAudio();
        else resumeAudio();
    }, [isPaused]);

    useEffect(() => {
        if (note && geminiApiKey) {
            getMotivationalContent(note, geminiApiKey)
                .then(res => {
                    if (res) {
                        // Update quotes for carousel
                        setQuotes(prev => [{ text: res.quote, author: res.support }, ...prev]);
                        // Store analysis for logging
                        if (setSessionAnalysis) {
                            setSessionAnalysis(res);
                        }
                    }
                })
                .catch(err => console.log("Gemini Error", err));
        }
    }, [note, geminiApiKey]);

    const m = Math.floor(remainingSeconds / 60).toString().padStart(2, '0');
    const s = (remainingSeconds % 60).toString().padStart(2, '0');
    const totalSecs = (duration || 10) * 60;

    return (
        <div className="screen-content timer-container">
            {/* Wrapper for relative positioning */}
            <div className="timer-ring-wrapper">
                <TimerRing totalSeconds={totalSecs} remainingSeconds={remainingSeconds} />

                {/* Content Overlay */}
                <div className="timer-content-overlay">
                    {/* Quote Container */}
                    <div style={{ width: '100%', marginBottom: '20px', height: 'auto', minHeight: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <QuoteCarousel quotes={quotes} />
                    </div>

                    {/* Audio Icon with Swipe Area */}
                    <div
                        className="timer-audio-btn-wrapper"
                        onTouchStart={onTouchStart}
                        onTouchEnd={onTouchEnd}
                        style={{ padding: '20px' }} // Increase touch target
                    >
                        <button
                            className="icon-btn"
                            onClick={onOpenAudioSettings}
                            style={{
                                background: 'rgba(255,255,255,0.1)',
                                width: '40px',
                                height: '40px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backdropFilter: 'blur(4px)'
                            }}
                            title="Change Audio (Swipe Left/Right to Cycle)"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="currentColor">
                                <path d="M0 0h24v24H0V0z" fill="none" />
                                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Digital Clock - Enlarged */}
            <div className="timer-digital-clock" style={{ fontSize: '100px', fontWeight: 'bold', marginTop: '10px' }}>
                {m}:{s}
            </div>

            {/* Controls */}
            <div className="timer-controls-wrapper">
                <button className="control-btn" onClick={toggleTimer}>
                    {isPaused ? (
                        <svg xmlns="http://www.w3.org/2000/svg" height="32" viewBox="0 0 24 24" width="32" fill="currentColor">
                            <path d="M0 0h24v24H0V0z" fill="none" />
                            <path d="M8 5v14l11-7L8 5z" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" height="32" viewBox="0 0 24 24" width="32" fill="currentColor">
                            <path d="M0 0h24v24H0V0z" fill="none" />
                            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                        </svg>
                    )}
                </button>
                <button className="control-btn stop" onClick={() => { stopTimer(); onEndSession(); }}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="32" viewBox="0 0 24 24" width="32" fill="currentColor">
                        <path d="M0 0h24v24H0V0z" fill="none" />
                        <path d="M6 6h12v12H6z" />
                    </svg>
                </button>
            </div>
        </div>
    );
};
export default TimerScreen;
