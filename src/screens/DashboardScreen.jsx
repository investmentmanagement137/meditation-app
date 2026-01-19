import React, { useState } from 'react';
import ConfirmModal from '../components/ConfirmModal';
import useLocalStorage from '../hooks/useLocalStorage';

const DashboardScreen = ({ logs, onDeleteLog }) => {

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
        <div className="screen-content">
            <div className="screen-header" style={{ justifyContent: 'flex-end', marginBottom: '20px' }}>
                {/* Header Spacer */}
            </div>

            {/* Analytics Dashboard (Top) */}
            {logs.length > 0 && (() => {
                const totalSessions = logs.length;
                let totalSeconds = 0;
                let completedSessions = 0;
                const emotionCounts = {};

                logs.forEach(log => {
                    const start = new Date(log.startTime);
                    const end = log.endTime ? new Date(log.endTime) : null;
                    const actualSec = end ? (end - start) / 1000 : 0;
                    totalSeconds += actualSec;

                    const targetSec = (log.duration || 0) * 60;
                    if (actualSec >= (targetSec - 10)) completedSessions++;

                    if (log.emotions) {
                        log.emotions.forEach(e => emotionCounts[e] = (emotionCounts[e] || 0) + 1);
                    }
                });

                const avgSec = Math.round(totalSeconds / totalSessions);
                const avgMin = Math.floor(avgSec / 60);
                const completionRate = Math.round((completedSessions / totalSessions) * 100);
                const topEmotions = Object.entries(emotionCounts).sort(([, a], [, b]) => b - a).slice(0, 3).map(([e]) => e);

                return (
                    <div className="dashboard-section">
                        <div className="section-label">Overview</div>
                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-label">Total Sessions</div>
                                <div className="stat-value">{totalSessions}</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-label">Avg. Time</div>
                                <div className="stat-value">{avgMin}m</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-label">Completion</div>
                                <div className="stat-value">{completionRate}%</div>
                            </div>
                        </div>
                    </div>
                );
            })()}

            {/* Recent History (Middle) */}
            <div className="dashboard-section">
                <div className="section-label">Recent History</div>
                <ConfirmModal
                    isOpen={!!logToDelete}
                    onClose={() => setLogToDelete(null)}
                    onConfirm={confirmDelete}
                    title="Delete Session?"
                    message="This action cannot be undone."
                />

                {reversedLogs.length === 0 ? (
                    <div className="empty-state">
                        <p>No sessions yet.</p>
                        <p className="sub-text">Complete a meditation session to see it here.</p>
                    </div>
                ) : (
                    <div className="logs-list">
                        {reversedLogs.map(log => {
                            const startDate = new Date(log.startTime);
                            const endDate = log.endTime ? new Date(log.endTime) : null;
                            const durationSec = endDate ? Math.round((endDate - startDate) / 1000) : 0;
                            const m = Math.floor(durationSec / 60);

                            return (
                                <div key={log.id} className="log-card">
                                    <div className="log-header-row">
                                        <span className="log-date">
                                            {startDate.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                                        </span>
                                        <span className="log-time">
                                            {startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                        <button className="btn-delete" onClick={() => setLogToDelete(log.id)}>✕</button>
                                    </div>

                                    <div className="log-metrics">
                                        <div className="metric">
                                            <span className="label">Planned</span>
                                            <span className="value">{log.duration}m</span>
                                        </div>
                                        <div className="metric">
                                            <span className="label">Actual</span>
                                            <span className="value">{m}m</span>
                                        </div>
                                    </div>

                                    {/* Notes Display */}
                                    {(log.startNote || log.endNote) && (
                                        <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            {log.startNote && (
                                                <div className="log-item-note">
                                                    <div className="log-item-note-label">Intention</div>
                                                    {log.startNote}
                                                </div>
                                            )}
                                            {log.endNote && (
                                                <div className="log-item-note">
                                                    <div className="log-item-note-label">Reflection</div>
                                                    {log.endNote}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {(log.emotions?.length > 0 || log.causes?.length > 0) && (
                                        <div className="log-tags">
                                            {log.emotions?.map((e, i) => <span key={`e-${i}`} className="tag emotion">{e}</span>)}
                                            {log.causes?.map((c, i) => <span key={`c-${i}`} className="tag cause">{c}</span>)}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Settings & Actions Card (Bottom) */}
            <div className="dashboard-section">
                <div className="section-label">Settings</div>
                <div className="dashboard-card action-card">
                    <div className="action-row">
                        <div className="api-section">
                            {apiKey && !isEditingKey ? (
                                <div className="api-saved-badge">
                                    <span>API Key Saved</span>
                                    <button onClick={() => setIsEditingKey(true)}>Change</button>
                                </div>
                            ) : (
                                <div className="api-input-group">
                                    <input
                                        type="password"
                                        placeholder="Gemini API Key..."
                                        value={tempKey}
                                        onChange={(e) => setTempKey(e.target.value)}
                                    />
                                    <button className="btn-save" onClick={handleSaveKey}>
                                        {apiKey ? 'Update' : 'Save'}
                                    </button>
                                    {isEditingKey && (
                                        <button className="btn-cancel" onClick={() => setIsEditingKey(false)}>✕</button>
                                    )}
                                </div>
                            )}
                        </div>
                        <button className="btn-download" onClick={downloadCSV}>
                            ⬇ CSV Export
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardScreen;
