import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Bell, Check } from 'lucide-react';
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
            <div className="screen-header">
                <button
                    className="back-button"
                    onClick={() => navigate(-1)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-primary)' }}
                >
                    <ChevronLeft size={28} />
                </button>
                <h2 className="screen-title" style={{ marginLeft: '12px' }}>Daily Reminder</h2>
            </div>

            <div className="settings-container" style={{ padding: '24px 0' }}>
                <div className="settings-card">
                    <div className="settings-item">
                        <div className="settings-item-content">
                            <div className="settings-item-icon icon-purple centered-icon">
                                <Bell size={20} />
                            </div>
                            <div className="settings-item-text">
                                <div className="settings-item-title">Enable Daily Reminder</div>
                                <div className="settings-item-subtitle">Get noticed to meditate everyday</div>
                            </div>
                        </div>
                        <div
                            className={`settings-toggle ${reminderEnabled ? 'active' : ''}`}
                            onClick={() => handleToggle(!reminderEnabled)}
                        />
                    </div>

                    {reminderEnabled && (
                        <div className="settings-item" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '16px' }}>
                            <div className="settings-item-title" style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                                Select Time
                            </div>
                            <div style={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
                                <input
                                    type="time"
                                    value={reminderTime}
                                    onChange={(e) => setReminderTime(e.target.value)}
                                    style={{
                                        fontSize: '32px',
                                        fontWeight: 'bold',
                                        padding: '12px 24px',
                                        borderRadius: '16px',
                                        border: '1px solid var(--border-line)',
                                        background: 'var(--surface)',
                                        color: 'var(--text-primary)',
                                        outline: 'none',
                                        fontFamily: 'Outfit, sans-serif'
                                    }}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {!isPermissionGranted && reminderEnabled && (
                    <div style={{ padding: '16px', marginTop: '16px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', fontSize: '14px' }}>
                        Notifications are blocked. Please enable them in your browser settings.
                    </div>
                )}

                <div style={{ marginTop: '24px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '14px' }}>
                    Tips: Keep this tab open or install the app to receive notifications reliably.
                </div>
            </div>

            <style>{`
                .centered-icon {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 40px; 
                    height: 40px;
                    border-radius: 12px;
                }
                .icon-purple { background: rgba(168, 85, 247, 0.1); color: #a855f7; }
            `}</style>
        </div>
    );
};

export default ReminderScreen;
