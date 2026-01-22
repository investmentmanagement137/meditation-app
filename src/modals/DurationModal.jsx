import React, { useState } from 'react';
import BaseModal from '../components/BaseModal';

const DurationModal = ({ isOpen, onClose, onSelect, durations, setDurations }) => {
    const [error, setError] = useState('');
    const [shake, setShake] = useState(false);
    const [customVal, setCustomVal] = useState('');

    const handleAdd = () => {
        const val = parseInt(customVal);

        if (!val || val <= 0) {
            setShake(true);
            setTimeout(() => setShake(false), 500);
            return;
        }

        if (durations.includes(val)) {
            // User feedback change: Just select it if it exists
            onSelect(val);
            setCustomVal('');
            setError('');
            onClose();
            return;
        }

        // Limit to max 5 saved values with FIFO eviction
        let newDurations = [...durations, val];
        if (newDurations.length > 5) {
            newDurations = newDurations.slice(newDurations.length - 5);
        }
        setDurations(newDurations);
        onSelect(val);
        setCustomVal('');
        setError('');
        onClose();
    };

    return (
        <BaseModal isOpen={isOpen} onClose={() => { setError(''); setCustomVal(''); onClose(); }} title="Add Duration">
            <div style={{ padding: '10px 0' }}>
                {/* Duration Input */}
                <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
                    Enter duration in minutes:
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div className={shake ? 'shake-anim' : ''} style={{ display: 'flex', gap: '8px' }}>
                        <input
                            type="number"
                            className="input-field"
                            value={customVal}
                            onChange={(e) => { setCustomVal(e.target.value); setError(''); }}
                            placeholder="e.g. 45"
                            style={{ flex: 1, borderColor: error ? '#ef4444' : 'var(--border-line)' }}
                            autoFocus
                        />
                        <button
                            className="btn-primary"
                            onClick={handleAdd}
                            style={{
                                width: 'auto',
                                padding: '0 24px',
                                opacity: (!customVal || error) ? 0.7 : 1
                            }}
                        >
                            Add
                        </button>
                    </div>
                    {error && (
                        <span style={{ fontSize: '13px', color: '#ef4444', marginLeft: '4px', animation: 'fadeIn 0.2s' }}>
                            {error}
                        </span>
                    )}
                </div>
            </div>
            <style>{`
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-4px); }
                    75% { transform: translateX(4px); }
                }
                .shake-anim {
                    animation: shake 0.3s ease-in-out;
                }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            `}</style>
        </BaseModal>
    );
};

export default DurationModal;
