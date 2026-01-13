import React, { useMemo } from 'react';

const FULL_DASH_ARRAY = 1424; // Approximation for rect width 300, height 400, rx 32: 2*(300+400) - 8*32 + 2*PI*32 ≈ 1400. Let's precise: 2*(268+368) + 2*3.1416*32 = 1272 + 201 = 1473. Rough path length for 300x400 rect with 32radius.
// Let's use getTotalLength equivalent:
// Rect size: 300x400. Radius 32.
// Perimeter = 2 * (300 - 64) + 2 * (400 - 64) + 2 * PI * 32
// = 2 * 236 + 2 * 336 + 201.06
// = 472 + 672 + 201.06 = 1345.06
// Let's just use pathLength="100" on the rect to normalize it!

const TimerRing = ({ totalSeconds, remainingSeconds }) => {

    const strokeDashoffset = useMemo(() => {
        if (totalSeconds === 0) return 0;
        const progress = remainingSeconds / totalSeconds;
        return 100 * (1 - progress); // Using pathLength=100
    }, [remainingSeconds, totalSeconds]);

    return (
        <svg className="timer-ring" viewBox="0 0 340 440" style={{ width: '100%', height: '100%' }}>
            <rect
                x="20"
                y="20"
                width="300"
                height="400"
                rx="32"
                className="circle-bg" // Keeping class name for existing stroke colors
            />
            <rect
                x="20"
                y="20"
                width="300"
                height="400"
                rx="32"
                className="circle-progress"
                pathLength="100"
                style={{ strokeDasharray: 100, strokeDashoffset }}
            // Remove transform rotate, rect starts top-left usually. To start top-center we need DashOffset adjustment or path.
            // For a simple rect, it starts top-left.
            // To make it look like a timer, it's better to use a path starting at top center M 170 20 L...
            />
        </svg>
    );
};

export default TimerRing;
