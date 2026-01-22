import React from 'react';
import BaseModal from '../components/BaseModal';
import { Check, Sun, Moon } from 'lucide-react';

const ThemeModal = ({ isOpen, onClose, isDark, toggleTheme }) => {

    // Manual Toggle logic isn't sufficient for a list selection if we want "Select Light" or "Select Dark".
    // We can infer current state from `isDark`.

    const setMode = (mode) => {
        if ((mode === 'dark' && !isDark) || (mode === 'light' && isDark)) {
            toggleTheme();
        }
        onClose();
    };

    return (
        <BaseModal isOpen={isOpen} onClose={onClose} title="Select Theme">
            <div className="selection-list">
                <div
                    className={`selection-item ${!isDark ? 'selected' : ''}`}
                    onClick={() => setMode('light')}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Sun size={20} />
                        <span>Light Mode</span>
                    </div>
                    {!isDark && <Check size={18} color="var(--primary)" />}
                </div>
                <div
                    className={`selection-item ${isDark ? 'selected' : ''}`}
                    onClick={() => setMode('dark')}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Moon size={20} />
                        <span>Dark Mode</span>
                    </div>
                    {isDark && <Check size={18} color="var(--primary)" />}
                </div>
            </div>
            <style>{`
                .selection-list {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                .selection-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 16px;
                    border-radius: 12px;
                    background: var(--background);
                    border: 1px solid var(--border-color);
                    cursor: pointer;
                    font-weight: 500;
                    color: var(--text-primary);
                    transition: all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1);
                }
                .selection-item:hover {
                    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
                    transform: translateY(-2px);
                }
                .selection-item.selected {
                    background: var(--surface);
                    border-color: var(--primary);
                    color: var(--primary);
                    box-shadow: 0 0 0 1px var(--primary);
                }
            `}</style>
        </BaseModal>
    );
};

export default ThemeModal;
