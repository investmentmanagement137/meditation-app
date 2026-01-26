import React, { useState, useEffect } from 'react';
import BaseModal from '../components/BaseModal';

const DAYS = [
    { label: 'S', value: 0 },
    { label: 'M', value: 1 },
    { label: 'T', value: 2 },
    { label: 'W', value: 3 },
    { label: 'T', value: 4 },
    { label: 'F', value: 5 },
    { label: 'S', value: 6 },
];

const TimePickerModal = ({ isOpen, onClose, onSave, initialTime = "08:00", initialDays = [0, 1, 2, 3, 4, 5, 6], title = "Set Time" }) => {
    const [time, setTime] = useState(initialTime);
    const [selectedDays, setSelectedDays] = useState(initialDays);

    useEffect(() => {
        if (isOpen) {
            setTime(initialTime);
            setSelectedDays(initialDays || [0, 1, 2, 3, 4, 5, 6]);
        }
    }, [isOpen, initialTime, initialDays]);

    const toggleDay = (dayValue) => {
        if (selectedDays.includes(dayValue)) {
            // Prevent deselecting all days?? No, let them, but maybe warn?
            setSelectedDays(selectedDays.filter(d => d !== dayValue));
        } else {
            setSelectedDays([...selectedDays, dayValue]);
        }
    };

    const handleSave = () => {
        onSave(time, selectedDays);
        onClose();
    };

    return (
        <BaseModal isOpen={isOpen} onClose={onClose} title={title}>
            <div className="time-picker-container">
                <div className="time-input-wrapper">
                    <input
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="modal-time-input"
                    />
                </div>

                {/* Day Selector */}
                <div className="day-selector">
                    <span className="section-label">Repeat</span>
                    <div className="days-grid">
                        {DAYS.map(day => (
                            <button
                                key={day.value}
                                className={`day-btn ${selectedDays.includes(day.value) ? 'active' : ''}`}
                                onClick={() => toggleDay(day.value)}
                            >
                                {day.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="modal-actions">
                    <button className="modal-btn secondary" onClick={onClose}>
                        Cancel
                    </button>
                    <button className="modal-btn primary" onClick={handleSave}>
                        Save
                    </button>
                </div>
            </div>

            <style>{`
                .time-picker-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 24px;
                    padding-top: 10px;
                }

                .time-input-wrapper {
                    position: relative;
                    background: var(--surface);
                    border: 2px solid var(--primary);
                    border-radius: 24px;
                    padding: 8px 16px;
                    box-shadow: 0 4px 20px rgba(99, 102, 241, 0.15);
                }

                .modal-time-input {
                    font-size: 2.5rem;
                    font-weight: 700;
                    color: var(--text-primary);
                    background: transparent;
                    border: none;
                    outline: none;
                    font-family: 'Outfit', sans-serif;
                    text-align: center;
                    width: 100%;
                }
                .modal-time-input::-webkit-calendar-picker-indicator {
                    filter: invert(1) opacity(0.5);
                    cursor: pointer;
                    display: block;
                    margin: 0 auto;
                    margin-top: 0px; 
                }
                .light .modal-time-input::-webkit-calendar-picker-indicator {
                    filter: opacity(0.5);
                }

                .day-selector {
                    width: 100%;
                }
                .section-label {
                    font-size: 0.85rem;
                    color: var(--text-secondary);
                    font-weight: 600;
                    margin-bottom: 12px;
                    display: block;
                    text-align: center;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                .days-grid {
                    display: flex;
                    justify-content: space-between;
                    gap: 8px;
                }
                .day-btn {
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    border: 1px solid var(--border-line);
                    background: var(--surface);
                    color: var(--text-secondary);
                    font-weight: 600;
                    font-size: 0.85rem;
                    cursor: pointer;
                    transition: all 0.2s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .day-btn.active {
                    background: var(--primary);
                    color: white;
                    border-color: var(--primary);
                    box-shadow: 0 2px 8px rgba(99, 102, 241, 0.3);
                }

                .modal-actions {
                    display: flex;
                    gap: 16px;
                    width: 100%;
                    margin-top: 8px;
                }

                .modal-btn {
                    flex: 1;
                    padding: 14px;
                    border-radius: 16px;
                    font-size: 1rem;
                    font-weight: 600;
                    border: none;
                    cursor: pointer;
                    transition: transform 0.2s;
                }
                .modal-btn:active {
                    transform: scale(0.98);
                }
                .modal-btn.secondary {
                    background: var(--surface);
                    color: var(--text-secondary);
                    border: 1px solid var(--border-line);
                }
                .modal-btn.primary {
                    background: var(--primary);
                    color: white;
                    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
                }
            `}</style>
        </BaseModal>
    );
};

export default TimePickerModal;
