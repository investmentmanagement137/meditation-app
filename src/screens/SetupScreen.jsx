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

    return (
        <div className="screen-content">
            <div className="screen-header">
                <h1 className="screen-title">Meditation</h1>
                <button className="icon-btn" onClick={openLogs} title="View Logs">
                    <svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 0 24 24" width="16" fill="currentColor">
                        <path d="M0 0h24v24H0V0z" fill="none" />
                        <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.25 2.52.77-1.28-3.52-2.13V8h-1.5z" />
                    </svg>
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

            {/* Bottom Controls */}
            <div style={{
                position: 'absolute',
                bottom: 'calc(40px + env(safe-area-inset-bottom))',
                left: '0',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 20px',
                pointerEvents: 'none',
                zIndex: 20
            }}>
                <button className="btn-primary btn-begin" onClick={handleStart} style={{ width: '100%', maxWidth: '400px', pointerEvents: 'auto' }}>Start Session</button>
            </div>
        </div>
    );
};
export default SetupScreen;
