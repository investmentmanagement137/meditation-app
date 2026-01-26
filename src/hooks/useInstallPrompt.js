import { useState, useEffect } from 'react';

export const useInstallPrompt = () => {
    const [promptEvent, setPromptEvent] = useState(null);
    const [isInstalled, setIsInstalled] = useState(false);
    const [isIOS, setIsIOS] = useState(false);

    useEffect(() => {
        const handleBeforeInstallPrompt = (e) => {
            e.preventDefault();
            setPromptEvent(e);
        };

        const handleAppInstalled = () => {
            setIsInstalled(true);
            setPromptEvent(null);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.addEventListener('appinstalled', handleAppInstalled);

        // Check if running as installed app
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setIsInstalled(true);
        }

        // Check iOS
        const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        if (isIOSDevice) {
            setIsIOS(true);
            // iOS doesn't support beforeinstallprompt, so we might need a different check
            // For now, simpler check
            const isStandalone = window.navigator.standalone === true || window.matchMedia('(display-mode: standalone)').matches;
            if (isStandalone) {
                setIsInstalled(true);
            }
        }

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.removeEventListener('appinstalled', handleAppInstalled);
        };
    }, []);

    const installApp = async () => {
        if (promptEvent) {
            await promptEvent.prompt();
            const { outcome } = await promptEvent.userChoice;
            if (outcome === 'accepted') {
                setIsInstalled(true);
            }
            setPromptEvent(null);
        }
    };

    return {
        promptEvent,
        canInstall: promptEvent !== null,
        isInstalled,
        isIOS,
        installApp
    };
};
