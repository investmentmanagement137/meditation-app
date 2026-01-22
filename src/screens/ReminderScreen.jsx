import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Bell, Plus, Trash2, Clock } from 'lucide-react';
import TimePickerModal from '../modals/TimePickerModal';

const ReminderScreen = ({ reminders = [], setReminders }) => {
    const navigate = useNavigate();
    const [isPermissionGranted, setIsPermissionGranted] = useState(false);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [modalTime, setModalTime] = useState("08:00");
    const [modalDays, setModalDays] = useState([0, 1, 2, 3, 4, 5, 6]);

    // --- Aggressive Permission Check ---
    useEffect(() => {
        const requestPermission = async () => {
            if (Notification.permission === 'granted') {
                setIsPermissionGranted(true);
            } else if (Notification.permission !== 'denied') {
                // Aggressively request if not denied
                const permission = await Notification.requestPermission();
                setIsPermissionGranted(permission === 'granted');
            }
        };
        requestPermission();
    }, []);

    // --- Modal Handlers ---
    const openAddModal = () => {
        setEditingId(null);
        // Default time: next hour
        const now = new Date();
        now.setHours(now.getHours() + 1);
        now.setMinutes(0);
        const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        setModalTime(timeStr);
        setModalDays([0, 1, 2, 3, 4, 5, 6]); // Default: Every day
        setIsModalOpen(true);
    };

    const openEditModal = (id, currentTime, currentDays) => {
        setEditingId(id);
        setModalTime(currentTime);
        setModalDays(currentDays || [0, 1, 2, 3, 4, 5, 6]);
        setIsModalOpen(true);
    };

    const handleSaveReminder = (time, days) => {
        if (editingId) {
            // Edit existing
            setReminders(reminders.map(r => r.id === editingId ? { ...r, time, days } : r));
        } else {
            // Create new
            const newReminder = {
                id: Date.now(),
                time,
                days: days,
                enabled: true
            };
            setReminders([...reminders, newReminder]);
        }
        setIsModalOpen(false);
    };

    const deleteReminder = (id) => {
        setReminders(reminders.filter(r => r.id !== id));
    };

    const toggleReminder = (id) => {
        setReminders(reminders.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
    };

    // Helper: Format Days String
    const getDaysLabel = (days) => {
        if (!days || days.length === 7) return "Every Day";
        if (days.length === 0) return "Never";
        if (days.length === 2 && days.includes(0) && days.includes(6)) return "Weekends";
        if (days.length === 5 && !days.includes(0) && !days.includes(6)) return "Weekdays"; // 1-5

        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        // Sort days to ensure order
        const sortedDays = [...days].sort((a, b) => a - b);
        return sortedDays.map(d => dayNames[d]).join(', ');
    };

    return (
        <div className="screen-content">
            {/* Header */}
            <div className="screen-header">
                <button
                    className="back-button"
                    onClick={() => navigate(-1)}
                >
                    <ChevronLeft size={28} />
                </button>
                <h2 className="screen-title">Daily Reminders</h2>
                <button className="add-button" onClick={openAddModal}>
                    <Plus size={28} />
                </button>
            </div>

            <div className="settings-container" style={{ padding: '20px 0', paddingBottom: '100px', width: '100%' }}>

                {/* Hero Illustration */}
                <div style={{ marginTop: '10px', marginBottom: '30px', display: 'flex', justifyContent: 'center' }}>
                    <div className={`pulse-circle ${reminders.some(r => r.enabled) ? 'active' : ''}`}>
                        <Bell size={40} color="white" fill={reminders.some(r => r.enabled) ? "white" : "none"} />
                    </div>
                </div>

                {!isPermissionGranted && (
                    <div className="permission-banner" onClick={() => Notification.requestPermission()}>
                        <span>⚠️ Enable Notifications for reminders to work</span>
                    </div>
                )}

                {reminders.length === 0 ? (
                    <div className="empty-state">
                        <p>No reminders set.</p>
                        <button className="primary-btn-small" onClick={openAddModal}>
                            Add Your First Reminder
                        </button>
                    </div>
                ) : (
                    /* List View */
                    <div className="reminders-list">
                        {reminders.map(reminder => (
                            <div key={reminder.id} className={`reminder-card ${reminder.enabled ? 'active-card' : ''}`}>
                                <div
                                    className="reminder-time-wrapper"
                                    onClick={() => openEditModal(reminder.id, reminder.time, reminder.days)}
                                >
                                    {/* Visible Styled Time */}
                                    <div className="time-display">
                                        {(() => {
                                            const [h, m] = reminder.time.split(':');
                                            const hour = parseInt(h);
                                            const ampm = hour >= 12 ? 'PM' : 'AM';
                                            const hour12 = hour % 12 || 12;
                                            return (
                                                <>
                                                    <span className="time-value">{hour12}:{m}</span>
                                                    <span className="time-ampm">{ampm}</span>
                                                </>
                                            );
                                        })()}
                                    </div>
                                    <span className="reminder-label">
                                        <Clock size={12} style={{ marginRight: '4px', verticalAlign: 'text-bottom' }} />
                                        {getDaysLabel(reminder.days)}
                                    </span>
                                </div>

                                <div className="reminder-actions">
                                    <div
                                        className={`toggle-switch ${reminder.enabled ? 'on' : 'off'}`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleReminder(reminder.id);
                                        }}
                                    >
                                        <div className="toggle-knob" />
                                    </div>
                                    <button
                                        className="delete-btn"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            deleteReminder(reminder.id);
                                        }}
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Time Picker Modal */}
            <TimePickerModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveReminder}
                initialTime={modalTime}
                initialDays={modalDays}
                title={editingId ? "Edit Reminder" : "New Reminder"}
            />

            <style>{`
                .screen-header {
                    display: grid;
                    grid-template-columns: 48px 1fr 48px; 
                    align-items: center;
                    padding: 0 16px; 
                    margin-bottom: 0px;
                }
                .back-button, .add-button {
                    background: none;
                    border: none;
                    cursor: pointer;
                    color: var(--text-primary);
                    padding: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 48px;
                    width: 48px;
                }
                .add-button {
                    color: var(--primary-light);
                }
                .screen-title {
                    text-align: center;
                    margin: 0;
                    font-size: 1.25rem;
                    font-weight: 600;
                }

                .pulse-circle {
                    width: 80px; height: 80px;
                    border-radius: 50%;
                    background: var(--surface);
                    border: 2px solid var(--border-line);
                    display: flex; 
                    align-items: center; 
                    justify-content: center;
                    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
                .pulse-circle.active {
                    background: var(--primary);
                    border-color: var(--primary);
                    box-shadow: 0 0 0 12px rgba(99, 102, 241, 0.2);
                    transform: scale(1.05);
                }

                .permission-banner {
                    background: rgba(239, 68, 68, 0.15);
                    color: #f87171;
                    padding: 12px;
                    border-radius: 12px;
                    font-size: 13px;
                    text-align: center;
                    margin: 0 20px 20px 20px;
                    cursor: pointer;
                }

                .empty-state {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    color: var(--text-secondary);
                    margin-top: 40px;
                }
                .primary-btn-small {
                    margin-top: 24px;
                    background: var(--primary);
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 24px;
                    font-weight: 600;
                    cursor: pointer;
                    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
                }

                .reminders-list {
                    display: flex;
                    flex-direction: column;
                    gap: 1px; /* Minimal gap for list feel */
                    border-top: 1px solid var(--border-line);
                    border-bottom: 1px solid var(--border-line);
                }

                .reminder-card {
                    background: var(--surface);
                    /* Full Width Styling */
                    border: none;
                    border-radius: 0;
                    padding: 24px 20px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    transition: background 0.2s;
                    border-bottom: 1px solid var(--border-line);
                }
                .reminder-card:last-child {
                    border-bottom: none;
                }
                .reminder-card:active {
                    background: var(--surface-hover);
                }
              
                .reminder-time-wrapper {
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                    cursor: pointer;
                    flex: 1; /* Take available space */
                }
                
                .time-display {
                    display: flex;
                    align-items: baseline;
                    gap: 8px;
                }

                .time-value {
                    font-size: 32px;
                    font-weight: 700;
                    color: var(--text-primary);
                    font-family: 'Outfit', sans-serif;
                    letter-spacing: -1px;
                }
                .time-ampm {
                    font-size: 15px;
                    font-weight: 600;
                    color: var(--text-secondary);
                    text-transform: uppercase;
                }

                .reminder-label {
                    font-size: 13px;
                    color: var(--primary-light);
                    font-weight: 500;
                    letter-spacing: 0.3px;
                }

                .reminder-actions {
                    display: flex;
                    align-items: center;
                    gap: 20px;
                }

                .toggle-switch {
                    width: 52px;
                    height: 30px;
                    background: var(--border-line);
                    border-radius: 15px;
                    position: relative;
                    cursor: pointer;
                    transition: background 0.3s ease;
                }
                .toggle-switch.on {
                    background: var(--primary);
                }
                .toggle-knob {
                    width: 26px;
                    height: 26px;
                    background: white;
                    border-radius: 50%;
                    position: absolute;
                    top: 2px;
                    left: 2px;
                    transition: transform 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                .toggle-switch.on .toggle-knob {
                    transform: translateX(22px);
                }

                .delete-btn {
                    background: none;
                    border: none;
                    color: var(--text-secondary);
                    cursor: pointer;
                    display: flex;
                    padding: 8px;
                    border-radius: 50%;
                    transition: all 0.2s;
                    opacity: 0.4;
                }
                .delete-btn:hover {
                    background: rgba(239, 68, 68, 0.1);
                    color: #ef4444;
                    opacity: 1;
                }

            `}</style>
        </div>
    );
};

export default ReminderScreen;
