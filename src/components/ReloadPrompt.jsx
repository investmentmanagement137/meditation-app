import React from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { RefreshCcw, X } from 'lucide-react';

const ReloadPrompt = () => {
    const {
        offlineReady: [offlineReady, setOfflineReady],
        needRefresh: [needRefresh, setNeedRefresh],
        updateServiceWorker,
    } = useRegisterSW({
        onRegistered(r) {
            console.log('SW Registered: ' + r)
        },
        onRegisterError(error) {
            console.log('SW registration error', error)
        },
    });

    const close = () => {
        setOfflineReady(false);
        setNeedRefresh(false);
    };

    if (!offlineReady && !needRefresh) return null;

    return (
        <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 w-[90%] max-w-sm bg-gray-900 border border-gray-700 text-white p-4 rounded-xl shadow-2xl flex flex-col gap-3 z-[100] animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="text-sm font-medium text-gray-200">
                {offlineReady
                    ? 'App is ready to work offline.'
                    : 'New content available. Update now?'}
            </div>
            <div className="flex gap-3 justify-end">
                {needRefresh && (
                    <button
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-semibold transition-colors"
                        onClick={() => updateServiceWorker(true)}
                    >
                        <RefreshCcw size={16} />
                        Update
                    </button>
                )}
                <button
                    className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-lg text-sm font-medium transition-colors"
                    onClick={close}
                >
                    <X size={16} />
                    Dismiss
                </button>
            </div>
        </div>
    );
};

export default ReloadPrompt;
