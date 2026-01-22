import React, { useState, useEffect } from 'react';
import BaseModal from '../components/BaseModal';

const APIKeyModal = ({ isOpen, onClose, apiKey, setApiKey }) => {
    const [tempKey, setTempKey] = useState(apiKey || '');

    useEffect(() => {
        setTempKey(apiKey || '');
    }, [apiKey, isOpen]);

    const handleSave = () => {
        setApiKey(tempKey);
        onClose();
    };

    return (
        <BaseModal isOpen={isOpen} onClose={onClose} title="Gemini API Configuration">
            <div style={{ padding: '8px 0' }}>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: '1.5' }}>
                    Enter your Gemini API key to enable specific meditation insights and AI-generated quotes.
                </p>
                <input
                    type="password"
                    value={tempKey}
                    onChange={(e) => setTempKey(e.target.value)}
                    placeholder="Paste API Key here"
                    className="api-input"
                    style={{
                        width: '100%',
                        marginBottom: '20px',
                        padding: '16px',
                        borderRadius: '12px',
                        border: '1px solid var(--border-color)',
                        background: 'var(--background)',
                        color: 'var(--text-primary)',
                        outline: 'none',
                        fontSize: '1rem'
                    }}
                />
                <button
                    onClick={handleSave}
                    style={{
                        width: '100%',
                        padding: '16px',
                        borderRadius: '12px',
                        background: 'var(--primary)',
                        color: 'white',
                        border: 'none',
                        fontWeight: '600',
                        fontSize: '1rem',
                        cursor: 'pointer',
                        transition: 'opacity 0.2s'
                    }}
                >
                    {apiKey ? 'Update Key' : 'Save Key'}
                </button>
            </div>
        </BaseModal>
    );
};

export default APIKeyModal;
