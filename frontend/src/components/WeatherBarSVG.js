import React from "react";
import { heatColorScale } from "../helpers/colorScale";

const WeatherYearSVG = ( {yearData, year} ) => {
    // const rainCoef = (data && maxRain) ? rainScale(data['PRCP'], maxRain) : null;
    
    return (
        <svg 
            viewBox="0 0 366 50" 
            shapeRendering="crispEdges"
            preserveAspectRatio="none"
            height='100%'
            width='100%'>
            {yearData.days.map((day, i) => (
            <React.Fragment key={`year-${year}-day${i}`}>
                <defs>
                    <linearGradient
                        id={`gradient-year${year}-day${i}`}
                        gradientTransform="rotate(90)">
                        <stop offset="0%" stopOpacity='100%' stopColor={day ? heatColorScale(day['MAX']) : '000000'}/>    
                        <stop offset="100%" stopOpacity='100%' stopColor={day ? heatColorScale(day['MIN']) : '000000'}/>   
                    </linearGradient>
                </defs>
                <rect
                    width={1}
                    height={50}
                    x={i}
                    y={0}
                    fill={`url(#gradient-year${year}-day${i})`}>
                </rect>
            </React.Fragment>
            ))}
        </svg>
    )
}

export default WeatherYearSVG