import React, { useState } from 'react';
import BaseModal from '../components/BaseModal';

const STANDARD_INTERVALS = [
    { id: '0', label: 'None' },
    { id: 'half', label: 'Halfway' },
    { id: '1', label: 'Every Minute' },
    { id: '5', label: 'Every 5 Minutes' },
    { id: '10', label: 'Every 10 Minutes' }
];

const IntervalModal = ({ isOpen, onClose, onSelect, currentInterval }) => {

    return (
        <BaseModal isOpen={isOpen} onClose={onClose} title="Select Interval">
            <div style={{ padding: '10px 0' }}>

                <div className="audio-list">
                    {STANDARD_INTERVALS.map(i => (
                        <div
                            key={i.id}
                            className={`audio-item ${currentInterval === i.id ? 'selected' : ''}`}
                            onClick={() => { onSelect(i.id); onClose(); }}
                        >
                            <span>{i.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </BaseModal>
    );
};

export default IntervalModal;
