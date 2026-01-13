import React from 'react';

const IntervalSelector = ({
    customIntervals,
    selectedInterval,
    onSelect,
    onOpenModal // For managing custom intervals
}) => {

    const getLabel = (val) => {
        if (val === '0') return 'None';
        if (val === 'half') return 'Halfway';
        if (val === '1') return 'Every Minute';
        if (val === '5') return 'Every 5 Minutes';
        return `Every ${val} Min`;
    };

    return (
        <div className="settings-row" onClick={onOpenModal}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="currentColor" style={{ opacity: 0.9 }}>
                    <path d="M0 0h24v24H0V0z" fill="none" />
                    <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z" />
                </svg>
                <span style={{ fontSize: '16px', fontWeight: '500', color: 'var(--text-primary)' }}>
                    {getLabel(selectedInterval)}
                </span>
            </div>
            <span style={{ color: 'var(--text-secondary)' }}>Change</span>
        </div>
    );
};

export default IntervalSelector;
