import React from 'react';
import BaseModal from '../components/BaseModal';
import { Check, BellRing, BellOff } from 'lucide-react';

const IntervalBellModal = ({ isOpen, onClose, intervalSound, setIntervalSound }) => {

    // We can hardcode audio options matching the requested "None", "Bell 2"
    const options = [
        { id: 'none', label: 'None', icon: <BellOff size={20} /> },
        { id: 'bell-2', label: 'Bell Sound 2', icon: <BellRing size={20} /> }
    ];

    return (
        <BaseModal isOpen={isOpen} onClose={onClose} title="Interval Bells">
            <div className="selection-list">
                {options.map(opt => (
                    <div
                        key={opt.id}
                        className={`selection-item ${intervalSound === opt.id ? 'selected' : ''}`}
                        onClick={() => { setIntervalSound(opt.id); onClose(); }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            {opt.icon}
                            <span>{opt.label}</span>
                        </div>
                        {intervalSound === opt.id && <Check size={18} color="var(--primary)" />}
                    </div>
                ))}
            </div>
            <style>{`
                .selection-list {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                .selection-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 16px;
                    border-radius: 12px;
                    background: var(--background);
                    border: 1px solid var(--border-color);
                    cursor: pointer;
                    font-weight: 500;
                    color: var(--text-primary);
                    transition: all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1);
                }
                .selection-item:hover {
                    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
                    transform: translateY(-2px);
                }
                .selection-item.selected {
                    background: var(--surface);
                    border-color: var(--primary);
                    color: var(--primary);
                    box-shadow: 0 0 0 1px var(--primary);
                }
            `}</style>
        </BaseModal>
    );
};

export default IntervalBellModal;
