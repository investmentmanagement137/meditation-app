import React from 'react';
import { ArrowLeft, Mail, Phone, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ContactScreen = () => {
    const navigate = useNavigate();

    return (
        <div className="screen-content">
            <div className="screen-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <button onClick={() => navigate(-1)} className="btn-icon-back">
                        <ArrowLeft size={28} />
                    </button>
                    <h2 className="screen-title">Contact Us</h2>
                </div>
            </div>

            <div className="settings-card" style={{ padding: '32px', textAlign: 'center' }}>
                <div style={{
                    width: '80px', height: '80px',
                    background: 'linear-gradient(135deg, var(--primary) 0%, #a855f7 100%)',
                    borderRadius: '50%', margin: '0 auto 24px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 10px 30px rgba(168, 85, 247, 0.4)'
                }}>
                    <Mail size={32} color="white" />
                </div>

                <h3 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>We'd love to hear from you</h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '32px' }}>
                    Have suggestions, feedback, or need help? Reach out to our team directly.
                </p>

                <div style={{ display: 'grid', gap: '16px' }}>
                    <div className="contact-item">
                        <Mail className="icon-blue" size={24} />
                        <div>support@meditation.app</div>
                    </div>
                </div>
            </div>

            <style>{`
                .contact-item {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    padding: 16px;
                    background: var(--surface);
                    border-radius: 16px;
                    border: 1px solid rgba(255,255,255,0.05);
                    font-size: 1rem;
                    color: var(--text-primary);
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

export default ContactScreen;
