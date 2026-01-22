import React from 'react';
import { X } from 'lucide-react';

const BaseModal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3 className="modal-title">{title}</h3>
                    <button className="modal-close-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>
                <div className="modal-body">
                    {children}
                </div>
            </div>
            <style>{`
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.6);
                    backdrop-filter: blur(4px);
                    display: flex;
                    align-items: flex-end; /* Bottom sheet on mobile */
                    justify-content: center;
                    z-index: 1000;
                    animation: fadeIn 0.2s ease-out;
                }
                .modal-content {
                    /* Solid background for popups as requested */
                    background: #1e293b; 
                    width: 100%;
                    max-width: 400px;
                    border-radius: 20px 20px 0 0; /* Top rounded for bottom sheet */
                    padding: 24px;
                    padding-bottom: 40px;
                    box-shadow: 0 -4px 20px rgba(0,0,0,0.15);
                    animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                }
                
                /* Light Mode Override for Modal Content */
                :global(.light) .modal-content {
                     background: #ffffff !important;
                }

                /* Ensure dark mode stays solid */
                :global(.dark) .modal-content {
                     background: #1e293b !important;
                }
                }
                @media (min-width: 640px) {
                    .modal-overlay {
                        align-items: center;
                    }
                    .modal-content {
                        border-radius: 20px;
                        padding-bottom: 24px;
                        animation: scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
                    }
                }
                .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                }
                .modal-title {
                    font-size: 1.25rem;
                    font-weight: 700;
                    font-family: 'Outfit', sans-serif;
                    color: var(--text-primary);
                }
                .modal-close-btn {
                    background: transparent;
                    border: none;
                    color: var(--text-secondary);
                    padding: 8px;
                    border-radius: 50%;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: background 0.2s;
                }
                .modal-close-btn:hover {
                    background: rgba(0,0,0,0.05);
                }
                .dark .modal-close-btn:hover {
                    background: rgba(255,255,255,0.1);
                }

                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
                @keyframes scaleIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
            `}</style>
        </div>
    );
};

export default BaseModal;
