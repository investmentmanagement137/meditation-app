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
    onOpenStartBellModal,
    onOpenIntervalBellModal,
    onOpenThemeModal,
    onOpenClockModal,
    onOpenAIModal,

    // Status Props for display
    startSound,
    intervalSound,
    clockLayout,
    apiKey
}) => {
    const navigate = useNavigate();
    const [selectedAudio, setSelectedAudio] = useState(null);

    // --- Preferences State ---
    const [totalSilence, setTotalSilence] = useLocalStorage('pref_total_silence', false);
    const [disableQuotes, setDisableQuotes] = useLocalStorage('pref_minimal_design', false); // Reuse KEY or new? Reuse 'minimal' as it means same thing functionally

    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        // Just for display updating if theme changes elsewhere
        const savedTheme = localStorage.getItem('theme');
        setIsDark(savedTheme === 'dark');
    }, []); // Or listen to storage event/prop if we want instant update without reload, but Modal handles global toggle

    useEffect(() => {
        if (selectedAudioId && selectedAudioId !== '1') {
            const found = savedAudios.find(a => a.id === selectedAudioId);
            setSelectedAudio(found || null);
        } else {
            setSelectedAudio(null);
        }
    }, [selectedAudioId, savedAudios]);


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
                <div className={`settings-item-icon ${colorClass} centered-icon`}>
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

    const handleShare = async () => {
        const appUrl = window.location.origin + "/meditation-app";
        try { await navigator.clipboard.writeText(appUrl); } catch (e) { console.log(e); }
        navigate('/share');
    };

    return (
        <div className="screen-content">
            <div className="screen-header">
                <h2 className="screen-title">Settings</h2>
            </div>

            <style>{`
                .centered-icon {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 40px; 
                    height: 40px;
                    border-radius: 12px;
                    flex-shrink: 0;
                }
                .settings-section-title {
                    margin: 24px 0 12px 4px;
                    font-size: 0.85rem;
                    font-weight: 600;
                    color: var(--text-secondary);
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }
                .section-group {
                    margin-bottom: 24px;
                }
            `}</style>

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

                {/* AUDIO SETTINGS SECTION */}
                <div className="section-group">
                    <h3 className="settings-section-title">Audio Settings</h3>
                    <div className="settings-card">
                        <SettingsItem
                            icon={<VolumeX size={20} />}
                            colorClass="icon-purple"
                            title="Total Silence"
                            subtitle="Silence all sounds during meditation"
                            rightElement={<Toggle checked={totalSilence} onChange={setTotalSilence} />}
                        />
                        <SettingsItem
                            icon={<Clock size={20} />}
                            colorClass="icon-cyan"
                            title="Starting Bell"
                            subtitle={startSound === 'none' ? 'None' : 'Bell Sound 1'}
                            onClick={onOpenStartBellModal}
                        />
                        <SettingsItem
                            icon={<Bell size={20} />}
                            colorClass="icon-orange"
                            title="Interval Bell"
                            subtitle={intervalSound === 'none' ? 'None' : 'Bell Sound 2'}
                            onClick={onOpenIntervalBellModal}
                        />
                        <SettingsItem
                            icon={<Music size={20} />}
                            colorClass="icon-pink"
                            title="Background Audios"
                            subtitle={selectedAudio ? `Current: ${selectedAudio.name}` : "Select background sounds"}
                            onClick={() => navigate('/audio')}
                        />
                    </div>
                </div>

                {/* DISPLAY SETTINGS SECTION */}
                <div className="section-group">
                    <h3 className="settings-section-title">Display Settings</h3>
                    <div className="settings-card">
                        <SettingsItem
                            icon={<Zap size={20} />}
                            colorClass="icon-blue"
                            title="Disable Quotes"
                            subtitle="Hide motivational quotes in timer"
                            rightElement={<Toggle checked={disableQuotes} onChange={setDisableQuotes} />}
                        />
                        <SettingsItem
                            icon={isDark ? <Moon size={20} /> : <Sun size={20} />}
                            colorClass="icon-blue"
                            title="Themes"
                            subtitle={`Current: ${isDark ? 'Dark Mode' : 'Light Mode'}`}
                            onClick={onOpenThemeModal}
                        />
                        <SettingsItem
                            icon={<Clock size={20} />}
                            colorClass="icon-orange"
                            title="Clock Layout"
                            subtitle={`Current: ${clockLayout === 'analog' ? 'Analog' : 'Digital'}`}
                            onClick={onOpenClockModal}
                        />
                    </div>
                </div>

                {/* MY AI SECTION */}
                <div className="section-group">
                    <h3 className="settings-section-title">My AI</h3>
                    <div className="settings-card">
                        <SettingsItem
                            icon={<Bot size={20} />}
                            colorClass="icon-purple"
                            title="Gemini AI Configuration"
                            subtitle={apiKey ? "Key Connected" : "Connect API Key"}
                            rightElement={
                                apiKey ? (
                                    <span style={{ fontSize: '12px', color: '#4ade80', fontWeight: 'bold' }}>Active</span>
                                ) : <ChevronRight size={20} />
                            }
                            onClick={onOpenAIModal}
                        />
                    </div>
                </div>

                {/* SUPPORT SECTION */}
                <div className="section-group">
                    <h3 className="settings-section-title">Support & Legal</h3>
                    <div className="settings-card">
                        <SettingsItem
                            icon={<Share2 size={20} />}
                            colorClass="icon-cyan"
                            title="Share"
                            subtitle="Link to share this app"
                            onClick={handleShare}
                        />
                        <SettingsItem
                            icon={<Mail size={20} />}
                            colorClass="icon-orange"
                            title="Contact Us"
                            subtitle="Provide us some feedback"
                            onClick={() => navigate('/contact')}
                        />
                        <SettingsItem
                            icon={<FileText size={20} />}
                            colorClass="icon-pink"
                            title="Privacy Policy"
                            subtitle="Review our privacy policy"
                            onClick={() => navigate('/privacy')}
                        />
                        <SettingsItem
                            icon={<FileText size={20} />}
                            colorClass="icon-green"
                            title="Terms and Conditions"
                            subtitle="Review our terms"
                            onClick={() => navigate('/terms')}
                        />
                    </div>
                </div>

            </div>
        </div>
    );
};

export default SettingsScreen;
