import React, { useMemo } from 'react';

const CircularCountdown = ({ totalSeconds, remainingSeconds, size = 300, strokeWidth = 24, children }) => {
    // Calculate progress (remaining / total)
    const radius = useMemo(() => (size - strokeWidth) / 2, [size, strokeWidth]);
    const circumference = useMemo(() => 2 * Math.PI * radius, [radius]);

    const strokeDashoffset = useMemo(() => {
        if (totalSeconds === 0) return 0;
        const progress = remainingSeconds / totalSeconds;
        return circumference * (1 - progress);
    }, [remainingSeconds, totalSeconds, circumference]);

    // Format time
    const m = Math.floor(remainingSeconds / 60).toString().padStart(2, '0');
    const s = (remainingSeconds % 60).toString().padStart(2, '0');

    return (
        <div className="circular-countdown" style={{ width: size, height: size, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg
                width={size}
                height={size}
                viewBox={`0 0 ${size} ${size}`}
                style={{ transform: 'rotate(-90deg)', overflow: 'visible' }}
            >
                <defs>
                    <linearGradient id="circle-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="var(--primary)" />
                        <stop offset="100%" stopColor="var(--accent, var(--primary))" />
                    </linearGradient>
                    <filter id="glow-shadow-circle">
                        <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="var(--primary)" floodOpacity="0.4" />
                    </filter>
                </defs>

                {/* Tracking/Background Ring */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="var(--surface-variant, rgba(0,0,0,0.1))"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                />

                {/* Progress Ring */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="url(#circle-gradient)"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    filter="url(#glow-shadow-circle)"
                    style={{ transition: 'stroke-dashoffset 1s linear' }}
                />
            </svg>

            {/* Center Content */}
            <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                {/* Digital Time */}
                <div style={{ fontSize: '3.5rem', fontWeight: '700', fontVariantNumeric: 'tabular-nums', lineHeight: 1, color: 'var(--text-primary)' }}>
                    {m}:{s}
                </div>

                {/* Optional Children (Audio Control) */}
                {children}
            </div>
        </div>
    );
};

export default CircularCountdown;
