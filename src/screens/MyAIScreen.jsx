import React, { useState, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { Sparkles, Key, Bot } from 'lucide-react';

const MyAIScreen = () => {
    const [apiKey, setApiKey] = useLocalStorage('gemini_api_key', '');
    const [tempKey, setTempKey] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (apiKey) {
            setTempKey(apiKey);
        }
    }, [apiKey]);

    const handleSave = () => {
        setApiKey(tempKey);
        setIsEditing(false);
    };

    return (
        <div className="screen-content">
            <div className="screen-header">
                <h2 className="screen-title">My AI</h2>
            </div>

            <div className="ai-settings-container" style={{ width: '100%' }}>

                <div className="ai-card" style={{
                    background: 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
                    borderRadius: '24px',
                    padding: '24px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    marginBottom: '24px'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <div style={{
                            width: '40px', height: '40px', borderRadius: '12px',
                            background: 'linear-gradient(135deg, #FF0080 0%, #7928CA 100%)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <Bot size={24} color="white" />
                        </div>
                        <div>
                            <div style={{ fontSize: '18px', fontWeight: '600' }}>Gemini AI</div>
                            <div style={{ fontSize: '12px', opacity: 0.7 }}>Powered by Google</div>
                        </div>
                    </div>

                    <p style={{ fontSize: '14px', lineHeight: '1.5', opacity: 0.8, marginBottom: '24px' }}>
                        Connect your Gemini API key to enable personalized meditation insights, emotion analysis, and tailored session recommendations.
                    </p>

                    <div className="key-input-section">
                        <label style={{ fontSize: '12px', textTransform: 'uppercase', opacity: 0.6, marginBottom: '8px', display: 'block', letterSpacing: '1px' }}>
                            API Configuration
                        </label>

                        {apiKey && !isEditing ? (
                            <div style={{
                                background: 'rgba(0,255,0,0.1)',
                                border: '1px solid rgba(0,255,0,0.2)',
                                borderRadius: '12px',
                                padding: '16px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Key size={16} color="#69f0ae" />
                                    <span style={{ color: '#69f0ae', fontWeight: '500' }}>Key Connected</span>
                                </div>
                                <button
                                    onClick={() => setIsEditing(true)}
                                    style={{
                                        background: 'transparent',
                                        border: '1px solid rgba(255,255,255,0.2)',
                                        color: 'white',
                                        padding: '6px 12px',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontSize: '12px'
                                    }}
                                >
                                    Change
                                </button>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <input
                                    type="password"
                                    value={tempKey}
                                    onChange={(e) => setTempKey(e.target.value)}
                                    placeholder="Paste your Gemini API Key here"
                                    style={{
                                        width: '100%',
                                        padding: '16px',
                                        borderRadius: '12px',
                                        background: 'rgba(0,0,0,0.3)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        color: 'white',
                                        fontSize: '14px',
                                        outline: 'none'
                                    }}
                                />
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button
                                        onClick={handleSave}
                                        style={{
                                            flex: 1,
                                            padding: '14px',
                                            borderRadius: '12px',
                                            background: 'var(--primary)',
                                            color: 'white',
                                            border: 'none',
                                            fontWeight: '600',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {apiKey ? 'Update Key' : 'Save Key'}
                                    </button>
                                    {isEditing && (
                                        <button
                                            onClick={() => setIsEditing(false)}
                                            style={{
                                                padding: '14px',
                                                borderRadius: '12px',
                                                background: 'rgba(255,255,255,0.1)',
                                                color: 'white',
                                                border: 'none',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="ai-features" style={{ marginTop: '32px' }}>
                    <h3 style={{ fontSize: '16px', marginBottom: '16px' }}>Available Features</h3>
                    <div style={{ display: 'grid', gap: '16px' }}>
                        <div style={{
                            background: 'var(--surface)',
                            padding: '16px',
                            borderRadius: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '16px'
                        }}>
                            <div style={{ background: 'rgba(255,255,255,0.1)', padding: '10px', borderRadius: '50%' }}>
                                <Sparkles size={20} color="#ffd700" />
                            </div>
                            <div>
                                <div style={{ fontWeight: '600', marginBottom: '4px' }}>Session Analysis</div>
                                <div style={{ fontSize: '12px', opacity: 0.7 }}>Get comprehensive insights after every session.</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyAIScreen;
