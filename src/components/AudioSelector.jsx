import React from 'react';

const AudioSelector = ({
    selectedAudio, // Object { id, name, type } or null
    onOpenModal
}) => {
    return (
        <div className="audio-display" onClick={onOpenModal}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', overflow: 'hidden' }}>
                <span style={{ fontSize: '20px' }}>🎵</span>
                <span
                    id="selected-audio-name"
                    style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                >
                    {selectedAudio ? selectedAudio.name : 'None'}
                </span>
            </div>
            <span style={{ color: 'var(--text-secondary)' }}>Change</span>
        </div>
    );
};

export default AudioSelector;
