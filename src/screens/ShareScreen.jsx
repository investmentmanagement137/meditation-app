import React from 'react';
import { ArrowLeft, Copy, Share2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import QRCode from 'react-qr-code';

const ShareScreen = () => {
    const navigate = useNavigate();
    const appUrl = window.location.origin + "/meditation-app"; // Dynamic based on current host

    const handleCopy = () => {
        navigator.clipboard.writeText(appUrl)
            .then(() => alert("Link copied to clipboard!"))
            .catch(err => console.error("Failed to copy:", err));
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Meditation App',
                    text: 'Join me in mindfulness with this amazing app!',
                    url: appUrl,
                });
            } catch (error) {
                console.log('Error sharing:', error);
            }
        } else {
            handleCopy();
        }
    };

    return (
        <div className="screen-content">
            <div className="screen-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <button onClick={() => navigate(-1)} className="btn-icon-back">
                        <ArrowLeft size={28} />
                    </button>
                    <h2 className="screen-title">Share App</h2>
                </div>
            </div>

            <div className="share-card-container">
                <div className="share-card">
                    <div className="app-branding">
                        <div className="app-logo-placeholder">🧘</div>
                        <h3 className="app-name">Meditation App</h3>
                        <p className="app-tagline">Find your inner peace</p>
                    </div>

                    <div className="qr-wrapper">
                        <QRCode
                            value={appUrl}
                            size={180}
                            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                            viewBox={`0 0 256 256`}
                            bgColor="transparent"
                            fgColor="var(--text-primary)"
                        />
                    </div>

                    <div className="actions-row">
                        <button className="action-btn secondary" onClick={handleCopy}>
                            <Copy size={20} />
                            <span>Copy Link</span>
                        </button>
                        <button className="action-btn primary" onClick={handleShare}>
                            <Share2 size={20} />
                            <span>Share</span>
                        </button>
                    </div>
                </div>
            </div>

            <style>{`
                .share-card-container {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 100%;
                    padding-bottom: 80px;
                }
                .share-card {
                    background: var(--surface);
                    border: 1px solid rgba(255,255,255,0.05);
                    border-radius: 24px;
                    padding: 32px;
                    width: 100%;
                    max-width: 340px;
                    text-align: center;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.3);
                }
                .app-branding {
                    margin-bottom: 24px;
                }
                .app-logo-placeholder {
                    font-size: 3rem;
                    margin-bottom: 8px;
                }
                .app-name {
                    font-size: 1.25rem;
                    font-weight: 700;
                    margin: 0;
                    color: var(--text-primary);
                }
                .app-tagline {
                    font-size: 0.9rem;
                    color: var(--text-secondary);
                    margin: 4px 0 0 0;
                }
                .qr-wrapper {
                    background: white; /* QR needs contrast */
                    padding: 16px;
                    border-radius: 16px;
                    margin: 0 auto 24px;
                    width: fit-content;
                }
                /* Override QR color for light/dark mode compatibility if needed, 
                   but QR scanners usually need dark on light. Keeping bg white wrapper. */
                .qr-wrapper svg {
                    display: block;
                }
                
                .actions-row {
                    display: flex;
                    gap: 12px;
                }
                .action-btn {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    padding: 12px;
                    border-radius: 12px;
                    font-weight: 600;
                    font-size: 0.95rem;
                    cursor: pointer;
                    transition: all 0.2s;
                    border: none;
                }
                .action-btn.primary {
                    background: var(--primary);
                    color: white;
                }
                .action-btn.secondary {
                    background: rgba(255,255,255,0.05);
                    color: var(--text-primary);
                }
                .action-btn:active {
                    transform: scale(0.96);
                }
                .btn-icon-back {
                    background: none;
                    border: none;
                    color: var(--text-primary);
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
            `}</style>
        </div>
    );
};

export default ShareScreen;
