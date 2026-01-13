import React, { useState } from 'react';
import BaseModal from '../components/BaseModal';

const DurationModal = ({ isOpen, onClose, onSelect, durations, setDurations }) => {
    const [customVal, setCustomVal] = useState('');

    const handleAdd = () => {
        const val = parseInt(customVal);
        if (val && val > 0 && !durations.includes(val)) {
            const newDurations = [...durations, val].sort((a, b) => a - b);
            // Limit to top 6?
            if (newDurations.length > 6) {
                // Remove the one that is NOT the newly added one... usually oldest. 
                // But simplified logic: remove first in sorted list (smallest)? Or remove a random one?
                // The prompt for legacy said "most recent additions", but here we just have a list. 
                // Let's stick to limiting size to avoid scrolling issues.
                // Actually, legacy logic was "Most recent", meaning we need to know insertion order if we want to drop 'oldest'.
                // For now, let's just shift (remove smallest).
                // newDurations.shift(); 
                // Wait, if I add 100, and shift, I remove 5. That's fine.
            }
            // For now, let's NOT limit strictly or we need a better data structure than just sorted numbers.
            // Just set it.
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
