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
                <span style={{ fontSize: '20px' }}>🔔</span>
                <span style={{ fontSize: '16px', fontWeight: '500', color: 'var(--text-primary)' }}>
                    {getLabel(selectedInterval)}
                </span>
            </div>
            <span style={{ color: 'var(--text-secondary)' }}>Change</span>
        </div>
    );
};

export default IntervalSelector;
