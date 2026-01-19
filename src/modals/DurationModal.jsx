import React, { useState } from 'react';
import BaseModal from '../components/BaseModal';

const DurationModal = ({ isOpen, onClose, onSelect, durations, setDurations }) => {
    const [customVal, setCustomVal] = useState('');

    const handleAdd = () => {
        const val = parseInt(customVal);
        if (val && val > 0 && !durations.includes(val)) {
            // Limit to max 6 saved values with FIFO eviction
            // We append the new value to the end.
            let newDurations = [...durations, val];

            // If we exceed 6, we remove the "oldest" value.
            // Since we append to the end, the oldest value is at index 0.
            if (newDurations.length > 6) {
                newDurations = newDurations.slice(newDurations.length - 6);
            }
            setDurations(newDurations);
            onSelect(val);
            onClose();
            setCustomVal('');
        }
    };

    return (
        <BaseModal isOpen={isOpen} onClose={onClose} title="Add Duration">
            <div style={{ padding: '10px 0' }}>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
                    Enter duration in minutes:
                </p>
                <input
                    type="number"
                    className="input-field"
                    value={customVal}
                    onChange={(e) => setCustomVal(e.target.value)}
                    autoFocus
                />
                <button className="btn-primary" onClick={handleAdd}>
                    Add Duration
                </button>
            </div>
        </BaseModal>
    );
};

export default DurationModal;
