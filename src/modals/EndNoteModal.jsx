import React, { useState } from 'react';
import BaseModal from '../components/BaseModal';

const EndNoteModal = ({ isOpen, onClose, onSave, initialNote }) => {
    const [note, setNote] = useState(initialNote || '');

    const handleSave = () => {
        onSave(note);
    };

    return (
        <BaseModal isOpen={isOpen} onClose={onClose} title="Session Complete">
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <p style={{ marginBottom: '16px', lineHeight: '1.5' }}>Great job! How are you feeling now?</p>
                <textarea className="notes-input" style={{ flex: 1, minHeight: '120px', marginBottom: '16px' }} placeholder="Journal your thoughts..." value={note} onChange={(e) => setNote(e.target.value)}></textarea>
                <div style={{ marginTop: 'auto' }}>
                    <button className="btn-primary" onClick={handleSave}>Save & Continue</button>
                </div>
            </div>
        </BaseModal>
    );
};
export default EndNoteModal;
