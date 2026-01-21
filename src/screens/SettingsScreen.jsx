import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useLocalStorage from '../hooks/useLocalStorage';
import AudioSelector from '../components/AudioSelector';
import {
    Sparkles, Key, Bot, Settings, Volume2,
    VolumeX, Moon, Sun, Bell, Clock,
    Music, Share2, Mail, FileText, ChevronRight, Zap
} from 'lucide-react';

const SettingsScreen = ({
    savedAudios,
    selectedAudioId,
    onOpenAudioModal,
    onOpenDurationModal,
    onOpenIntervalModal
}) => {
    const navigate = useNavigate();
    // --- State ---
    const [totalSilence, setTotalSilence] = useLocalStorage('settings_silence', false);
    const [minimalDesign, setMinimalDesign] = useLocalStorage('settings_minimal', true);

    const selectedAudio = savedAudios.find(a => a.id === selectedAudioId) || null;

    // --- Theme Logic ---
    const [isDark, setIsDark] = useState(true);

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            setIsDark(false);
        } else if (savedTheme === 'dark') {
            setIsDark(true);
        } else {
            const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            setIsDark(isSystemDark);
        }
    }, []);

    const toggleTheme = () => {
        const root = document.documentElement;
        if (root.classList.contains('dark')) {
            root.classList.remove('dark');
            root.classList.add('light');
            localStorage.setItem('theme', 'light');
            setIsDark(false);
        } else {
            root.classList.remove('light');
            root.classList.add('dark');
            localStorage.setItem('theme', 'dark');
            setIsDark(true);
        }
    };

    // --- AI State ---
    const [apiKey, setApiKey] = useLocalStorage('gemini_api_key', '');
    const [tempKey, setTempKey] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (apiKey) setTempKey(apiKey);
    }, [apiKey]);

    const handleSaveKey = () => {
        setApiKey(tempKey);
        setIsEditing(false);
    };

    // --- Components ---
    const Toggle = ({ checked, onChange }) => (
        <div
            className={`settings-toggle ${checked ? 'active' : ''}`}
            onClick={(e) => { e.stopPropagation(); onChange(!checked); }}
        />
    );

    const SettingsItem = ({ icon, colorClass, title, subtitle, rightElement, onClick }) => (
        <div className="settings-item" onClick={onClick}>
            <div className="settings-item-content">
                <div className={`settings-item-icon ${colorClass}`}>
                    {icon}
                </div>
                <div className="settings-item-text">
                    <div className="settings-item-title">{title}</div>
                    {subtitle && <div className="settings-item-subtitle">{subtitle}</div>}
                </div>
            </div>
            {rightElement || <ChevronRight size={20} color="var(--text-secondary)" />}
        </div>
    );

    return (
        <div className="screen-content">
            <div className="screen-header">
                <h2 className="screen-title">Settings</h2>
            </div>

            <div className="settings-container" style={{ width: '100%', paddingBottom: '40px' }}>

                {/* Profile Header */}
                <div className="settings-profile-header">
                    <img
                        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        alt="Profile"
                        className="settings-avatar"
                    />
                    <div className="settings-name">Guest User</div>
                    <div className="settings-email">guest@meditation.app</div>
                </div>

                {/* Preferences Card */}
                <div className="settings-card">
                    <SettingsItem
                        icon={<VolumeX size={20} />}
                        colorClass="icon-purple"
                        title="Total Silence"
                        subtitle="Silence all sounds during meditation"
                        rightElement={<Toggle checked={totalSilence} onChange={setTotalSilence} />}
                    />
                    <SettingsItem
                        icon={<Zap size={20} />}
                        colorClass="icon-blue"
                        title="Minimalistic design"
                        subtitle="Show minimum info during meditation"
                        rightElement={<Toggle checked={minimalDesign} onChange={setMinimalDesign} />}
                    />
                </div>

                {/* Sounds & Bells Card */}
                <div className="settings-card">
                    <SettingsItem
                        icon={<Clock size={20} />}
                        colorClass="icon-cyan"
                        title="Starting Bell"
                        subtitle="Select duration and start sound" // Modified purpose slightly as duration modal creates start context
                        onClick={onOpenDurationModal}
                    />
                    <SettingsItem
                        icon={<Bell size={20} />}
                        colorClass="icon-orange"
                        title="Interval Bell"
                        subtitle="Select the interval bell sound"
                        onClick={onOpenIntervalModal}
                    />
                    <SettingsItem
                        icon={<Music size={20} />}
                        colorClass="icon-pink"
                        title="Background Audios"
                        subtitle={selectedAudio ? `Current: ${selectedAudio.name}` : "Select background sounds"}
                        onClick={() => navigate('/audio')}
                    />


                </div>

                {/* Appearance Card */}
                <div className="settings-card">
                    <SettingsItem
                        icon={isDark ? <Moon size={20} /> : <Sun size={20} />}
                        colorClass="icon-blue"
                        title="Themes"
                        subtitle={`Current: ${isDark ? 'Dark Mode' : 'Light Mode'}`}
                        onClick={toggleTheme}
                        rightElement={<ChevronRight size={20} color="var(--text-secondary)" />} // Explicit chevron to imply navigate/action
                    />
                    <SettingsItem
                        icon={<Clock size={20} />}
                        colorClass="icon-orange"
                        title="Clock Layout"
                        subtitle="Select preferred clock layout"
                    />
                </div>

                {/* AI Features (Existing) */}
                <div className="settings-card">
                    <SettingsItem
                        icon={<Bot size={20} />}
                        colorClass="icon-purple"
                        title="Gemini AI Configuration"
                        subtitle={apiKey ? "Key Connected" : "Connect API Key"}
                        rightElement={
                            apiKey && !isEditing ? (
                                <span style={{ fontSize: '12px', color: '#4ade80', fontWeight: 'bold' }}>Active</span>
                            ) : <ChevronRight size={20} />
                        }
                        onClick={() => setIsEditing(!isEditing)}
                    />

                    {/* Inline AI Edit Form */}
                    {isEditing && (
                        <div style={{ padding: '0 24px 24px 24px' }}>
                            <div style={{ background: 'var(--background)', padding: '16px', borderRadius: '16px', marginTop: '8px' }}>
                                <p style={{ fontSize: '13px', lineHeight: '1.4', opacity: 0.8, marginBottom: '16px' }}>
                                    Enter your Gemini API key to enable specific meditation insights.
                                </p>
                                <input
                                    type="password"
                                    value={tempKey}
                                    onChange={(e) => setTempKey(e.target.value)}
                                    placeholder="Paste API Key here"
                                    className="api-input"
                                    style={{ width: '100%', marginBottom: '12px', padding: '12px' }}
                                />
                                <button
                                    onClick={handleSaveKey}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        borderRadius: '12px',
                                        background: 'var(--primary)',
                                        color: 'white',
                                        border: 'none',
                                        fontWeight: '600'
                                    }}
                                >
                                    {apiKey ? 'Update Key' : 'Save Key'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Support Card */}
                <div className="settings-card">
                    <SettingsItem
                        icon={<Share2 size={20} />}
                        colorClass="icon-cyan"
                        title="Share"
                        subtitle="Link to share this app"
                    />
                    <SettingsItem
                        icon={<Mail size={20} />}
                        colorClass="icon-orange"
                        title="Contact Us"
                        subtitle="Provide us some feed back"
                    />
                    <SettingsItem
                        icon={<FileText size={20} />}
                        colorClass="icon-pink"
                        title="Privacy Policy"
                        subtitle="Select The Background Sounds"
                    />
                    <SettingsItem
                        icon={<FileText size={20} />}
                        colorClass="icon-green"
                        title="Terms and Conditions"
                        subtitle="Select the ending bell"
                    />
                </div>

            </div>
        </div>
    );
};

export default SettingsScreen;
