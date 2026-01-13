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
    const [youtubeUrl, setYoutubeUrl] = useState('');
    const [activeTab, setActiveTab] = useState('list'); // 'list' or 'add'

    const handleAddYouTube = async () => {
        const videoId = AudioUtils.extractVideoID(youtubeUrl);
        if (videoId) {
            const title = await AudioUtils.fetchYouTubeTitle(videoId);
            const newAudio = { id: videoId, name: title, type: 'youtube' };
            setSavedAudios([...savedAudios, newAudio]);
            onSelect(videoId);
            onClose();
            setYoutubeUrl('');
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

    return (
        <BaseModal isOpen={isOpen} onClose={onClose} title="Background Audio">
            <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
                <button onClick={() => setActiveTab('list')} style={{ fontWeight: activeTab === 'list' ? 'bold' : 'normal' }}>My Audio</button>
                <button onClick={() => setActiveTab('add')} style={{ fontWeight: activeTab === 'add' ? 'bold' : 'normal' }}>+ Add YouTube</button>
            </div>

            {activeTab === 'list' && (
                <div className="audio-list">
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
            )}

            {activeTab === 'add' && (
                <div>
                    <input
                        className="input-field"
                        placeholder="Paste YouTube URL here..."
                        value={youtubeUrl}
                        onChange={(e) => setYoutubeUrl(e.target.value)}
                    />
                    <button className="btn-primary" onClick={handleAddYouTube} style={{ padding: '12px' }}>
                        Add Track
                    </button>
                </div>
            )}
        </BaseModal>
    );
};

export default AudioModal;
