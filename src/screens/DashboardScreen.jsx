import React from 'react';
import { useNavigate } from 'react-router-dom';
import AudioSelector from '../components/AudioSelector';

const DashboardScreen = ({ logs, savedAudios, selectedAudioId, onOpenAudioModal }) => {
    const navigate = useNavigate();

    const selectedAudio = savedAudios?.find(a => a.id === selectedAudioId) || null;

    const reversedLogs = [...logs].reverse();

    return (
        <div className="screen-content">
            <div className="screen-header">
                <h2 className="screen-title">Dashboard</h2>
            </div>

            {/* Analytics Dashboard (Top) */}
            {logs.length > 0 ? (() => {
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
                    <div className="dashboard-section" style={{ width: '100%' }}>
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

                        <button
                            onClick={() => navigate('/logs')}
                            style={{
                                width: '100%',
                                marginTop: '24px',
                                padding: '16px',
                                background: 'var(--surface)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '16px',
                                color: 'var(--text-primary)',
                                fontSize: '16px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyComponent: 'center',
                                gap: '12px'
                            }}
                        >
                            <span style={{ fontSize: '20px' }}>📜</span>
                            View Session Logs & History
                        </button>
                    </div>
                );
            })() : (
                <div className="empty-state">
                    <p>No statistics yet.</p>
                    <p className="sub-text">Complete your first session to see analytics.</p>
                </div>
            )}

            <div className="dashboard-section" style={{ width: '100%', marginTop: '32px' }}>
                <div className="section-label">Background Audio</div>
                <AudioSelector
                    selectedAudio={selectedAudio}
                    onOpenModal={onOpenAudioModal}
                />
            </div>
        </div>
    );
};

export default DashboardScreen;
