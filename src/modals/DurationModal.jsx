import React, { useState } from 'react';
import BaseModal from '../components/BaseModal';

const DurationModal = ({ isOpen, onClose, onSelect, durations, setDurations }) => {
    const [customVal, setCustomVal] = useState('');

    const handleAdd = () => {
        const val = parseInt(customVal);
        if (val && val > 0 && !durations.includes(val)) {
            // Limit to max 6 saved values with FIFO eviction
            let newDurations = [...durations, val];
            if (newDurations.length > 6) {
                newDurations = newDurations.slice(newDurations.length - 6);
            }
            setDurations(newDurations);
            onSelect(val);
            setCustomVal('');
            onClose(); // Automatically close after adding
        }
    };

    return (
        <BaseModal isOpen={isOpen} onClose={onClose} title="Add Duration">
            <div style={{ padding: '10px 0' }}>
                {/* Duration Input */}
                <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
                    Add custom duration (minutes):
                </p>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                        type="number"
                        className="input-field"
                        value={customVal}
                        onChange={(e) => setCustomVal(e.target.value)}
                        placeholder="e.g. 45"
                        style={{ flex: 1 }}
                        autoFocus
                    />
                    <button className="btn-primary" onClick={handleAdd} style={{ width: 'auto', padding: '0 24px' }}>
                        Add
                    </button>
                </div>
            </div>
        </BaseModal>
    );
};

export default DurationModal;
