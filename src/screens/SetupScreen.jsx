import React from 'react';
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

    return (
        <div className="screen-content">
            <div className="screen-header" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                    {getGreeting()}
                </div>

                <button className="icon-btn" onClick={() => {
                    const root = document.documentElement;
                    const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

                    if (root.classList.contains('dark')) {
                        // Was forced Dark -> Go Light
                        root.classList.remove('dark');
                        root.classList.add('light');
                        localStorage.setItem('theme', 'light');
                    } else if (root.classList.contains('light')) {
                        // Was forced Light -> Go Dark
                        root.classList.remove('light');
                        root.classList.add('dark');
                        localStorage.setItem('theme', 'dark');
                    } else {
                        // No class (System Default)
                        if (isSystemDark) {
                            // System is Dark -> Force Light
                            root.classList.add('light');
                            localStorage.setItem('theme', 'light');
                        } else {
                            // System is Light -> Force Dark
                            root.classList.add('dark');
                            localStorage.setItem('theme', 'dark');
                        }
                    }
                }}>
                    <div className="theme-toggle-icon">
                        {/* Simple Sun/Moon using CSS or let's use Lucide if imported, but strictly replacing existing block */}
                        {/* User asked for Theme Icon. I will use a generic one or import if I can see imports. */
                            /* I'll use inline SVG for reliability as I can't easily add imports in this chunks without context of top file */
                        }
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="5"></circle>
                            <line x1="12" y1="1" x2="12" y2="3"></line>
                            <line x1="12" y1="21" x2="12" y2="23"></line>
                            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                            <line x1="1" y1="12" x2="3" y2="12"></line>
                            <line x1="21" y1="12" x2="23" y2="12"></line>
                            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                        </svg>
                    </div>
                </button>
            </div>

            <DurationSelector
                durations={sortedDurations}
                selectedDuration={selectedDuration}
                onSelect={setSelectedDuration}
                onAddClick={openDurationModal}
            />


            <div className="setup-section">
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
                    <label className="notes-label">Intention (Optional)</label>
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

            {/* Bottom Controls - Fixed above Nav */}
            <div className="sticky-action-bar">
                <button className="btn-primary btn-begin" onClick={handleStart}>Start Session</button>
            </div>
        </div>
    );
};
export default SetupScreen;
