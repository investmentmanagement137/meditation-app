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
                    <span style={{ fontSize: '24px', lineHeight: 1 }}>📜</span>
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
