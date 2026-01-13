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
            <div className="settings-row-label">Interval Bells</div>
            <div className="settings-row-value">
                <span id="selected-interval-name">{getLabel(selectedInterval)}</span>
                <span>›</span>
            </div>
        </div>
    );
};

export default IntervalSelector;
