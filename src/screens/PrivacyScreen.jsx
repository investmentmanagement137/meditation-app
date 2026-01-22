import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PrivacyScreen = () => {
    const navigate = useNavigate();

    return (
        <div className="screen-content">
            <div className="screen-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <button onClick={() => navigate(-1)} className="btn-icon-back">
                        <ArrowLeft size={28} />
                    </button>
                    <h2 className="screen-title">Privacy Policy</h2>
                </div>
            </div>

            <div className="doc-content">
                <p>Last updated: January 2026</p>

                <h3>1. Introduction</h3>
                <p>Welcome to our Meditation App. We respect your privacy and are committed to protecting your personal data.</p>

                <h3>2. Data We Collect</h3>
                <p>We do not collect any personal data. All meditation logs and preferences are stored locally on your device.</p>

                <h3>3. Third-Party Services</h3>
                <p>We use YouTube API for audio streaming. Please refer to Google's Privacy Policy for more information.</p>

                <h3>4. Contact Us</h3>
                <p>If you have any questions, please contact us at support@meditation.app.</p>
            </div>

            <style>{`
                .doc-content {
                    background: var(--surface);
                    padding: 24px;
                    border-radius: 20px;
                    color: var(--text-secondary);
                    line-height: 1.7;
                    font-size: 0.95rem;
                }
                .doc-content h3 {
                    color: var(--text-primary);
                    margin: 24px 0 12px 0;
                    font-size: 1.1rem;
                }
                .doc-content h3:first-child {
                    margin-top: 0;
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

export default PrivacyScreen;
