import React from 'react';

const AudioSelector = ({
    selectedAudio, // Object { id, name, type } or null
    onOpenModal
}) => {
    return (
        <div className="settings-row" onClick={onOpenModal}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', overflow: 'hidden' }}>
                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="currentColor" style={{ opacity: 0.9 }}>
                    <path d="M0 0h24v24H0V0z" fill="none" />
                    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                </svg>
                <span
                    id="selected-audio-name"
                    style={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        fontSize: '16px',
                        fontWeight: '500',
                        color: 'var(--text-primary)',
                        textTransform: 'capitalize'
                    }}
                >
                    {(selectedAudio?.name || 'None').toLowerCase()}
                </span>
            </div>
            <span style={{ color: 'var(--text-secondary)' }}>Change</span>
        </div>
    );
};

export default AudioSelector;
