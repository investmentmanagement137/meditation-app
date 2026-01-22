import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
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

// --- Analog Clock Component ---
const AnalogClock = ({ totalSeconds, remainingSeconds }) => {
    // We want the clock hands to reflect *progress* or *time*?
    // User asked for "Analogue clock". Usually implies real-time or elapsed time visually. 
    // Let's make it a standard decorative analog clock that perhaps moves fast or just static?
    // OR: A clock that represents the *remaining time* like a timer dial?
    // The request said "digital and analogue clock options", implying replacing the 05:00 text.
    // So let's make a visual clock face that shows the countdown minute/second hands.

    const strokeWidth = 2;
    const radius = 20; // smaller inside the ring
    const center = 50; // svg viewBox center

    // Calculate angles
    // Seconds hand: 60s = 360deg
    const sec = remainingSeconds % 60;
    const secAngle = (sec / 60) * 360;

    // Minute hand: duration minutes = 360deg? Or standard clock face?
    // Standard clock face makes most sense for "Analog Clock".
    // 00:00 -> hands at top. 
    const min = Math.floor(remainingSeconds / 60);
    // Let's assume max 60 min face for simplicity of an analog timer
    const minAngle = (min / 60) * 360 + (sec / 60) * 6;

    return (
        <div className="analog-clock-wrapper" style={{ width: '120px', height: '120px', position: 'relative' }}>
            <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                {/* Clock Face */}
                <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.1" />

                {/* Minute Hand */}
                <line
                    x1="50" y1="50"
                    x2={50 + 35 * Math.cos(minAngle * Math.PI / 180)}
                    y2={50 + 35 * Math.sin(minAngle * Math.PI / 180)}
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                />

                {/* Second Hand */}
                <line
                    x1="50" y1="50"
                    x2={50 + 40 * Math.cos(secAngle * Math.PI / 180)}
                    y2={50 + 40 * Math.sin(secAngle * Math.PI / 180)}
                    stroke="var(--primary)"
                    strokeWidth="2"
                    strokeLinecap="round"
                />

                {/* Center Dot */}
                <circle cx="50" cy="50" r="3" fill="currentColor" />
            </svg>
        </div>
    );
};

const TimerScreen = ({ sessionConfig, activeAudioId, onSelectAudio, onEndSession, setSessionAnalysis, onOpenAudioSettings, clockLayout, startSound, intervalSound }) => {
    const navigate = useNavigate();

    // Logging for debug
    useEffect(() => {
        console.log("TimerScreen Mounted");
        return () => console.log("TimerScreen Unmounted");
    }, []);

    // Redirect if no session config (e.g. direct URL access)
    useEffect(() => {
        if (!sessionConfig || !sessionConfig.sessionKey) {
            console.log("No authentic session found, redirecting to Home");
            navigate('/');
        }
    }, [sessionConfig, navigate]);

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

    // --- Preferences ---
    const [totalSilence] = useLocalStorage('pref_total_silence', false);
    const [disableQuotes] = useLocalStorage('pref_minimal_design', false); // "Disable Quotes"

    // Bells
    const bellsRef = useRef(null);

    // Initializer
    const getBells = () => {
        if (!bellsRef.current && AUDIO_ASSETS) {
            console.log("Initializing Bells");
            bellsRef.current = {
                'bell-1': new Audio(AUDIO_ASSETS.START_BELL),
                'bell-2': new Audio(AUDIO_ASSETS.INTERVAL_BELL),
                'end': new Audio(AUDIO_ASSETS.END_BELL) // End bell usually fixed, optionally could be configurable
            };
        }
        return bellsRef.current;
    };

    const playBell = (type) => {
        if (totalSilence) return; // Mute all bells if Total Silence is ON

        // type: 'start', 'interval', 'end'
        const bells = getBells();
        if (!bells) return;

        let soundKey;
        if (type === 'start') soundKey = startSound;
        else if (type === 'interval') soundKey = intervalSound;
        else soundKey = 'end'; // 'end' bell fixed for now unless requested

        if (soundKey === 'none') {
            console.log(`Skipping ${type} bell (None selected)`);
            return;
        }

        // Map start/interval types to specific asset keys if using generic names in storage
        // But here we stored 'bell-1', 'bell-2' directly. 
        // Fallback or mapping:
        const audioObj = bells[soundKey] || bells['bell-1']; // Default fallback if key not found?

        // Actually, if soundKey is 'bell-1' or 'bell-2' that matches our keys.
        // If type is 'end', soundKey is 'end'.

        if (audioObj) {
            audioObj.currentTime = 0;
            audioObj.play().catch(e => console.log('Bell play warn:', e));
        }
    };

    const onComplete = () => {
        console.log("Session Complete");
        playBell('end');
        // Full duration completed
        onEndSession(duration);
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

        if (totalSilence) {
            console.log("Total Silence Active - Muting Audio");
            stopAudio();
            return;
        }

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
    }, [activeAudioId, audioId, savedAudios, totalSilence]); // Added totalSilence dependency

    useEffect(() => {
        if (isPaused) pauseAudio();
        else resumeAudio();
    }, [isPaused]);

    useEffect(() => {
        if (note && geminiApiKey) {
            getMotivationalContent(note, geminiApiKey)
                .then(res => {
                    if (res) {
                        // Replace quotes with AI-generated content (don't mix with defaults)
                        setQuotes([{ text: res.quote, author: res.support }]);
                        // Store analysis for logging
                        if (setSessionAnalysis) {
                            setSessionAnalysis(res);
                        }
                    }
                })
                .catch(err => console.log("Gemini Error", err));
        }
    }, [note, geminiApiKey]);

    // Digital Clock & Total Seconds for Ring
    const m = Math.floor(remainingSeconds / 60).toString().padStart(2, '0');
    const s = (remainingSeconds % 60).toString().padStart(2, '0');
    const totalSecs = (duration || 10) * 60;

    const onManualStop = () => {
        stopTimer();
        // Calculate elapsed minutes based on totalSecs defined in component scope
        const elapsedSecs = totalSecs - remainingSeconds;
        const elapsedMinutes = Math.floor(elapsedSecs / 60);
        onEndSession(elapsedMinutes);
    };

    return (
        <div className="screen-content timer-container">
            {/* Clock Display Logic - reused for positioning */}
            {(() => {
                const ClockDisplay = (
                    <div className={`timer-clock-display ${clockLayout === 'analog' ? 'analog-mode' : ''}`}>
                        {clockLayout === 'analog' ? (
                            <AnalogClock totalSeconds={totalSecs} remainingSeconds={remainingSeconds} />
                        ) : (
                            <div className="timer-digital-clock">
                                {m}:{s}
                            </div>
                        )}
                    </div>
                );

                return (
                    <>
                        {/* Wrapper for relative positioning */}
                        <div className="timer-ring-wrapper">
                            {/* Ring hidden if 'Disable Quotes' (Minimal Design) is ON */}
                            {!disableQuotes && (
                                <TimerRing totalSeconds={totalSecs} remainingSeconds={remainingSeconds} />
                            )}

                            {/* Content Overlay */}
                            <div className="timer-content-overlay">
                                {/* Clock MOVED HERE if Disable Quotes is ON (Centered) */}
                                {disableQuotes && ClockDisplay}

                                {/* Quote Container - Hidden if Disable Quotes is checked */}
                                {!disableQuotes && (
                                    <div className="timer-quote-container">
                                        <QuoteCarousel quotes={quotes} />
                                    </div>
                                )}

                                {/* Audio Icon with Swipe Area */}
                                <div
                                    className="timer-audio-btn-wrapper"
                                    onTouchStart={onTouchStart}
                                    onTouchEnd={onTouchEnd}
                                >
                                    <button
                                        className="icon-btn timer-audio-btn"
                                        onClick={onOpenAudioSettings}
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

                        {/* Clock at BOTTOM if Disable Quotes is OFF (Standard Layout) */}
                        {!disableQuotes && ClockDisplay}
                    </>
                );
            })()}

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
                <button className="control-btn stop" onClick={onManualStop}>
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
