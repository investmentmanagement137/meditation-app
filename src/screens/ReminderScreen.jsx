import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Bell, Check, Clock } from 'lucide-react';
import useLocalStorage from '../hooks/useLocalStorage';

const ReminderScreen = () => {
    const navigate = useNavigate();
    const [reminderEnabled, setReminderEnabled] = useLocalStorage('reminder_enabled', false);
    const [reminderTime, setReminderTime] = useLocalStorage('reminder_time', '08:00');
    const [isPermissionGranted, setIsPermissionGranted] = useState(false);

    useEffect(() => {
        if (Notification.permission === 'granted') {
            setIsPermissionGranted(true);
        }
    }, []);

    const handleToggle = async (enabled) => {
        if (enabled) {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                setIsPermissionGranted(true);
                setReminderEnabled(true);
                // Send a test notification immediately to confirm
                new Notification('Reminders Enabled', {
                    body: 'You will receive a meditation reminder at ' + reminderTime,
                });
            } else {
                alert('We need notification permissions to send you reminders.');
                setReminderEnabled(false);
            }
        } else {
            setReminderEnabled(false);
        }
    };

    return (
        <div className="screen-content">
            {/* Header */}
            <div className="screen-header" style={{ display: 'grid', gridTemplateColumns: '40px 1fr 40px', alignItems: 'center', padding: '0' }}>
                <button
                    className="back-button"
                    onClick={() => navigate(-1)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-primary)', padding: '0' }}
                >
                    <ChevronLeft size={28} />
                </button>
                <h2 className="screen-title" style={{ textAlign: 'center', margin: 0 }}>Daily Reminder</h2>
                <div style={{ width: '40px' }}></div> {/* Spacer for alignment */}
            </div>

            <div className="settings-container" style={{ padding: '20px', display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'center' }}>

                {/* Hero Illustration - Pulse Effect */}
                <div style={{ marginTop: '40px', marginBottom: '40px', position: 'relative' }}>
                    <div className={`pulse-circle ${reminderEnabled ? 'active' : ''}`}>
                        <Bell size={40} color="white" fill={reminderEnabled ? "white" : "none"} />
                    </div>
                </div>

                {/* Main Action Card */}
                <div style={{ width: '100%', maxWidth: '340px' }}>
                    <h1 style={{
                        fontSize: '18px',
                        textAlign: 'center',
                        marginBottom: '8px',
                        color: 'var(--text-primary)',
                        opacity: reminderEnabled ? 1 : 0.6
                    }}>
                        {reminderEnabled ? "Reminder Active" : "Reminder Inactive"}
                    </h1>

                    <p style={{
                        textAlign: 'center',
                        color: 'var(--text-secondary)',
                        fontSize: '14px',
                        marginBottom: '32px'
                    }}>
                        {reminderEnabled ? "We'll notify you every day at the scheduled time." : "Enable reminders to build a habit."}
                    </p>

                    {/* Time Input & Toggle Container */}
                    <div className="glass-panel" style={{ padding: '24px', borderRadius: '24px', position: 'relative', overflow: 'hidden' }}>

                        {/* Toggle Row */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: reminderEnabled ? '32px' : '0' }}>
                            <span style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)' }}>Turn On</span>
                            <div
                                className={`settings-toggle ${reminderEnabled ? 'active' : ''}`}
                                onClick={() => handleToggle(!reminderEnabled)}
                            />
                        </div>

                        {/* Expandable Time Selection */}
                        <div className={`time-section ${reminderEnabled ? 'open' : ''}`}>
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: '8px' }}>
                                <input
                                    type="time"
                                    value={reminderTime}
                                    onChange={(e) => setReminderTime(e.target.value)}
                                    className="hero-time-input"
                                />
                            </div>
                            <div style={{ textAlign: 'center', marginTop: '12px' }}>
                                <span className="pill-tag">
                                    <Clock size={12} style={{ marginRight: '4px' }} />
                                    Every Day
                                </span>
                            </div>
                        </div>

                    </div>
                </div>

                {!isPermissionGranted && reminderEnabled && (
                    <div style={{ marginTop: '24px', padding: '12px 20px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', fontSize: '13px', textAlign: 'center' }}>
                        Notifications are not allowed. Please enable them in browser settings.
                    </div>
                )}
            </div>

            <style>{`
                .glass-panel {
                    background: var(--surface);
                    border: 1px solid var(--border-line);
                    box-shadow: 0 4px 20px rgba(0,0,0,0.05);
                    transition: all 0.3s ease;
                }
                
                .pulse-circle {
                    width: 80px; height: 80px;
                    border-radius: 50%;
                    background: var(--surface);
                    border: 2px solid var(--border-line);
                    display: flex; alignItems: center; justifyContent: center;
                    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
                .pulse-circle.active {
                    background: #8b5cf6;
                    border-color: #8b5cf6;
                    box-shadow: 0 0 0 10px rgba(139, 92, 246, 0.2);
                    transform: scale(1.1);
                }

                .hero-time-input {
                    font-size: 48px;
                    font-weight: 700;
                    color: var(--text-primary);
                    background: transparent;
                    border: none;
                    outline: none;
                    font-family: 'Outfit', sans-serif;
                    text-align: center;
                    width: 100%;
                    cursor: pointer;
                }
                /* Hide browser defaults */
                .hero-time-input::-webkit-calendar-picker-indicator {
                    display: none;
                }

                .time-section {
                    max-height: 0;
                    opacity: 0;
                    overflow: hidden;
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .time-section.open {
                    max-height: 150px;
                    opacity: 1;
                }

                .pill-tag {
                    display: inline-flex; alignItems: center;
                    background: rgba(139, 92, 246, 0.1);
                    color: #a78bfa;
                    padding: 4px 12px;
                    border-radius: 20px;
                    font-size: 12px;
                    font-weight: 600;
                    letter-spacing: 0.5px;
                    text-transform: uppercase;
                }
            `}</style>
        </div>
    );
};

export default ReminderScreen;
