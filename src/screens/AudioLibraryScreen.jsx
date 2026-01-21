import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AudioUtils } from '../hooks/useAudio';
import ConfirmModal from '../components/ConfirmModal';
import { ArrowLeft } from 'lucide-react';

const AudioLibraryScreen = ({
    activeAudioId,
    onSelectAudio,
    savedAudios,
    setSavedAudios,
    collections,
    setCollections
}) => {
    const navigate = useNavigate();

    // Navigation State: ['root'] -> ['library'] or ['collection', 'id']
    const [navPath, setNavPath] = useState(['root']);
    const currentView = navPath[navPath.length - 1]; // 'root', 'library', or collectionId
    const [viewMode, setViewMode] = useState('audio'); // 'audio' | 'playlist'

    // "Add Audio" or "Create Collection" Input State
    const [isAdding, setIsAdding] = useState(false); // 'audio' or 'collection' or false
    const [inputValue, setInputValue] = useState('');

    // --- Helpers ---
    const getActiveCollection = () => {
        if (navPath[0] === 'collection') {
            return collections.find(c => c.id === navPath[1]);
        }
        return null;
    };

    const activeCollection = getActiveCollection();

    // --- Actions ---

    // 1. Create Collection
    const handleCreateCollection = () => {
        if (!inputValue.trim()) return;
        const newCollection = {
            id: Date.now().toString(),
            name: inputValue.trim(),
            audioIds: []
        };
        setCollections([...collections, newCollection]);
        setInputValue('');
        setIsAdding(false);
    };

    // 2. Add Audio (Library or Collection)
    const handleAddAudio = async () => {
        const url = inputValue.trim();
        if (!url) return;

        let newAudioId = null;
        let finalAudio = null;

        if (url.includes('list=')) {
            // Playlist Logic with Webhook
            try {
                const response = await fetch('https://n8np.puribijay.com.np/webhook/060555cc-04fc-429d-9630-0ac4fa0d3650', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ url: url })
                });

                if (response.ok) {
                    const data = await response.json();
                    if (Array.isArray(data)) {
                        const newAudios = data.map(item => ({
                            id: item.videoId || item.id,
                            name: item.title || 'Unknown Track',
                            creator: item.channelTitle || item.creator || 'Unknown Artist',
                            type: 'youtube',
                            thumbnail: item.thumbnail || `https://img.youtube.com/vi/${item.videoId || item.id}/hqdefault.jpg`
                        })).filter(a => a.id);

                        if (newAudios.length > 0) {
                            const currentIds = new Set(savedAudios.map(a => a.id));
                            const uniqueNewAudios = newAudios.filter(a => !currentIds.has(a.id));
                            const updatedSavedAudios = [...savedAudios, ...uniqueNewAudios];
                            setSavedAudios(updatedSavedAudios);

                            if (activeCollection) {
                                const newIds = newAudios.map(a => a.id);
                                const updatedCollections = collections.map(c => {
                                    if (c.id === activeCollection.id) {
                                        const combinedIds = Array.from(new Set([...c.audioIds, ...newIds]));
                                        return { ...c, audioIds: combinedIds };
                                    }
                                    return c;
                                });
                                setCollections(updatedCollections);
                            }

                            setIsAdding(false);
                            setInputValue('');
                            return;
                        }
                    }
                }
            } catch (error) {
                console.error("Error fetching playlist:", error);
            }

            const videoId = AudioUtils.extractVideoID(url);
            if (videoId) {
                const { title, creator } = await AudioUtils.fetchYouTubeTitle(videoId);
                finalAudio = { id: videoId, name: title, creator, type: 'youtube', thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` };
            }
        } else {
            const videoId = AudioUtils.extractVideoID(url);
            if (videoId) {
                const { title, creator } = await AudioUtils.fetchYouTubeTitle(videoId);
                finalAudio = { id: videoId, name: title, creator, type: 'youtube', thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` };
            } else if (AudioUtils.isAudioURL(url)) {
                const rawName = url.split('/').pop().split('?')[0];
                finalAudio = {
                    id: Date.now().toString(),
                    name: decodeURIComponent(rawName) || 'Custom Audio',
                    type: 'direct',
                    url: url,
                    thumbnail: null
                };
            }
        }

        if (finalAudio) {
            const existing = savedAudios.find(a => a.id === finalAudio.id);
            if (!existing) {
                setSavedAudios([...savedAudios, finalAudio]);
                newAudioId = finalAudio.id;
            } else {
                newAudioId = existing.id;
            }

            if (activeCollection) {
                const updatedCollections = collections.map(c => {
                    if (c.id === activeCollection.id && !c.audioIds.includes(newAudioId)) {
                        return { ...c, audioIds: [...c.audioIds, newAudioId] };
                    }
                    return c;
                });
                setCollections(updatedCollections);
            }

            setIsAdding(false);
            setInputValue('');
        } else {
            alert('Invalid URL');
        }
    };

    // 3. Delete Audio
    const [itemToDelete, setItemToDelete] = useState(null);

    const confirmDelete = () => {
        if (!itemToDelete) return;

        if (itemToDelete.type === 'collection') {
            setCollections(collections.filter(c => c.id !== itemToDelete.id));
        } else if (itemToDelete.type === 'audio') {
            if (activeCollection) {
                const updatedCollections = collections.map(c => {
                    if (c.id === activeCollection.id) {
                        return { ...c, audioIds: c.audioIds.filter(id => id !== itemToDelete.id) };
                    }
                    return c;
                });
                setCollections(updatedCollections);
            } else {
                setSavedAudios(savedAudios.filter(a => a.id !== itemToDelete.id));
                const updatedCollections = collections.map(c => ({
                    ...c,
                    audioIds: c.audioIds.filter(id => id !== itemToDelete.id)
                }));
                setCollections(updatedCollections);
            }
        }
        setItemToDelete(null);
    };


    // --- Render Content ---
    const renderList = () => {
        // A. Root View
        if (currentView === 'root') {
            return (
                <div className="list-group-root">
                    {/* Toggle Switch */}
                    <div className="range-toggle-container" style={{ marginBottom: '24px' }}>
                        <button
                            className={`range-btn ${viewMode === 'audio' ? 'active' : ''}`}
                            onClick={() => setViewMode('audio')}
                        >
                            Audio
                        </button>
                        <button
                            className={`range-btn ${viewMode === 'playlist' ? 'active' : ''}`}
                            onClick={() => setViewMode('playlist')}
                        >
                            Playlist
                        </button>
                    </div>

                    {/* VIEW: PLAYLISTS */}
                    {viewMode === 'playlist' && (
                        <div className="section-block">
                            <div className="section-header-row">
                                <span className="section-title">Playlists</span>
                                {!isAdding && (
                                    <button className="btn-icon-add" onClick={() => { setIsAdding('collection'); setInputValue(''); }} title="New Playlist">
                                        +
                                    </button>
                                )}
                            </div>

                            <div className="items-list">
                                {collections.length === 0 ? (
                                    <div className="empty-hint">No playlists yet</div>
                                ) : (
                                    collections.map(c => (
                                        <div key={c.id} className="list-item folder-item" onClick={() => setNavPath(['collection', c.id])}>
                                            <div className="folder-icon">📁</div>
                                            <div className="folder-info">
                                                <span className="folder-name">{c.name}</span>
                                                <span className="folder-count">{c.audioIds.length} tracks</span>
                                            </div>
                                            <button
                                                className="btn-delete-folder"
                                                onClick={(e) => { e.stopPropagation(); setItemToDelete({ type: 'collection', id: c.id }); }}
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}

                    {/* VIEW: ALL AUDIOS */}
                    {viewMode === 'audio' && (
                        <div className="section-block">
                            <div className="section-header-row">
                                <span className="section-title">All Audios</span>
                                {!isAdding && (
                                    <button className="btn-icon-add" onClick={() => { setIsAdding('audio'); setInputValue(''); }} title="Add Audio">
                                        +
                                    </button>
                                )}
                            </div>

                            <div className="items-list">
                                {savedAudios.length === 0 ? (
                                    <div className="empty-hint">No audios added</div>
                                ) : (
                                    savedAudios.map(audio => (
                                        <div
                                            key={audio.id}
                                            className={`list-item track-item ${activeAudioId === audio.id ? 'active' : ''}`}
                                            onClick={() => { onSelectAudio(audio.id); navigate(-1); }}
                                        >
                                            <div className="track-thumb" style={{ backgroundImage: audio.thumbnail ? `url(${audio.thumbnail})` : 'none' }}>
                                                {!audio.thumbnail && (audio.type === 'youtube' ? '▶' : '♫')}
                                            </div>
                                            <div className="track-info">
                                                <span className="track-name">{audio.name}</span>
                                                <span className="track-artist">{audio.creator || 'Unknown'}</span>
                                            </div>
                                            {audio.id !== '1' && (
                                                <button
                                                    className="btn-delete-track"
                                                    onClick={(e) => { e.stopPropagation(); setItemToDelete({ type: 'audio', id: audio.id }); }}
                                                >
                                                    ✕
                                                </button>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>
            );
        }

        // B. Collection View (Drill-down)
        let tracksToDisplay = [];
        if (activeCollection) {
            tracksToDisplay = savedAudios.filter(a => activeCollection.audioIds.includes(a.id));
        }

        return (
            <div className="list-group">
                {tracksToDisplay.length === 0 && (
                    <div className="empty-hint">No tracks in this playlist</div>
                )}
                {tracksToDisplay.map(audio => (
                    <div
                        key={audio.id}
                        className={`list-item track-item ${activeAudioId === audio.id ? 'active' : ''}`}
                        onClick={() => { onSelectAudio(audio.id); navigate(-1); }}
                    >
                        <div className="track-thumb" style={{ backgroundImage: audio.thumbnail ? `url(${audio.thumbnail})` : 'none' }}>
                            {!audio.thumbnail && (audio.type === 'youtube' ? '▶' : '♫')}
                        </div>
                        <div className="track-info">
                            <span className="track-name">{audio.name}</span>
                            <span className="track-artist">{audio.creator || 'Unknown'}</span>
                        </div>
                        <button
                            className="btn-delete-track"
                            onClick={(e) => { e.stopPropagation(); setItemToDelete({ type: 'audio', id: audio.id }); }}
                        >
                            ✕
                        </button>
                    </div>
                ))}

                {!isAdding && (
                    <button className="btn-add-row" onClick={() => { setIsAdding('audio'); setInputValue(''); }}>
                        <span>+ Add to Playlist</span>
                    </button>
                )}
            </div>
        );
    };

    const renderAddOverlay = () => {
        if (!isAdding) return null;

        const isCollection = isAdding === 'collection';
        const title = isCollection ? "New Playlist" : "Add Audio";
        const placeholder = isCollection ? "Playlist Name..." : "Paste YouTube/Audio URL...";
        const actionLabel = isCollection ? "Create" : "Add";
        const handleConfirm = isCollection ? handleCreateCollection : handleAddAudio;

        return (
            <div className="add-overlay">
                <div className="add-card">
                    <h3 className="add-title">{title}</h3>
                    <input
                        autoFocus
                        className="add-input"
                        placeholder={placeholder}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleConfirm(); }}
                    />
                    <div className="add-actions">
                        <button className="btn-cancel" onClick={() => setIsAdding(false)}>Cancel</button>
                        <button className="btn-confirm" onClick={handleConfirm}>{actionLabel}</button>
                    </div>
                </div>
                <div className="overlay-backdrop" onClick={() => setIsAdding(false)} />
            </div>
        );
    };

    return (
        <div className="screen-content" style={{ paddingBottom: '100px' }}>
            {/* Header */}
            <div className="screen-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <button onClick={() => {
                        if (currentView !== 'root') {
                            setNavPath(['root']);
                        } else {
                            navigate(-1);
                        }
                    }} className="btn-icon-back">
                        <ArrowLeft size={28} />
                    </button>
                    <h2 className="screen-title">
                        {currentView === 'root' ? 'Background Audio' : (activeCollection ? activeCollection.name : 'All Tracks')}
                    </h2>
                </div>
            </div>

            <ConfirmModal
                isOpen={!!itemToDelete}
                onClose={() => setItemToDelete(null)}
                onConfirm={confirmDelete}
                title={itemToDelete?.type === 'collection' ? 'Delete Collection?' : 'Remove Audio?'}
                message={itemToDelete?.type === 'collection'
                    ? "This will delete the folder. Tracks will remain in All Tracks."
                    : (activeCollection ? "Remove from this collection?" : "Delete permanently?")}
            />

            <div className="playlist-manager">
                <div className="pm-content">
                    {renderList()}
                </div>
                {renderAddOverlay()}
            </div>

            {/* Styles Ported from AudioModal */}
            <style>{`
                .playlist-manager {
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                    width: 100%;
                }
                .section-header-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 8px;
                }
                .section-title {
                    font-size: 0.9rem;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    color: var(--text-secondary);
                }
                .btn-icon-add {
                    background: none;
                    border: 1px solid var(--border-color);
                    border-radius: 50%;
                    width: 24px;
                    height: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--text-primary);
                    cursor: pointer;
                    font-size: 1.2rem;
                    line-height: 1;
                    padding-bottom: 2px;
                }
                .btn-icon-add:hover {
                    background: var(--bg-secondary);
                    border-color: var(--primary-color);
                    color: var(--primary-color);
                }
                .empty-hint {
                    color: var(--text-secondary);
                    font-size: 0.9rem;
                    font-style: italic;
                    padding: 8px 12px;
                }
                /* Overlay Styles */
                .add-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    z-index: 200;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                }
                .overlay-backdrop {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0,0,0,0.5);
                    backdrop-filter: blur(4px);
                    z-index: 1;
                }
                .add-card {
                    position: relative;
                    z-index: 2;
                    background: rgba(20, 20, 20, 0.95);
                    backdrop-filter: blur(16px);
                    -webkit-backdrop-filter: blur(16px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    box-shadow: 0 8px 32px rgba(0,0,0,0.5);
                    border-radius: 16px;
                    padding: 24px;
                    width: 100%;
                    max-width: 320px;
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                    animation: popIn 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
                }
                @keyframes popIn {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                .add-title {
                    font-size: 1.1rem;
                    font-weight: 600;
                    color: var(--text-primary);
                    margin: 0;
                }
                .add-input {
                    background: rgba(0, 0, 0, 0.3);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 8px;
                    padding: 12px;
                    color: var(--text-primary);
                    font-size: 1rem;
                    width: 100%;
                }
                .add-input:focus {
                    outline: none;
                    border-color: var(--primary-color);
                }
                .add-actions {
                    display: flex;
                    justify-content: flex-end;
                    gap: 12px;
                }
                .add-actions button {
                    padding: 8px 16px;
                    border-radius: 8px;
                    font-size: 0.95rem;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .btn-cancel {
                    background: transparent;
                    border: 1px solid transparent;
                    color: var(--text-secondary);
                }
                .btn-cancel:hover {
                    color: var(--text-primary);
                    background: rgba(255,255,255,0.05);
                }
                .btn-confirm {
                    background: var(--primary);
                    border: 1px solid var(--primary);
                    color: white;
                }
                .btn-confirm:hover {
                    opacity: 0.9;
                    transform: translateY(-1px);
                }
                
                .pm-content {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                .list-item {
                    display: flex;
                    align-items: center;
                    padding: 12px;
                    border-radius: 12px;
                    background: rgba(255,255,255,0.03);
                    cursor: pointer;
                    transition: all 0.2s;
                    border: 1px solid transparent;
                    margin-bottom: 4px;
                }
                .list-item:hover {
                    background: rgba(255,255,255,0.06);
                    border-color: rgba(255,255,255,0.1);
                }
                .list-item.active {
                    background: rgba(99, 102, 241, 0.1);
                    border-color: var(--primary);
                }
                .folder-icon {
                    font-size: 1.5rem;
                    margin-right: 12px;
                }
                .folder-info, .track-info {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    min-width: 0;
                }
                .folder-name, .track-name {
                    font-weight: 500;
                    color: var(--text-primary);
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .folder-count, .track-artist {
                    font-size: 0.8rem;
                    color: var(--text-secondary);
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .track-thumb {
                    width: 40px;
                    height: 40px;
                    border-radius: 6px;
                    background-color: #333;
                    background-size: cover;
                    background-position: center;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-right: 12px;
                    color: #fff;
                    font-size: 0.8rem;
                    flex-shrink: 0;
                }
                .btn-delete-folder, .btn-delete-track {
                    background: none;
                    border: none;
                    color: var(--text-secondary);
                    font-size: 1.2rem;
                    padding: 8px;
                    cursor: pointer;
                }
                .btn-delete-folder:hover, .btn-delete-track:hover {
                    color: #ef4444;
                }
                .btn-add-row {
                    width: 100%;
                    padding: 12px;
                    background: transparent;
                    border: 1px dashed var(--text-secondary);
                    color: var(--text-secondary);
                    border-radius: 12px;
                    cursor: pointer;
                    margin-top: 8px;
                    transition: all 0.2s;
                }
                .btn-add-row:hover {
                    border-color: var(--primary);
                    color: var(--primary);
                    background: rgba(99, 102, 241, 0.05);
                }
                .btn-icon-back {
                    background: none;
                    border: none;
                    color: var(--text-primary);
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 0;
                }

                /* Reuse Range Toggle Styles */
                .range-toggle-container {
                    display: flex;
                    background: var(--surface);
                    padding: 4px;
                    border-radius: 12px;
                    margin-bottom: 24px;
                }
                .range-btn {
                    flex: 1;
                    padding: 8px;
                    border: none;
                    background: transparent;
                    color: var(--text-secondary);
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 500;
                    transition: all 0.2s;
                }
                .range-btn.active {
                    background: var(--background);
                    color: var(--text-primary);
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
            `}</style>
        </div>
    );
};

export default AudioLibraryScreen;
