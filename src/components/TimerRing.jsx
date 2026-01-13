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
        // Each half is 50 units long.
        // We want to show 'progress * 50' length of stroke.
        // Dashoffset hides the specific amount.
        // To show X%, we need offset = Length * (1 - X).
        return 50 * (1 - progress);
    }, [remainingSeconds, totalSeconds]);

    // Dimensions: 300x400 (x=20, y=20), Radius 32.
    // Center Top: 170, 20.
    // Right Path: Line to (288, 20), Arc to (320, 52), Line to (320, 388), Arc to (288, 420), Line to (170, 420).
    const rightPath = "M 170 20 L 288 20 A 32 32 0 0 1 320 52 L 320 388 A 32 32 0 0 1 288 420 L 170 420";

    // Left Path: Line to (52, 20), Arc to (20, 52), Line to (20, 388), Arc to (52, 420), Line to (170, 420).
    const leftPath = "M 170 20 L 52 20 A 32 32 0 0 0 20 52 L 20 388 A 32 32 0 0 0 52 420 L 170 420";

    return (
        <svg className="timer-ring" viewBox="0 0 340 440" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
            <defs>
                <filter id="glow-shadow" x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor="rgba(255, 255, 255, 0.3)" />
                </filter>
            </defs>

            {/* Background Paths (Full) */}
            <g style={{ filter: 'url(#glow-shadow)' }}>
                <path d={rightPath} className="circle-bg" />
                <path d={leftPath} className="circle-bg" />
            </g>

            {/* Progress Paths (Symmetrical) */}
            <path
                d={rightPath}
                className="circle-progress"
                pathLength="50"
                style={{ strokeDasharray: 50, strokeDashoffset }}
            />
            <path
                d={leftPath}
                className="circle-progress"
                pathLength="50"
                style={{ strokeDasharray: 50, strokeDashoffset }}
            />
        </svg>
    );
};

export default TimerRing;
