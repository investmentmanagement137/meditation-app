import React, { useState } from 'react';
import BaseModal from '../components/BaseModal';
import ConfirmModal from '../components/ConfirmModal';
import useLocalStorage from '../hooks/useLocalStorage';

const LogModal = ({ isOpen, onClose, logs, onDeleteLog }) => {

    const [apiKey, setApiKey] = useLocalStorage('gemini_api_key', '');
    const [isEditingKey, setIsEditingKey] = useState(false);
    const [tempKey, setTempKey] = useState('');

    React.useEffect(() => {
        if (apiKey) setTempKey(apiKey);
    }, [apiKey]);

    const handleSaveKey = () => {
        setApiKey(tempKey);
        setIsEditingKey(false);
    };



    const reversedLogs = [...logs].reverse();

    // Enhanced CSV Export matching legacy
    const downloadCSV = () => {
        if (logs.length === 0) {
            alert('No sessions to export');
            return;
        }

        const headers = ['Date', 'Start Time', 'End Time', 'Duration (min)', 'Before Note', 'After Note', 'Emotions', 'Causes', 'AI Model', 'Token Usage'];
        const rows = logs.map(log => {
            const startDate = new Date(log.startTime);
            const endDate = log.endTime ? new Date(log.endTime) : null;
            return [
                startDate.toLocaleDateString(),
                startDate.toLocaleTimeString(),
                endDate ? endDate.toLocaleTimeString() : 'Incomplete',
                log.duration,
                `"${(log.startNote || '').replace(/"/g, '""')}"`,
                `"${(log.endNote || '').replace(/"/g, '""')}"`,
                `"${(log.emotions || []).join(', ')}"`,
                `"${(log.causes || []).join(', ')}"`,
                log.model || '',
                log.tokens || ''
            ].join(',');
        });

        const csv = [headers.join(','), ...rows].join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `meditation_log_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const [logToDelete, setLogToDelete] = useState(null);

    const confirmDelete = () => {
        if (logToDelete) {
            onDeleteLog(logToDelete);
            setLogToDelete(null);
        }
    };

    return (
        <BaseModal isOpen={isOpen} onClose={onClose} title="History">

            {/* Header / Actions */}
            <div style={{ margin: '0 0 16px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <div className="api-settings" style={{ display: 'flex', gap: '8px', flex: 1, alignItems: 'center' }}>
                    {apiKey && !isEditingKey ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(76, 175, 80, 0.1)', padding: '6px 12px', borderRadius: '6px', border: '1px solid rgba(76, 175, 80, 0.3)' }}>
                            <span style={{ fontSize: '13px', color: '#4CAF50', fontWeight: 500 }}>API Key Saved ✓</span>
                            <button
                                onClick={() => setIsEditingKey(true)}
                                style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', fontSize: '11px', textDecoration: 'underline', cursor: 'pointer', padding: 0 }}
                            >
                                Change
                            </button>
                        </div>
                    ) : (
                        <>
                            <input
                                type="password"
                                placeholder="Gemini API Key..."
                                style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid var(--text-secondary)', background: 'var(--background)', color: 'var(--text-primary)' }}
                                value={tempKey}
                                onChange={(e) => setTempKey(e.target.value)}
                            />
                            <button className="btn-primary" style={{ padding: '8px 12px', fontSize: '12px', width: 'auto' }} onClick={handleSaveKey}>
                                {apiKey ? 'Update' : 'Save'}
                            </button>
                            {isEditingKey && (
                                <button onClick={() => setIsEditingKey(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>✕</button>
                            )}
                        </>
                    )}
                </div>
                <button className="btn-csv" onClick={downloadCSV}>
                    ⬇ CSV
                </button>
            </div>

            {/* Analytics Dashboard */}
            {logs.length > 0 && (() => {
                // Calculate Stats
                const totalSessions = logs.length;
                let totalSeconds = 0;
                let completedSessions = 0;
                const emotionCounts = {};

                logs.forEach(log => {
                    // Time
                    const start = new Date(log.startTime);
                    const end = log.endTime ? new Date(log.endTime) : null;
                    const actualSec = end ? (end - start) / 1000 : 0;
                    totalSeconds += actualSec;

                    // Completion (Actual >= Setup * 60) within 10 second margin of error
                    const targetSec = (log.duration || 0) * 60;
                    if (actualSec >= (targetSec - 10)) { // 10s buffer
                        completedSessions++;
                    }

                    // Emotions
                    if (log.emotions) {
                        log.emotions.forEach(e => {
                            emotionCounts[e] = (emotionCounts[e] || 0) + 1;
                        });
                    }
                });

                const avgSec = Math.round(totalSeconds / totalSessions);
                const avgMin = Math.floor(avgSec / 60);
                const avgRemSec = avgSec % 60;
                const completionRate = Math.round((completedSessions / totalSessions) * 100);

                const topEmotions = Object.entries(emotionCounts)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 3)
                    .map(([e]) => e);

                return (
                    <div className="stats-dashboard">
                        <div className="stat-box">
                            <div className="stat-label">Total Sessions</div>
                            <div className="stat-value">{totalSessions}</div>
                        </div>
                        <div className="stat-box">
                            <div className="stat-label">Avg. Time</div>
                            <div className="stat-value">{avgMin}m {avgRemSec}s</div>
                        </div>
                        <div className="stat-box">
                            <div className="stat-label">Completion</div>
                            <div className="stat-value">{completionRate}%</div>
                            <div className="stat-sub">Target Reached</div>
                        </div>
                        <div className="stat-box">
                            <div className="stat-label">Top Emotions</div>
                            <div className="stat-value" style={{ fontSize: '13px' }}>
                                {topEmotions.length ? topEmotions.join(', ') : '-'}
                            </div>
                        </div>
                    </div>
                );
            })()}

            <div style={{ overflowY: 'auto', maxHeight: '55vh', position: 'relative' }}>
                <ConfirmModal
                    isOpen={!!logToDelete}
                    onClose={() => setLogToDelete(null)}
                    onConfirm={confirmDelete}
                    title="Delete Session?"
                    message="This action cannot be undone."
                />

                {reversedLogs.length === 0 ? (
                    <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '20px' }}>No sessions yet.</p>
                ) : (
                    reversedLogs.map(log => {
                        const startDate = new Date(log.startTime);
                        const endDate = log.endTime ? new Date(log.endTime) : null;
                        const durationSec = endDate ? Math.round((endDate - startDate) / 1000) : 0;
                        const m = Math.floor(durationSec / 60);
                        const s = durationSec % 60;

                        return (
                            <div key={log.id} className="log-item">
                                {/* Header */}
                                <div className="log-header">
                                    <span>{startDate.toLocaleDateString()}</span>
                                    <span
                                        className="delete-btn"
                                        onClick={() => setLogToDelete(log.id)}
                                        style={{ cursor: 'pointer', padding: '4px', opacity: 0.7 }}
                                    >
                                        ✕
                                    </span>
                                </div>

                                {/* Body */}
                                <div className="log-details">
                                    <div className="log-row">
                                        <div><span className="text-muted">Setup:</span> {log.duration} min</div>
                                        <div><span className="text-muted">Actual:</span> {m}m {s}s</div>
                                    </div>

                                    <div className="log-row" style={{ marginTop: '4px' }}>
                                        <div><span className="text-muted">Start:</span> {startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                        <div><span className="text-muted">End:</span> {endDate ? endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}</div>
                                    </div>
                                </div>

                                {/* Notes */}
                                {log.startNote && (
                                    <div style={{ marginTop: '8px', fontSize: '13px', fontStyle: 'italic', color: 'var(--text-secondary)' }}>
                                        "{log.startNote}"
                                    </div>
                                )}
                                {log.endNote && (
                                    <div style={{ marginTop: '4px', fontSize: '13px' }}>
                                        {log.endNote}
                                    </div>
                                )}

                                {/* AI Tags */}
                                {((log.emotions && log.emotions.length > 0) || (log.causes && log.causes.length > 0)) && (
                                    <div style={{ marginTop: '12px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                        {log.emotions && log.emotions.map((e, i) => (
                                            <span key={`e-${i}`} style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '12px', background: 'rgba(92, 107, 192, 0.2)', color: 'var(--primary)' }}>{e}</span>
                                        ))}
                                        {log.causes && log.causes.map((c, i) => (
                                            <span key={`c-${i}`} style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '12px', background: 'rgba(255, 152, 0, 0.2)', color: '#FF9800' }}>{c}</span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </BaseModal>
    );
};

export default LogModal;
