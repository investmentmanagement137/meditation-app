import React, { useMemo } from 'react';

const AnalyticsChart = ({ data, weeks = false }) => {
    // data format: [{label: 'Mon', value: 30}, ...]

    const maxValue = useMemo(() => {
        if (!data.length) return 60; // Default to 60m if no data
        const max = Math.max(...data.map(d => d.value));
        return max > 0 ? max : 60; // Use actual max, or 60 as fallback
    }, [data]);

    const points = useMemo(() => {
        if (!data.length) return '';

        const width = 100; // viewbox units
        const height = 50; // viewbox units
        const stepX = width / (data.length - 1);

        return data.map((d, i) => {
            const x = i * stepX;
            const y = height - (d.value / maxValue) * height; // Invert Y
            return `${x},${y}`;
        }).join(' ');
    }, [data, maxValue]);

    // Generate smooth bezier curve
    const pathD = useMemo(() => {
        if (!data.length) return '';
        const width = 100;
        const height = 50;
        const stepX = width / (data.length - 1);

        // Start point
        let d = `M 0,${height - (data[0].value / maxValue) * height}`;

        for (let i = 0; i < data.length - 1; i++) {
            const x0 = i * stepX;
            const y0 = height - (data[i].value / maxValue) * height;
            const x1 = (i + 1) * stepX;
            const y1 = height - (data[i + 1].value / maxValue) * height;

            // Control points for smooth curve
            const xc = (x0 + x1) / 2;
            d += ` C ${xc},${y0} ${xc},${y1} ${x1},${y1}`;
        }
        return d;
    }, [data, maxValue]);

    const fillPathD = `${pathD} V 50 H 0 Z`;

    // Dynamic Y Labels based on max value
    const yLabels = [maxValue, Math.round(maxValue * 0.66), Math.round(maxValue * 0.33), 0];

    return (
        <div className="chart-container">
            {/* Y-Axis Labels */}
            <div className="chart-y-axis">
                {yLabels.map((val, i) => (
                    <div key={i} className="chart-label">
                        {val >= 60 ? `${Math.floor(val / 60)}h${val % 60 > 0 ? val % 60 + 'm' : ''}` : `${val}m`}
                    </div>
                ))}
            </div>

            {/* Chart Area */}
            <div className="chart-area">
                {/* Horizontal Grid Lines */}
                <div className="chart-grid">
                    {yLabels.map((_, i) => (
                        <div key={i} className="grid-line"></div>
                    ))}
                </div>

                <svg viewBox="0 0 100 50" preserveAspectRatio="none" className="chart-svg">
                    <defs>
                        <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor="#818cf8" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#818cf8" stopOpacity="0.0" />
                        </linearGradient>
                    </defs>

                    {/* Fill */}
                    <path d={fillPathD} fill="url(#chartGradient)" />

                    {/* Line */}
                    <path d={pathD} fill="none" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" />

                    {/* Points */}
                    {data.map((d, i) => {
                        const width = 100;
                        const height = 50;
                        const stepX = width / (data.length - 1);
                        const x = i * stepX;
                        const y = height - (d.value / maxValue) * height;

                        // Highlight max point or active point logic could go here
                        return (
                            <circle key={i} cx={x} cy={y} r="1.5" fill="#fff" stroke="#6366f1" strokeWidth="1" />
                        );
                    })}
                </svg>

                {/* X-Axis Labels */}
                <div className="chart-x-axis">
                    {data.map((d, i) => (
                        <div key={i} className="chart-label x-label">
                            {d.label}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AnalyticsChart;
