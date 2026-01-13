import React, { useState } from 'react';
import BaseModal from '../components/BaseModal';

const STANDARD_INTERVALS = [
    { id: '0', label: 'None' },
    { id: 'half', label: 'Halfway' },
    { id: '1', label: 'Every Minute' },
    { id: '5', label: 'Every 5 Minutes' },
    { id: '10', label: 'Every 10 Minutes' }
];

const IntervalModal = ({ isOpen, onClose, onSelect, currentInterval, customIntervals, setCustomIntervals }) => {
    const [isAddMode, setIsAddMode] = useState(false);
    const [newInterval, setNewInterval] = useState('');

    const handleAddCustom = () => {
        if (newInterval && !isNaN(newInterval)) {
            setCustomIntervals(prev => [...prev, { id: newInterval, label: `Every ${newInterval} Min` }]);
            onSelect(newInterval);
            setIsAddMode(false);
            setNewInterval('');
            onClose();
        }
    };

    const handleDelete = (id, e) => {
        e.stopPropagation();
        setCustomIntervals(prev => prev.filter(i => i.id !== id));
    };

    const allIntervals = [...STANDARD_INTERVALS, ...customIntervals];

    return (
        <BaseModal isOpen={isOpen} onClose={onClose} title="Interval Bells">
            {!isAddMode ? (
                <div className="audio-list">
                    {allIntervals.map(i => (
                        <div
                            key={i.id}
                            className={`audio-item ${currentInterval === i.id ? 'selected' : ''}`}
                            onClick={() => { onSelect(i.id); onClose(); }}
                        >
                            <span>{i.label}</span>
                            {!STANDARD_INTERVALS.find(s => s.id === i.id) && (
                                <span className="delete-btn" onClick={(e) => handleDelete(i.id, e)}>&times;</span>
                            )}
                        </div>
                    ))}
                    <button className="add-track-btn" onClick={() => setIsAddMode(true)}>
                        + Add Custom Interval
                    </button>
                </div>
            ) : (
                <div>
                    <p style={{ marginBottom: '8px' }}>Enter interval in minutes:</p>
                    <input
                        type="number"
                        className="input-field"
                        value={newInterval}
                        onChange={(e) => setNewInterval(e.target.value)}
                    />
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="btn-primary" onClick={handleAddCustom} style={{ flex: 1 }}>Add</button>
                        <button className="btn-primary" onClick={() => setIsAddMode(false)} style={{ flex: 1, background: 'transparent', border: '1px solid var(--text-secondary)' }}>Cancel</button>
                    </div>
                </div>
            )}
        </BaseModal>
    );
};

export default IntervalModal;
