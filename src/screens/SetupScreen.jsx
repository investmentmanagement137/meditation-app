import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import DurationSelector from '../components/DurationSelector';
import IntervalSelector from '../components/IntervalSelector';
import AudioSelector from '../components/AudioSelector';

const SetupScreen = ({
    onStartSession,
    startNote,
    setStartNote,
    openDurationModal,
    openIntervalModal,
    openAudioModal,
    openLogs,

    // Props from App
    durations,
    selectedDuration,
    setSelectedDuration,

    customIntervals,
    selectedInterval,
    // setSelectedInterval, // Passed to Selector if needed? IntervalSelector just calls onOpenModal

    savedAudios,
    selectedAudioId
}) => {

    const selectedAudio = savedAudios.find(a => a.id === selectedAudioId) || null;

    // Sort durations for display (lowest to highest)
    const sortedDurations = [...durations].sort((a, b) => a - b);

    const handleStart = () => {
        if (selectedDuration) {
            onStartSession({
                duration: selectedDuration,
                interval: selectedInterval,
                audioId: selectedAudioId,
                note: startNote
            });
        }
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 18) return 'Good Afternoon';
        return 'Good Evening';
    };

    // -- Theme Logic --
    const [isDark, setIsDark] = useState(true);

    useEffect(() => {
        const checkTheme = () => {
            const root = document.documentElement;
            // Check class list or localStorage
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme === 'light') {
                setIsDark(false);
            } else if (savedTheme === 'dark') {
                setIsDark(true);
            } else {
                // System preference
                const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                setIsDark(isSystemDark);
            }
        };
        checkTheme();
    }, []);

    const toggleTheme = () => {
        const root = document.documentElement;
        if (root.classList.contains('dark')) {
            root.classList.remove('dark');
            root.classList.add('light');
            localStorage.setItem('theme', 'light');
            setIsDark(false);
        } else {
            root.classList.remove('light');
            root.classList.add('dark');
            localStorage.setItem('theme', 'dark');
            setIsDark(true);
        }
    };

    return (
        <>
            <div className="screen-content">
                <div className="screen-header" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                        {getGreeting()}
                    </div>

                    <button
                        className="theme-toggle"
                        onClick={toggleTheme}
                        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                    >
                        <span className={`toggle-track ${isDark ? 'dark' : 'light'}`}>
                            <span className="toggle-thumb">
                                {isDark ? <Moon size={16} /> : <Sun size={16} />}
                            </span>
                        </span>
                    </button>
                </div>

                <div className="setup-section">
                    <div style={{ marginBottom: '24px' }}>
                        <div className="section-title">Select Duration</div>
                        <DurationSelector
                            durations={sortedDurations}
                            selectedDuration={selectedDuration}
                            onSelect={setSelectedDuration}
                            onAddClick={openDurationModal}
                        />
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <div className="section-title">Interval Bells</div>
                        <IntervalSelector
                            onOpenModal={openIntervalModal}
                            selectedInterval={selectedInterval}
                            customIntervals={customIntervals}
                        />
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <div className="section-title">Background Audio</div>
                        <AudioSelector selectedAudio={selectedAudio} onOpenModal={openAudioModal} />
                    </div>

                    <div className="notes-section">
                        <div className="section-title">Intention (Optional)</div>
                        <textarea
                            className="notes-input"
                            placeholder="What is your intention for this session?"
                            value={startNote}
                            onChange={(e) => setStartNote(e.target.value)}
                            onFocus={(e) => {
                                setTimeout(() => {
                                    e.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                }, 300);
                            }}
                        ></textarea>
                    </div>
                </div>
            </div>

            {/* Bottom Controls - Fixed above Nav */}
            <div className="sticky-action-bar">
                <button className="btn-primary btn-begin" onClick={handleStart}>Start Session</button>
            </div>
        </>
    );
};
export default SetupScreen;
