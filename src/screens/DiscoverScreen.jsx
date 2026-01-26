import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Check, Sparkles } from 'lucide-react';
import { FEATURED_PLAYLISTS } from '../conf/featuredPlaylists';

const DiscoverScreen = ({ savedAudios, setSavedAudios, collections, setCollections }) => {
    const navigate = useNavigate();

    const handleInstallPlaylist = (playlist) => {
        const newSavedAudios = [...savedAudios];
        const addedAudioIds = [];

        playlist.tracks.forEach(track => {
            const exists = newSavedAudios.find(a => a.id === track.id);
            if (!exists) {
                newSavedAudios.push({
                    ...track,
                    thumbnail: track.thumbnail || `https://img.youtube.com/vi/${track.id}/hqdefault.jpg`
                });
            }
            addedAudioIds.push(track.id);
        });

        setSavedAudios(newSavedAudios);

        const newCollection = {
            id: `fp-${playlist.id}-${Date.now()}`,
            name: playlist.name,
            audioIds: addedAudioIds,
            isFeatured: true
        };

        setCollections([...collections, newCollection]);
        navigate('/audio');
    };

    const isPlaylistInstalled = (playlistName) => {
        return (collections || []).some(c => c.name === playlistName);
    };

    return (
        <div className="discover-screen">
            {/* Header */}
            <div className="discover-header">
                <button onClick={() => navigate(-1)} className="back-button">
                    <ArrowLeft size={28} />
                </button>
                <div className="header-text">
                    <h2 className="title">
                        Discover <Sparkles size={20} className="sparkle-icon" />
                    </h2>
                    <p className="subtitle">Curated meditation soundscapes</p>
                </div>
            </div>

            <div className="discover-container">
                <div className="discover-grid">
                    {FEATURED_PLAYLISTS.map(fp => {
                        const installed = isPlaylistInstalled(fp.name);
                        return (
                            <div key={fp.id} className="discover-card">
                                <div className="card-media">
                                    <div
                                        className="card-image"
                                        style={{ backgroundImage: `url(${fp.thumbnail})` }}
                                    />
                                    <div className="card-overlay" />

                                    <button
                                        onClick={() => !installed && handleInstallPlaylist(fp)}
                                        className={`install-button ${installed ? 'installed' : ''}`}
                                    >
                                        {installed ? (
                                            <><Check size={20} /> <span>Library</span></>
                                        ) : (
                                            <><Download size={20} /> <span>Install</span></>
                                        )}
                                    </button>
                                </div>

                                <div className="card-info">
                                    <div className="info-header">
                                        <h3 className="card-title">{fp.name}</h3>
                                        <span className="track-count">{fp.tracks.length} Tracks</span>
                                    </div>
                                    <p className="card-desc">{fp.description}</p>
                                    <div className="card-footer">
                                        <div className="creator-avatar">{fp.creator.charAt(0)}</div>
                                        <span>Curated by {fp.creator}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <style>{`
                :root {
                    --background-gradient: linear-gradient(to bottom, #1a202c, #000000);
                    --text-primary: #ffffff;
                    --text-secondary: #a0aec0;
                    --surface: rgba(255, 255, 255, 0.05);
                    --primary: #fbbf24; /* Amber-500 */
                    --primary-light: #fcd34d; /* Amber-400 */
                    --accent: #6366f1; /* Indigo-500 */
                }

                .discover-screen {
                    min-height: 100vh;
                    background: var(--background-gradient);
                    color: var(--text-primary);
                    padding-bottom: 120px;
                }
                .discover-header {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    padding: 24px;
                    position: sticky;
                    top: 0;
                    background: rgba(15, 23, 42, 0.8);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    z-index: 100;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                }
                .back-button {
                    background: none;
                    border: none;
                    color: var(--text-primary);
                    padding: 8px;
                    cursor: pointer;
                    border-radius: 50%;
                    transition: background 0.2s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .back-button:hover {
                    background: rgba(255, 255, 255, 0.1);
                }
                .header-text .title {
                    font-size: 1.5rem;
                    font-weight: 700;
                    margin: 0;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    color: var(--text-primary);
                }
                .sparkle-icon {
                    color: #fbbf24;
                }
                .header-text .subtitle {
                    font-size: 0.85rem;
                    color: var(--text-secondary);
                    margin: 2px 0 0 0;
                }

                .discover-container {
                    padding: 24px;
                }
                .discover-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 24px;
                }
                @media (min-width: 640px) {
                    .discover-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }

                .discover-card {
                    background: var(--surface);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 24px;
                    overflow: hidden;
                    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease;
                }
                .discover-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
                    border-color: rgba(99, 102, 241, 0.4);
                }

                .card-media {
                    height: 180px;
                    position: relative;
                    overflow: hidden;
                }
                .card-image {
                    width: 100%;
                    height: 100%;
                    background-size: cover;
                    background-position: center;
                    transition: transform 0.5s ease;
                }
                .discover-card:hover .card-image {
                    transform: scale(1.05);
                }
                .card-overlay {
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%);
                }

                .install-button {
                    position: absolute;
                    bottom: 16px;
                    right: 16px;
                    background: var(--primary);
                    color: black; /* Changed from white to black for better contrast with amber */
                    border: none;
                    padding: 12px 20px;
                    border-radius: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                    transition: all 0.2s;
                }
                .install-button:not(.installed):hover {
                    transform: scale(1.05);
                    background: var(--primary-light);
                }
                .install-button.installed {
                    background: #22c55e;
                    color: white;
                    cursor: default;
                }

                .card-info {
                    padding: 20px;
                }
                .info-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 8px;
                }
                .card-title {
                    font-size: 1.1rem;
                    font-weight: 700;
                    margin: 0;
                }
                .track-count {
                    font-size: 0.7rem;
                    background: rgba(255, 255, 255, 0.1);
                    padding: 4px 8px;
                    border-radius: 20px;
                    color: var(--text-secondary);
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                .card-desc {
                    font-size: 0.9rem;
                    color: var(--text-secondary);
                    line-height: 1.5;
                    margin: 0 0 16px 0;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                .card-footer {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-size: 0.75rem;
                    color: var(--text-secondary);
                    padding-top: 12px;
                    border-top: 1px solid rgba(255, 255, 255, 0.05);
                }
                .creator-avatar {
                    width: 20px;
                    height: 20px;
                    background: rgba(99, 102, 241, 0.2);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--accent);
                    font-weight: 800;
                }
            `}</style>
        </div>
    );
};

export default DiscoverScreen;
