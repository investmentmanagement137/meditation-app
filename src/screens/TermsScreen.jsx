import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TermsScreen = () => {
    const navigate = useNavigate();

    return (
        <div className="screen-content">
            <div className="screen-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <button onClick={() => navigate(-1)} className="btn-icon-back">
                        <ArrowLeft size={28} />
                    </button>
                    <h2 className="screen-title">Terms & Conditions</h2>
                </div>
            </div>

            <div className="doc-content">
                <p>Last updated: January 2026</p>

                <h3>1. Acceptance of Terms</h3>
                <p>By using this app, you agree to these terms. If you do not agree, please do not use the app.</p>

                <h3>2. Usage License</h3>
                <p>Permission is granted to use this app for personal, non-commercial transitory viewing only.</p>

                <h3>3. Disclaimer</h3>
                <p>The materials on this app are provided on an 'as is' basis. Makes no warranties, expressed or implied.</p>

                <h3>4. Limitations</h3>
                <p>In no event shall we be liable for any damages arising out of the use or inability to use the materials on this app.</p>
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

export default TermsScreen;
