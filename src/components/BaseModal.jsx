import React from 'react';

// Reusable Modal Wrapper using the existing CSS classes
const BaseModal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="modal active" onClick={(e) => {
            // Close if clicked outside content
            if (e.target.className === 'modal active') onClose();
        }}>
            <div className="modal-content">
                <div className="modal-header">
                    <h2>{title}</h2>
                    <span className="modal-close" onClick={onClose}>&times;</span>
                </div>
                {children}
            </div>
        </div>
    );
};

export default BaseModal;
