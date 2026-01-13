import React, { useState } from 'react';
import BaseModal from '../components/BaseModal';
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

            <div style={{ overflowY: 'auto', maxHeight: '55vh', position: 'relative' }}>
                {/* Delete Confirmation Overlay */}
                {logToDelete && (
                    <div style={{
                        position: 'fixed', // Fixed relative to viewport to ensure visibility on top of everything
                        top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.6)',
                        zIndex: 100,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }} onClick={(e) => { e.stopPropagation(); setLogToDelete(null); }}>
                        <div style={{
                            background: '#1a1a2e', // Solid background (no transparency)
                            padding: '24px',
                            borderRadius: '16px',
                            width: '300px',
                            textAlign: 'center',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.6)',
                            border: '1px solid var(--border-color)'
                        }} onClick={(e) => e.stopPropagation()}>
                            <h3 style={{ marginTop: 0, marginBottom: '12px' }}>Delete Session?</h3>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>This action cannot be undone.</p>
                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                                <button onClick={() => setLogToDelete(null)} style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid var(--text-secondary)', background: 'transparent', color: 'var(--text-primary)', cursor: 'pointer' }}>Cancel</button>
                                <button className="btn-primary" onClick={confirmDelete} style={{ padding: '10px 20px', background: '#FF5252' }}>Delete</button>
                            </div>
                        </div>
                    </div>
                )}

                {reversedLogs.length === 0 ? (
                    <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No sessions yet.</p>
                ) : (
                    reversedLogs.map(log => {
                        const startDate = new Date(log.startTime);
                        const endDate = log.endTime ? new Date(log.endTime) : null;
                        const durationSec = endDate ? Math.round((endDate - startDate) / 1000) : 0;
                        const m = Math.floor(durationSec / 60);
                        const s = durationSec % 60;

                        return (
                            <div key={log.id} className="log-item" style={{ padding: '12px', borderBottom: '1px solid var(--border-color)' }}>
                                {/* Header: Date | Cross */}
                                <div className="log-item-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                    <span style={{ fontWeight: 600 }}>Date: {startDate.toLocaleDateString()}</span>
                                    <span
                                        className="delete-btn"
                                        onClick={() => setLogToDelete(log.id)}
                                        style={{ cursor: 'pointer', padding: '4px' }}
                                    >
                                        ✕
                                    </span>
                                </div>

                                {/* Body - Requested Layout */}
                                <div style={{ fontSize: '13px', lineHeight: '1.6', color: 'var(--text-primary)' }}>
                                    {/* Line 1: Setup & Duration */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <div><span style={{ color: 'var(--text-secondary)' }}>Setup:</span> {log.duration} min</div>
                                        <div><span style={{ color: 'var(--text-secondary)' }}>Duration:</span> {m}m {s}s (actual)</div>
                                    </div>

                                    {/* Line 2: Start & End */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                                        <div><span style={{ color: 'var(--text-secondary)' }}>Start:</span> {startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                        <div><span style={{ color: 'var(--text-secondary)' }}>End:</span> {endDate ? endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}</div>
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
