import React from 'react';
import { Download, X, Share } from 'lucide-react';

const InstallPrompt = ({ canInstall, isInstalled, isIOS, installApp }) => {
    const [isVisible, setIsVisible] = React.useState(true);

    if (isInstalled || (!canInstall && !isIOS) || !isVisible) return null;

    return (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 animate-in slide-in-from-bottom-5 duration-500">
            <div className="bg-slate-800/90 backdrop-blur-lg border border-slate-700/50 p-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-1">Install App</h3>
                        <p className="text-slate-300 text-sm mb-4">
                            {isIOS
                                ? "Install this app on your home screen for the best experience."
                                : "Install our app for quick access and offline support."}
                        </p>

                        {isIOS ? (
                            <div className="text-sm text-slate-400 bg-slate-900/50 p-3 rounded-lg border border-slate-800">
                                <p className="flex items-center gap-2 mb-2">
                                    1. Tap the <Share size={16} /> Share button
                                </p>
                                <p className="flex items-center gap-2">
                                    2. Select "Add to Home Screen"
                                </p>
                            </div>
                        ) : (
                            <button
                                onClick={installApp}
                                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 group"
                            >
                                <Download size={18} className="group-hover:scale-110 transition-transform" />
                                Install Application
                            </button>
                        )}
                    </div>
                    <button
                        onClick={() => setIsVisible(false)}
                        className="text-slate-500 hover:text-white transition-colors p-1"
                    >
                        <X size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InstallPrompt;
