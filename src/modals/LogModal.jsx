import React, { useState } from 'react';
import BaseModal from '../components/BaseModal';
import useLocalStorage from '../hooks/useLocalStorage';

const LogModal = ({ isOpen, onClose }) => {
    const [logs] = useLocalStorage('meditation_sessions', []);
    const [apiKey, setApiKey] = useLocalStorage('gemini_api_key', '');
    const [isEditingKey, setIsEditingKey] = useState(false);

    const handleSaveKey = () => {
        setApiKey(tempKey);
        setIsEditingKey(false);
        // alert('API Key Saved!'); // Removed alert to be less intrusive
    };

    const reversedLogs = [...logs].reverse();

    const downloadCSV = () => {
        const headers = ["Date", "Duration", "Start Note", "End Note"];
        const rows = reversedLogs.map(log => [
            new Date(log.startTime).toLocaleString(),
            log.duration + " min",
            `"${(log.startNote || '').replace(/"/g, '""')}"`,
            `"${(log.endNote || '').replace(/"/g, '""')}"`
        ]);

        const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "meditation_logs.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <BaseModal isOpen={isOpen} onClose={onClose} title="History">

            {/* Header / Actions */}
            <div style={{ margin: '0 0 16px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <div className="api-settings" style={{ display: 'flex', gap: '8px', flex: 1, alignItems: 'center' }}>
                    {apiKey && !isEditingKey ? (
                        // View Mode
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
                        // Edit Mode
                        <>
                            <input
                                type="password"
                                className="api-input"
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
                                <span>{new Date(log.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <div className="log-item-duration">{log.duration} min</div>

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
                    ))
                )}
            </div>
        </BaseModal>
    );
};

export default LogModal;
