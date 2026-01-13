import React, { useState } from 'react';
import BaseModal from '../components/BaseModal';
import useLocalStorage from '../hooks/useLocalStorage';

const LogModal = ({ isOpen, onClose }) => {
    const [logs, setLogs] = useLocalStorage('meditation_sessions', []);
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

    const handleDeleteLog = (logId) => {
        if (confirm('Delete this session?')) {
            setLogs(logs.filter(log => log.id !== logId));
        }
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

            <div style={{ overflowY: 'auto', maxHeight: '55vh' }}>
                {reversedLogs.length === 0 ? (
                    <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No sessions yet.</p>
                ) : (
                    reversedLogs.map(log => (
                        <div key={log.id} className="log-item">
                            <div className="log-item-header">
                                <span>{new Date(log.startTime).toLocaleDateString()}</span>
                                <span className="delete-btn" onClick={() => handleDeleteLog(log.id)} style={{ cursor: 'pointer' }}>✕</span>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', margin: '8px 0', fontSize: '13px' }}>
                                <div><span style={{ color: 'var(--text-secondary)' }}>Duration:</span> {log.duration} min</div>
                                <div><span style={{ color: 'var(--text-secondary)' }}>Start:</span> {new Date(log.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                            </div>

                            {log.model && log.tokens && (
                                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                                    AI: {log.model} • {log.tokens} tokens
                                </div>
                            )}

                            {log.startNote && (
                                <div className="log-item-note">
                                    <div className="log-item-note-label">Before</div>
                                    {log.startNote}
                                </div>
                            )}

                            {log.endNote && (
                                <div className="log-item-note">
                                    <div className="log-item-note-label">After</div>
                                    {log.endNote}
                                </div>
                            )}

                            {/* Emotion and Cause Tags */}
                            {((log.emotions && log.emotions.length) || (log.causes && log.causes.length)) && (
                                <div style={{ marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                    {log.emotions && log.emotions.map((e, i) => (
                                        <span key={`e-${i}`} style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '12px', background: 'rgba(92, 107, 192, 0.2)', color: 'var(--primary)' }}>{e}</span>
                                    ))}
                                    {log.causes && log.causes.map((c, i) => (
                                        <span key={`c-${i}`} style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '12px', background: 'rgba(255, 152, 0, 0.2)', color: '#FF9800' }}>{c}</span>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </BaseModal>
    );
};

export default LogModal;
