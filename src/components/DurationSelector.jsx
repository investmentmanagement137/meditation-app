import React from 'react';

const DurationSelector = ({ durations, selectedDuration, onSelect, onAddClick }) => {
    return (
        <div className="duration-scroller">
            {/* Sorted durations + Selected logic handled by parent or here? 
                Usually parent passes sorted list. But original app sorted somewhat.
                We'll assume 'durations' is the array of numbers [5, 10, 20...].
            */}
            {durations.map((d) => (
                <div
                    key={d}
                    className={`duration-option ${selectedDuration === d ? 'selected' : ''}`}
                    onClick={() => onSelect(d)}
                >
                    {d}
                </div>
            ))}

            {/* Add Custom Button */}
            <div className="duration-option" onClick={onAddClick}>
                +
            </div>
        </div>
    );
};

export default DurationSelector;
