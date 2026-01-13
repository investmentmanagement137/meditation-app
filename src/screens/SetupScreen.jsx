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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: '40px' }}>
                <h1 style={{ margin: 0 }}>Meditation Timer</h1>
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

            <div style={{ width: '100%', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.2rem', marginBottom: '16px', color: 'var(--text-secondary)' }}>Settings</h2>

                <IntervalSelector
                    onOpenModal={openIntervalModal}
                    selectedInterval={selectedInterval}
                    customIntervals={customIntervals}
                />

                <div style={{ marginBottom: '16px' }}>
                    <div className="notes-label">Background Audio</div>
                    <AudioSelector selectedAudio={selectedAudio} onOpenModal={openAudioModal} />
                </div>

                <div className="notes-section">
                    <label className="notes-label">Intention / Note (Optional)</label>
                    <textarea
                        className="notes-input"
                        placeholder="What is your intention for this session?"
                        value={startNote}
                        onChange={(e) => setStartNote(e.target.value)}
                        onFocus={(e) => {
                            // Delay slightly to allow keyboard to appear
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
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
                padding: '0 20px',
                pointerEvents: 'none' // Let clicks pass through if empty areas
            }}>
                <button className="btn-primary btn-begin" onClick={handleStart} style={{ width: '100%', maxWidth: '400px', pointerEvents: 'auto' }}>Start Session</button>
            </div>
        </div>
    );
};
export default SetupScreen;
