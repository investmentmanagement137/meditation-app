import React, { useState, useEffect } from 'react';
import BaseModal from '../components/BaseModal';
import { AudioUtils } from '../hooks/useAudio';
import ConfirmModal from '../components/ConfirmModal';

const DEFAULT_AUDIOS = [
    { id: '1', name: 'None', type: 'none' }
];

const AudioModal = ({ isOpen, onClose, onSelect, currentAudioId, savedAudios, setSavedAudios, collections = [], setCollections }) => {

    // Navigation State: ['root'] -> ['library'] or ['collection', 'id']
    const [navPath, setNavPath] = useState(['root']);
    const currentView = navPath[navPath.length - 1]; // 'root', 'library', or collectionId

    // "Add Audio" or "Create Collection" Input State
    const [isAdding, setIsAdding] = useState(false); // 'audio' or 'collection' or false
    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        if (isOpen) {
            setNavPath(['root']);
            setIsAdding(false);
            setInputValue('');
        }
    }, [isOpen]);

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

        // Check if existing in Library first (by URL duplication check could be hard, assuming new for now)
        // ... Logic from previous implementation ...
        let finalAudio = null;

        if (url.includes('list=')) {
            // Playlist Logic (Simplified for now - just warn or take first)
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
            // Check if already in library
            const existing = savedAudios.find(a => a.id === finalAudio.id);
            if (!existing) {
                setSavedAudios([...savedAudios, finalAudio]);
                newAudioId = finalAudio.id;
            } else {
                newAudioId = existing.id;
            }

            // If in collection, add ID to collection
            if (activeCollection) {
                const updatedCollections = collections.map(c => {
                    if (c.id === activeCollection.id && !c.audioIds.includes(newAudioId)) {
                        return { ...c, audioIds: [...c.audioIds, newAudioId] };
                    }
                    return c;
                });
                setCollections(updatedCollections);
            }

            // Auto Select? Maybe not, just add.
            setIsAdding(false);
            setInputValue('');
        } else {
            alert('Invalid URL');
        }
    };

    // 3. Delete Audio
    const [itemToDelete, setItemToDelete] = useState(null); // { type: 'audio'|'collection', id: string }

    const confirmDelete = () => {
        if (!itemToDelete) return;

        if (itemToDelete.type === 'collection') {
            setCollections(collections.filter(c => c.id !== itemToDelete.id));
        } else if (itemToDelete.type === 'audio') {
            if (activeCollection) {
                // Remove from collection ONLY
                const updatedCollections = collections.map(c => {
                    if (c.id === activeCollection.id) {
                        return { ...c, audioIds: c.audioIds.filter(id => id !== itemToDelete.id) };
                    }
                    return c;
                });
                setCollections(updatedCollections);
            } else {
                // Remove from Library (Global) - also remove from all collections
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
    const renderHeader = () => {
        if (currentView === 'root') {
            return null;
        } else if (currentView === 'library') {
            return (
                <div className="modal-header-with-back">
                    <button onClick={() => setNavPath(['root'])}>←</button>
                    <span>All Tracks</span>
                </div>
            );
        } else if (activeCollection) {
            return (
                <div className="modal-header-with-back">
                    <button onClick={() => setNavPath(['root'])}>←</button>
                    <span>{activeCollection.name}</span>
                </div>
            );
        }
        return null; // Should not happen with current navPath logic
    };

    const renderList = () => {
        // A. Root View
        if (currentView === 'root') {
            return (
                <div className="list-group-root">
                    {/* SECTION 1: PLAYLISTS */}
                    <div className="section-block">
                        <div className="section-header-row">
                            <span className="section-title">Playlists</span>
                            {!isAdding && (
                                <button className="btn-icon-add" onClick={() => { setIsAdding('collection'); setInputValue(''); }} title="New Playlist">
                                    +
                                </button>
                            )}
                        </div>

                        {/* Collection List */}
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

                        {/* Collection Input */}
                        {isAdding === 'collection' && (
                            <div className="inline-input-area">
                                <input
                                    autoFocus
                                    placeholder="Playlist Name..."
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={(e) => { if (e.key === 'Enter') handleCreateCollection(); }}
                                />
                                <div className="inline-actions">
                                    <button onClick={() => setIsAdding(false)}>Cancel</button>
                                    <button onClick={handleCreateCollection}>Create</button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* SECTION 2: ALL AUDIOS */}
                    <div className="section-block" style={{ marginTop: '24px' }}>
                        <div className="section-header-row">
                            <span className="section-title">All Audios</span>
                            {!isAdding && (
                                <button className="btn-icon-add" onClick={() => { setIsAdding('audio'); setInputValue(''); }} title="Add Audio">
                                    +
                                </button>
                            )}
                        </div>

                        {/* Audio List (Directly here) */}
                        <div className="items-list">
                            {savedAudios.length === 0 ? (
                                <div className="empty-hint">No audios added</div>
                            ) : (
                                savedAudios.map(audio => (
                                    <div
                                        key={audio.id}
                                        className={`list-item track-item ${currentAudioId === audio.id ? 'active' : ''}`}
                                        onClick={() => { onSelect(audio.id); onClose(); }}
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

                        {/* Audio Input */}
                        {isAdding === 'audio' && (
                            <div className="inline-input-area">
                                <input
                                    autoFocus
                                    placeholder="YouTube/Audio URL..."
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={(e) => { if (e.key === 'Enter') handleAddAudio(); }}
                                />
                                <div className="inline-actions">
                                    <button onClick={() => setIsAdding(false)}>Cancel</button>
                                    <button onClick={handleAddAudio}>Add</button>
                                </div>
                            </div>
                        )}
                    </div>
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
                        className={`list-item track-item ${currentAudioId === audio.id ? 'active' : ''}`}
                        onClick={() => { onSelect(audio.id); onClose(); }}
                    >
                        <div className="track-thumb" style={{ backgroundImage: audio.thumbnail ? `url(${audio.thumbnail})` : 'none' }}>
                            {!audio.thumbnail && (audio.type === 'youtube' ? '▶' : '♫')}
                        </div>
                        <div className="track-info">
                            <span className="track-name">{audio.name}</span>
                            <span className="track-artist">{audio.creator || 'Unknown'}</span>
                        </div>
                        {/* In collection view, remove means remove from collection */}
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

    return (
        <BaseModal isOpen={isOpen} onClose={onClose} title={<span>&nbsp;</span>}>
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
                <div className="pm-header">
                    {renderHeader()}
                </div>

                <div className="pm-content">
                    {renderList()}
                </div>

                {/* Input Area for Adding */}
                {isAdding && (
                    <div className="pm-input-area">
                        <input
                            autoFocus
                            placeholder={isAdding === 'collection' ? "Collection Name..." : "Paste YouTube/Audio URL..."}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') isAdding === 'collection' ? handleCreateCollection() : handleAddAudio();
                            }}
                        />
                        <div className="pm-input-actions">
                            <button className="btn-cancel" onClick={() => setIsAdding(false)}>Cancel</button>
                            <button className="btn-confirm" onClick={isAdding === 'collection' ? handleCreateCollection : handleAddAudio}>
                                {isAdding === 'collection' ? 'Create' : 'Add'}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                .playlist-manager {
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                    max-height: 60vh;
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
                .inline-input-area {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    background: rgba(255,255,255,0.05);
                    padding: 4px 8px;
                    border-radius: 8px;
                    margin-top: 8px;
                    border: 1px solid rgba(255,255,255,0.1);
                }
                .inline-input-area input {
                    flex: 1;
                    background: transparent;
                    border: none;
                    color: var(--text-primary);
                    font-size: 0.9rem;
                    outline: none;
                    padding: 8px 0;
                }
                .inline-actions {
                    display: flex;
                    gap: 8px;
                }
                .inline-actions button {
                    background: rgba(255,255,255,0.1);
                    border: 1px solid rgba(255,255,255,0.1);
                    cursor: pointer;
                    font-size: 0.8rem;
                    padding: 6px 12px;
                    color: var(--text-primary);
                    border-radius: 6px;
                    transition: all 0.2s;
                }
                .inline-actions button:hover {
                    background: rgba(var(--primary-rgb), 0.2);
                    border-color: var(--primary-color);
                    color: white;
                }
                /* Specific style for Cancel button if needed, but generic hover works fine */
                .inline-actions button:first-child:hover {
                    background: rgba(255,50,50,0.2);
                    border-color: rgba(255,50,50,0.5);
                }
                
                .pm-header {
                    margin-bottom: 16px;
                    border-bottom: 1px solid var(--border-color);
                    padding-bottom: 12px;
                }
                .modal-header-title {
                    font-size: 1.25rem;
                    font-weight: 600;
                    color: var(--text-primary);
                }
                .modal-header-with-back {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    font-size: 1.1rem;
                    font-weight: 600;
                    color: var(--text-primary);
                }
                .modal-header-with-back button {
                    background: none;
                    border: none;
                    font-size: 1.5rem;
                    cursor: pointer;
                    color: var(--text-primary);
                    padding: 0 8px;
                }
                .pm-content {
                    flex: 1;
                    overflow-y: auto;
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
                    background: rgba(var(--primary-rgb), 0.1);
                    border-color: var(--primary-color);
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
                    border-color: var(--primary-color);
                    color: var(--primary-color);
                    background: rgba(var(--primary-rgb), 0.05);
                }
            `}</style>
        </BaseModal>
    );
};

export default AudioModal;
