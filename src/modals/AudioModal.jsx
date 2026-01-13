import React, { useState } from 'react';
import BaseModal from '../components/BaseModal';
import { AudioUtils } from '../hooks/useAudio';

const DEFAULT_AUDIOS = [
    { id: '433600551', name: 'Rain', type: 'direct', url: 'https://cdn.pixabay.com/download/audio/2023/06/25/audio_433600551.mp3' },
    { id: '11030', name: 'Forest', type: 'direct', url: 'https://cdn.pixabay.com/download/audio/2022/02/07/audio_11030.mp3' },
    { id: '1', name: 'None', type: 'none' }
];

const AudioModal = ({ isOpen, onClose, onSelect, currentAudioId, savedAudios, setSavedAudios }) => {
    // No local hook here, dependent on App.jsx state
    // View State: 'list' or 'add'
    const [view, setView] = useState('list');

    const handleAddYouTube = async () => {
        // Robust handling similar to legacy code
        const url = youtubeUrl.trim();
        if (!url) return;

        // 1. Check for Playlist
        if (url.includes('list=')) {
            const videoId = AudioUtils.extractVideoID(url);
            if (videoId) {
                // It's a playlist but has a video ID
                const title = await AudioUtils.fetchYouTubeTitle(videoId);
                const newAudio = { id: videoId, name: title, type: 'youtube' };
                setSavedAudios([...savedAudios, newAudio]);
                onSelect(videoId);
                onClose();
                setYoutubeUrl('');
                setView('list');
                alert("Playlist detected! Added the specific video. Note: Full playlist imports require a YouTube API Key.");
            } else {
                // Just a playlist URL
                alert("Playlist detected! Please open the playlist and add specific video URLs one by one.");
            }
            return;
        }

        // 2. Check for Direct Video
        const videoId = AudioUtils.extractVideoID(url);
        if (videoId) {
            const title = await AudioUtils.fetchYouTubeTitle(videoId);
            const newAudio = { id: videoId, name: title, type: 'youtube' };
            setSavedAudios([...savedAudios, newAudio]);
            onSelect(videoId);
            onClose();
            setYoutubeUrl('');
            setView('list');
        } else {
            alert('Invalid YouTube URL');
        }
    };

    const handleDelete = (id, e) => {
        e.stopPropagation();
        if (confirm('Delete this track?')) {
            setSavedAudios(savedAudios.filter(a => a.id !== id));
        }
    };

    // Reset view on open
    React.useEffect(() => {
        if (isOpen) setView('list');
    }, [isOpen]);

    return (
        <BaseModal isOpen={isOpen} onClose={onClose} title={view === 'list' ? "Background Audio" : "Add New Audio"}>

            {view === 'list' && (
                <>
                    <div className="audio-list" style={{ marginBottom: '16px' }}>
                        {savedAudios.map(audio => (
                            <div
                                key={audio.id}
                                className={`audio-item ${currentAudioId === audio.id ? 'selected' : ''}`}
                                onClick={() => { onSelect(audio.id); onClose(); }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span>{audio.type === 'youtube' ? '📺' : '🎵'}</span>
                                    <span style={{ fontWeight: 500 }}>{audio.name}</span>
                                </div>
                                {audio.id !== '1' && !DEFAULT_AUDIOS.find(d => d.id === audio.id) && (
                                    <span className="delete-btn" onClick={(e) => handleDelete(audio.id, e)}>&times;</span>
                                )}
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={() => setView('add')}
                        style={{
                            width: '100%',
                            padding: '12px',
                            background: 'transparent',
                            border: '1px dashed var(--text-secondary)',
                            color: 'var(--text-primary)',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            fontSize: '14px'
                        }}
                    >
                        <span>➕</span> Add New Track
                    </button>
                </>
            )}

            {view === 'add' && (
                <div>
                    <input
                        className="input-field"
                        placeholder="Paste YouTube URL here..."
                        value={youtubeUrl}
                        onChange={(e) => setYoutubeUrl(e.target.value)}
                        autoFocus
                        style={{ marginBottom: '16px' }}
                    />
                    <button className="btn-primary" onClick={handleAddYouTube} style={{ padding: '12px', marginBottom: '12px' }}>
                        Add Track
                    </button>
                    <button
                        onClick={() => setView('list')}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--text-secondary)',
                            width: '100%',
                            cursor: 'pointer',
                            padding: '8px'
                        }}
                    >
                        Cancel
                    </button>
                </div>
            )}
        </BaseModal>
    );
};

export default AudioModal;
