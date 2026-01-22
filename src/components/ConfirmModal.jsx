import React from 'react';
import ReactDOM from 'react-dom';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Delete', cancelText = 'Cancel' }) => {
    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            zIndex: 9999, // High z-index to ensure visibility
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }} onClick={(e) => { e.stopPropagation(); onClose(); }}>
            <div style={{
                background: 'var(--surface)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                padding: '24px',
                borderRadius: '16px',
                width: '300px',
                textAlign: 'center',
                boxShadow: '0 4px 20px rgba(0,0,0,0.6)',
                border: 'var(--border-line)',
                color: 'var(--text-primary)'
            }} onClick={(e) => e.stopPropagation()}>
                <h3 style={{ marginTop: 0, marginBottom: '12px' }}>{title}</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>{message}</p>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                    <button onClick={onClose} style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid var(--text-secondary)', background: 'transparent', color: 'var(--text-primary)', cursor: 'pointer' }}>
                        {cancelText}
                    </button>
                    <button className="btn-primary" onClick={onConfirm} style={{ padding: '10px 20px', background: '#FF5252' }}>
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default ConfirmModal;
