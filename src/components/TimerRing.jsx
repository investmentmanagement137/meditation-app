import React, { useMemo } from 'react';

const FULL_DASH_ARRAY = 880; // 2 * PI * 140

const TimerRing = ({ totalSeconds, remainingSeconds }) => {

    const strokeDashoffset = useMemo(() => {
        if (totalSeconds === 0) return 0;
        const progress = remainingSeconds / totalSeconds;
        return FULL_DASH_ARRAY * (1 - progress);
    }, [remainingSeconds, totalSeconds]);

    return (
        <svg className="timer-ring" viewBox="0 0 320 320">
            <circle cx="160" cy="160" r="140" className="circle-bg" />
            <circle
                cx="160"
                cy="160"
                r="140"
                className="circle-progress"
                style={{ strokeDashoffset }}
                transform="rotate(-90 160 160)" // Rotate to start at top
            />
        </svg>
    );
};

export default TimerRing;
