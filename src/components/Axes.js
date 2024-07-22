import { useMemo } from "react";

const XAxis = ({ scale, domain, range, values, label, valueMap }) => {
  
    
    const width = range[1] - range[0];

    const ticks = useMemo(() => {
        const pixelsPerTick = 30;
        const ticksTarget = Math.min(Math.max(1, Math.floor(width / pixelsPerTick)), 12);
        return scale.ticks(ticksTarget).map(value => ({
            value: value, 
            xOffset: scale(value)
        }))
    }, [domain.join('-'), range.join('-')]);

    return (
        <svg className='xAxis'>
        <path
            d={[
                "M", range[0], 20,
                "v", 9,
                "H", range[1],
                "v", -9,
            ].join(" ")}
            fill="none"
            stroke='var(--border)'
        />
        {ticks.map(({ value, xOffset }, i) => (
            <g
            key={value}
            transform={`translate(${xOffset}, 0)`}
            >
            <line
                y1="20"
                y2="30"
                stroke='var(--border)'
            />
            <text
                key={value}
                fill='var(--border)'
                style={{
                    fontSize: "10px",
                    textAnchor: "middle",
                    transform: "translateY(10px)"
                }}
            >
                {valueMap ? (
                    valueMap[value]
                ) : (
                    value
                )}
            </text>
            </g>
        ))}
        <g transform={`translate(${width/2}, 35)`}>
            <text 
                fill='var(--border)' 
                style={{
                    textAnchor: 'middle',
                    fontSize: '12px'
                    }}
            >  
            {label}
            </text>
        </g>
        </svg>
    )
}

const YAxis = ({ scale, domain, range, label }) => {

    const axisWidth = 40;

    const ticks = useMemo(() => {
        const height = range[1] - range[0];
        const pixelsPerTick = 20;
        const ticksTarget = Math.max(1, Math.floor(height / pixelsPerTick));
        return scale.ticks(ticksTarget).map(value => ({
            value: value, 
            yOffset: scale(value)
        }));
    }, [domain.join('-'), range.join('-')]);

    return (
        <svg className='yAxis'>
            <path
            d={[
                'M', axisWidth - 6, range[0],
                'H', axisWidth,
                'v', range[1],
                'H', axisWidth - 6,
            ].join(' ')}
            fill='none'
            stroke='var(--border)'
            />
            {ticks.map(({ value, yOffset }) => (
            <g
                key={value}
                transform={`translate(0, ${yOffset})`}
            >
                <line
                x1={`${axisWidth - 6}`}
                x2={`${axisWidth}`}
                stroke='var(--border)'
                />
                <text
                key={value}
                fill='var(--border)'
                style={{
                    fontSize: "10px",
                    textAnchor: "middle",
                    transform: "translate(20px, .4em)"
                }}>
                { value }
                </text>
            </g>
            ))}
        <g transform={`translate(10, ${range[1]/2}) rotate(-90)`}>
            <text
                fill='var(--border)' 
                style={{
                    textAnchor: 'middle',
                    fontSize: '12px'
                    }}
            >
                {label}
            </text>
        </g>
        </svg>
    )
}

export {XAxis, YAxis};