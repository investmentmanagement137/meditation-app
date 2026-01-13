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

const TimerScreen = ({ sessionConfig, onEndSession }) => {
    // Logging for debug
    useEffect(() => {
        console.log("TimerScreen Mounted");
        return () => console.log("TimerScreen Unmounted");
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

    useEffect(() => {
        // Start Sequence
        playBell('start');
        startTimer();

        if (audioId) {
            const track = savedAudios.find(a => a.id === audioId);
            if (track) {
                console.log("Playing Audio:", track.name);
                playAudio(track);
            }
        }

        return () => {
            console.log("Cleaning up TimerScreen session");
            stopAudio();
            stopTimer();
        };
    }, []);

    useEffect(() => {
        if (isPaused) pauseAudio();
        else resumeAudio();
    }, [isPaused]);

    useEffect(() => {
        if (note && geminiApiKey) {
            getMotivationalContent(note, geminiApiKey).catch(err => console.log("Gemini Error", err)).then(res => {
                if (res) setQuotes(prev => [{ text: res.quote, author: res.support }, ...prev]);
            });
        }
    }, [note, geminiApiKey]);

    const m = Math.floor(remainingSeconds / 60).toString().padStart(2, '0');
    const s = (remainingSeconds % 60).toString().padStart(2, '0');
    const totalSecs = (duration || 10) * 60;

    return (
        <div className="screen-content timer-container" style={{ justifyContent: 'center' }}>
            {/* 
               Wrapper for relative positioning. 
               TimerRing is 320x320. We make this wrapper same size or allow it to hug content.
            */}
            <div style={{ position: 'relative', width: '320px', height: '320px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <TimerRing totalSeconds={totalSecs} remainingSeconds={remainingSeconds} />

                {/* 
                   Content Overlay
                   Positioned absolute to cover the ring area.
                   Flexbox centers content internally.
                */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '40px', // Parsing padding to avoid hitting ring border
                    zIndex: 10
                }}>
                    {/* Quote Container - Reduced size in CSS usually, let's allow it to fit */}
                    <div style={{ width: '100%', marginBottom: '10px', height: 'auto', minHeight: '60px' }}>
                        <QuoteCarousel quotes={quotes} />
                    </div>

                    {/* Digital Clock - Adjusted size for inside ring */}
                    <div className="digital-clock" style={{ fontSize: '48px', marginTop: '0', lineHeight: 1 }}>
                        {m}:{s}
                    </div>
                </div>
            </div>

            {/* Controls remain outside/below */}
            {/* Controls moved to bottom */}
            <div className="timer-controls" style={{
                position: 'absolute',
                bottom: 'calc(50px + env(safe-area-inset-bottom))',
                width: '100%',
                maxWidth: '300px',
                display: 'flex',
                justifyContent: 'center',
                gap: '20px'
            }}>
                <button className="control-btn" onClick={toggleTimer}>{isPaused ? '▶' : '⏸'} </button>
                <button className="control-btn stop" onClick={() => { stopTimer(); onEndSession(); }}>⏹</button>
            </div>
        </div>
    );
};
export default TimerScreen;
