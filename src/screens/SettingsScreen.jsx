import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useLocalStorage from '../hooks/useLocalStorage';
import AudioSelector from '../components/AudioSelector';
import {
    Sparkles, Key, Bot, Settings, Volume2,
    VolumeX, Moon, Sun, Bell, Clock,
    Music, Share2, Mail, FileText, ChevronRight, Zap, Download, CheckCircle
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
    apiKey,
    isDark, // Received from App

    // PWA
    deferredPrompt,
    onInstallApp
}) => {
    const navigate = useNavigate();
    const [selectedAudio, setSelectedAudio] = useState(null);

    // --- Preferences State ---
    const [totalSilence, setTotalSilence] = useLocalStorage('pref_total_silence', false);
    const [disableQuotes, setDisableQuotes] = useLocalStorage('pref_minimal_design', false);
    const [hideJournaling, setHideJournaling] = useLocalStorage('pref_hide_journaling', false);

    // Local isDark state REMOVED to rely on prop for sync

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

    // Helper for Clock Label
    const getClockLabel = () => {
        if (clockLayout === 'circular') return 'Circular';
        return 'Digital';
    };

    // --- Scroll Restoration ---
    useEffect(() => {
        // Restore scroll on mount
        const scrollKey = 'settings_scroll_pos';
        const savedPos = sessionStorage.getItem(scrollKey);
        if (savedPos) {
            // slight delay to ensure layout is ready
            requestAnimationFrame(() => {
                window.scrollTo(0, parseInt(savedPos, 10));
            });
        }

        // Save scroll on unmount
        return () => {
            sessionStorage.setItem(scrollKey, window.scrollY);
        };
    }, []);

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

                {/* REMINDERS SECTION */}
                <div className="section-group">
                    <h3 className="settings-section-title">Daily</h3>
                    <div className="settings-card">
                        <SettingsItem
                            icon={<Bell size={20} />}
                            colorClass="icon-purple"
                            title="Daily Reminders"
                            subtitle="Set a time to meditate"
                            onClick={() => navigate('/reminder')}
                        />
                    </div>
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
                            icon={<FileText size={20} />}
                            colorClass="icon-green"
                            title="Hide Journaling"
                            subtitle="Hide Intention & End Notes"
                            rightElement={<Toggle checked={hideJournaling} onChange={setHideJournaling} />}
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
                            subtitle={`Current: ${getClockLabel()}`}
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
                        {/* PWA Install Button - Adaptive State */}
                        {(() => {
                            const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;

                            if (deferredPrompt) {
                                return (
                                    <SettingsItem
                                        icon={<Download size={20} />}
                                        colorClass="icon-purple"
                                        title="Install App"
                                        subtitle="Add to Home Screen"
                                        onClick={onInstallApp}
                                    />
                                );
                            } else if (isStandalone) {
                                return (
                                    <SettingsItem
                                        icon={<CheckCircle size={20} />}
                                        colorClass="icon-green"
                                        title="App Installed"
                                        subtitle="Running as PWA"
                                        rightElement={<span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Active</span>}
                                        onClick={() => { }}
                                    />
                                );
                            } else {
                                // Fallback for iOS or when prompt is unavailable - Instructions
                                return (
                                    <SettingsItem
                                        icon={<Download size={20} />}
                                        colorClass="icon-purple"
                                        title="Install App"
                                        subtitle="Use browser menu to install"
                                        onClick={() => alert("To install:\n1. Open Browser Menu (Share or 3-dots)\n2. Select 'Add to Home Screen'")}
                                    />
                                );
                            }
                        })()}
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
