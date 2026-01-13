import React, { useState } from 'react';
import BaseModal from '../components/BaseModal';
import { AudioUtils } from '../hooks/useAudio';
import ConfirmModal from '../components/ConfirmModal';

const DEFAULT_AUDIOS = [
    { id: '1', name: 'None', type: 'none' }
];

const AudioModal = ({ isOpen, onClose, onSelect, currentAudioId, savedAudios, setSavedAudios }) => {
    // No local hook here, dependent on App.jsx state
    // View State: 'list' or 'add'
    const [view, setView] = useState('list');
    const [youtubeUrl, setYoutubeUrl] = useState('');

    const handleAddTrack = async () => {
        const url = youtubeUrl.trim();
        if (!url) return;

        // 1. Check for Playlist
        if (url.includes('list=')) {
            const videoId = AudioUtils.extractVideoID(url);
            if (videoId) {
                const { title, creator } = await AudioUtils.fetchYouTubeTitle(videoId);
                const thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                const newAudio = { id: videoId, name: title, creator, type: 'youtube', thumbnail };
                setSavedAudios([...savedAudios, newAudio]);
                onSelect(videoId);
                onClose();
                setYoutubeUrl('');
                setView('list');
                alert("Playlist detected! Added the specific video.");
            } else {
                alert("Playlist detected! Please open the playlist and add specific video URLs.");
            }
            return;
        }

        // 2. Check for Direct Video (YouTube)
        const videoId = AudioUtils.extractVideoID(url);
        if (videoId) {
            const { title, creator } = await AudioUtils.fetchYouTubeTitle(videoId);
            const thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
            const newAudio = { id: videoId, name: title, creator, type: 'youtube', thumbnail };
            setSavedAudios([...savedAudios, newAudio]);
            onSelect(videoId);
            onClose();
            setYoutubeUrl('');
            setView('list');
            return;
        }

        // 3. Check for Direct Audio URL (MP3, WAV, etc.)
        if (AudioUtils.isAudioURL(url)) {
            // Extract filename as name
            const rawName = url.split('/').pop().split('?')[0];
            const name = decodeURIComponent(rawName) || 'Custom Audio';

            const newAudio = {
                id: Date.now().toString(),
                name: name,
                type: 'direct',
                url: url,
                thumbnail: null // Fallback to icon
            };

            setSavedAudios([...savedAudios, newAudio]);
            onSelect(newAudio.id);
            onClose();
            setYoutubeUrl('');
            setView('list');
            return;
        }

        alert('Invalid URL. Please use a YouTube link or a direct audio file (mp3, wav, etc).');
    };

    const [audioToDelete, setAudioToDelete] = useState(null);

    const handleDeleteClick = (id, e) => {
        e.stopPropagation();
        setAudioToDelete(id);
    };

    const confirmDelete = () => {
        if (audioToDelete) {
            setSavedAudios(savedAudios.filter(a => a.id !== audioToDelete));
            setAudioToDelete(null);
        }
    };

    // Reset view on open
    React.useEffect(() => {
        if (isOpen) setView('list');
    }, [isOpen]);



    return (
        <BaseModal isOpen={isOpen} onClose={onClose} title={view === 'list' ? "Background Audio" : "Add New Audio"}>
            <ConfirmModal
                isOpen={!!audioToDelete}
                onClose={() => setAudioToDelete(null)}
                onConfirm={confirmDelete}
                title="Delete Audio?"
                message="This audio track will be removed."
            />

            {view === 'list' && (
                <>
                    <div className="audio-list" style={{ marginBottom: '16px' }}>
                        {savedAudios.map(audio => (
                            <div
                                key={audio.id}
                                className={`audio-item ${currentAudioId === audio.id ? 'selected' : ''}`}
                                onClick={() => { onSelect(audio.id); onClose(); }}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '12px',
                                    gap: '12px'
                                }}
                            >
                                {/* Left Content: Title & Creator */}
                                <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    <span style={{
                                        fontWeight: 500,
                                        fontSize: '14px',
                                        color: 'var(--text-primary)',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden',
                                        textTransform: 'capitalize', // Sentence case approximation
                                        lineHeight: '1.3'
                                    }}>
                                        {audio.name.toLowerCase()} {/* Force lowercase then capitalize via CSS/Format */}
                                    </span>
                                    <span style={{
                                        fontSize: '12px',
                                        color: 'var(--text-secondary)',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                    }}>
                                        {audio.creator || 'Unknown Artist'}
                                    </span>
                                </div>

                                {/* Right Content: Thumbnail & Action */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
                                    {/* Thumbnail */}
                                    {audio.thumbnail ? (
                                        <div style={{
                                            width: '56px', height: '40px', // 16:9 aspect ratioish
                                            borderRadius: '6px',
                                            overflow: 'hidden',
                                            backgroundImage: `url(${audio.thumbnail})`,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                            backgroundColor: '#000'
                                        }} />
                                    ) : (
                                        <div style={{
                                            width: '40px', height: '40px',
                                            borderRadius: '6px',
                                            background: 'rgba(255,255,255,0.1)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: '20px'
                                        }}>
                                            {audio.type === 'youtube' ? '📺' : '🎵'}
                                        </div>
                                    )}

                                    {/* Delete Button */}
                                    {audio.id !== '1' && !DEFAULT_AUDIOS.find(d => d.id === audio.id) && (
                                        <span
                                            className="delete-btn"
                                            onClick={(e) => handleDeleteClick(audio.id, e)}
                                            style={{ marginLeft: '4px' }}
                                        >
                                            &times;
                                        </span>
                                    )}
                                </div>
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
                        placeholder="Paste YouTube or Audio URL..."
                        value={youtubeUrl}
                        onChange={(e) => setYoutubeUrl(e.target.value)}
                        autoFocus
                        style={{ marginBottom: '16px' }}
                    />
                    <button className="btn-primary" onClick={handleAddTrack} style={{ padding: '12px', marginBottom: '12px' }}>
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
