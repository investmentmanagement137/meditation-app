import React, { useState } from 'react';
import ConfirmModal from '../components/ConfirmModal';

const LogsScreen = ({ logs, onDeleteLog }) => {
    const [logToDelete, setLogToDelete] = useState(null);

    const reversedLogs = [...logs].reverse();

    const confirmDelete = () => {
        if (logToDelete) {
            onDeleteLog(logToDelete);
            setLogToDelete(null);
        }
    };

    const downloadCSV = () => {
        if (logs.length === 0) {
            alert('No sessions to export');
            return;
        }

        const headers = ['Date', 'Start Time', 'End Time', 'Duration (min)', 'Before Note', 'After Note', 'Emotions', 'Causes', 'AI Model', 'Token Usage', 'Audio Name', 'Audio Creator', 'Audio URL'];
        const rows = logs.map(log => {
            const startDate = new Date(log.startTime);
            const endDate = log.endTime ? new Date(log.endTime) : null;

            let audioUrl = '';
            if (log.audioDetails) {
                if (log.audioDetails.type === 'youtube') {
                    audioUrl = `https://www.youtube.com/watch?v=${log.audioDetails.id}`;
                } else if (log.audioDetails.url) {
                    audioUrl = log.audioDetails.url;
                }
            }

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
                log.tokens || '',
                `"${(log.audioDetails?.name || '').replace(/"/g, '""')}"`,
                `"${(log.audioDetails?.creator || '').replace(/"/g, '""')}"`,
                audioUrl
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

    return (
        <div className="screen-content">
            <div className="screen-header">
                <h2 className="screen-title">Logs</h2>
            </div>

            <ConfirmModal
                isOpen={!!logToDelete}
                onClose={() => setLogToDelete(null)}
                onConfirm={confirmDelete}
                title="Delete Session?"
                message="This action cannot be undone."
            />

            <div className="logs-list-container" style={{ width: '100%', paddingBottom: '80px' }}>
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
                                <div key={log.id} className="log-card" style={{ marginBottom: '16px', background: 'var(--surface)', borderRadius: '16px', padding: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <div className="log-header-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems: 'center' }}>
                                        <div>
                                            <span className="log-date" style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>
                                                {startDate.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                                            </span>
                                            <span className="log-time" style={{ fontSize: '12px', color: 'var(--text-secondary)', marginLeft: '8px' }}>
                                                {startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <button
                                            className="btn-delete"
                                            onClick={() => setLogToDelete(log.id)}
                                            style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '18px' }}
                                        >✕</button>
                                    </div>

                                    <div className="log-metrics" style={{ display: 'flex', gap: '16px', marginBottom: '12px' }}>
                                        <div className="metric" style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span className="label" style={{ fontSize: '10px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Planned</span>
                                            <span className="value" style={{ fontSize: '16px', fontWeight: '600' }}>{log.duration || 0}m</span>
                                        </div>
                                        <div className="metric" style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span className="label" style={{ fontSize: '10px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Actual</span>
                                            <span className="value" style={{ fontSize: '16px', fontWeight: '600', color: m < (log.duration || 0) ? '#ffcc80' : 'inherit' }}>
                                                {m}m
                                            </span>
                                        </div>
                                    </div>

                                    {(log.startNote || log.endNote) && (
                                        <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px', padding: '12px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                                            {log.startNote && (
                                                <div className="log-item-note">
                                                    <div className="log-item-note-label" style={{ fontSize: '10px', color: 'var(--primary-light)', marginBottom: '2px' }}>INTENTION</div>
                                                    <div style={{ fontSize: '13px', lineHeight: '1.4' }}>{log.startNote}</div>
                                                </div>
                                            )}
                                            {log.endNote && (
                                                <div className="log-item-note">
                                                    <div className="log-item-note-label" style={{ fontSize: '10px', color: 'var(--primary-light)', marginBottom: '2px', marginTop: log.startNote ? '8px' : '0' }}>REFLECTION</div>
                                                    <div style={{ fontSize: '13px', lineHeight: '1.4' }}>{log.endNote}</div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {(log.emotions?.length > 0 || log.causes?.length > 0) && (
                                        <div className="log-tags" style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '12px' }}>
                                            {log.emotions?.map((e, i) => <span key={`e-${i}`} className="tag emotion" style={{ fontSize: '11px', padding: '4px 8px', borderRadius: '12px', background: 'rgba(92, 107, 192, 0.2)', color: '#9fa8da' }}>{e}</span>)}
                                            {log.causes?.map((c, i) => <span key={`c-${i}`} className="tag cause" style={{ fontSize: '11px', padding: '4px 8px', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.1)', color: '#b0bec5' }}>{c}</span>)}
                                        </div>
                                    )}

                                    {log.audioDetails && log.audioDetails.id !== '1' && (
                                        <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{
                                                width: '48px',
                                                height: '48px',
                                                borderRadius: '8px',
                                                background: '#333',
                                                backgroundImage: log.audioDetails.thumbnail ? `url(${log.audioDetails.thumbnail})` : 'none',
                                                backgroundSize: 'cover',
                                                backgroundPosition: 'center',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                flexShrink: 0
                                            }}>
                                                {!log.audioDetails.thumbnail && <span style={{ fontSize: '20px' }}>🎵</span>}
                                            </div>
                                            <div style={{ flex: 1, overflow: 'hidden' }}>
                                                <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                    {log.audioDetails.name}
                                                </div>
                                                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                                                    {log.audioDetails.creator || 'Unknown Artist'}
                                                </div>
                                            </div>
                                            {log.audioDetails.type === 'youtube' && (
                                                <a
                                                    href={`https://www.youtube.com/watch?v=${log.audioDetails.id}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style={{ color: 'var(--primary)', fontSize: '12px', textDecoration: 'none', padding: '6px 12px', background: 'rgba(var(--primary-rgb), 0.1)', borderRadius: '12px' }}
                                                >
                                                    Watch
                                                </a>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <div className="export-section" style={{
                position: 'absolute',
                bottom: '80px',
                left: '0',
                right: '0',
                padding: '16px',
                background: 'var(--background)',
                borderTop: '1px solid rgba(255,255,255,0.05)',
                display: 'flex',
                justifyContent: 'center',
                zIndex: 10
            }}>
                <button className="btn-download" onClick={downloadCSV} style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--primary)',
                    color: 'var(--text-primary)',
                    padding: '12px 24px',
                    borderRadius: '24px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                }}>
                    <span>⬇</span> Export CSV
                </button>
            </div>
        </div >
    );
};

export default LogsScreen;
