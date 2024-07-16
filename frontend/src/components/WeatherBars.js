import "./WeatherBars.css"
import React, { useContext } from "react";
import { heatColorScale, rainScale } from "../helpers/colorScale";
import BarLoader from "./loader";
import PageStateContext from "../contexts/PageStateContext";

export const WeatherBars = ({ blanketData, selectedYears }) => {
    const reversedYears = [...selectedYears.slice().reverse()]
    const [isLoading, multiYear, dataType] = useContext(PageStateContext);
    console.log(dataType)
    return (
        <div id='weather-bars'>
            {isLoading ? 
                <BarLoader/>
                :
                reversedYears.map((year) => {
                    return (
                        <div key={`year-${year}-wrapper`} className={`year-data-wrapper ${multiYear ? 'multi-year' : 'single-year'}`}>
                            <div className='weather-year'>
                                {(dataType == 'heat' || dataType == 'both') &&
                                    <HeatYearSVG year={year} yearData={blanketData[year]} big={!multiYear}/>}
                                {(dataType == 'rain' || dataType == 'both') &&
                                    <RainYearSVG year={year} yearData={blanketData[year]} big={!multiYear}/>}
                            </div>
                            <div key={`weather-year-${year}-label`} className='weather-year-label'>
                                {year}
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}


const HeatYearSVG = ( {yearData, year, big} ) => {

    return (
        <svg 
            className='heat-year-svg'
            viewBox={`0 0 366 50` }
            // shapeRendering="crispEdges"
            preserveAspectRatio="none">
                {yearData.days.map((day, i) => (
                    (day ? (
                        <React.Fragment key={`heat-year-${year}-day${i}`}>
                            <defs>
                                <linearGradient
                                    id={`heat-gradient-year${year}-day${i}`}
                                    gradientTransform="rotate(90)">
                                    <stop offset="0%" stopOpacity='100%' stopColor={heatColorScale(day['MAX'])}/>    
                                    <stop offset="100%" stopOpacity='100%' stopColor={heatColorScale(day['MIN'])}/>   
                                </linearGradient>
                            </defs>
                            <rect
                                width={1}
                                height={50}
                                x={i}
                                y={0}
                                fill={`url(#heat-gradient-year${year}-day${i})`}>
                            </rect>
                        </React.Fragment>
                    ) : (
                        <rect
                            width={1}
                            height={50}
                            x={i}
                            y={0}
                            fill={big ? 'none' : `var(--container-shadow)`}>
                        </rect>)
                    ))
                )}


        </svg>
    )
}

const RainYearSVG = ( {yearData, year, big} ) => {
    const [isLoading, multiYear, dataType] = useContext(PageStateContext);

    return (
        <svg 
            className={`rain-year-svg ${multiYear ? 'multi-year' : ''}`}
            viewBox={`0 0 366 50`}
            // shapeRendering="crispEdges"
            preserveAspectRatio="none">
                {yearData.days.map((day, i) => {
                    const rainCoef = day ? rainScale(day['PRCP'], 5) : 0;
                    return (
                        (day ? (
                            <React.Fragment key={`rain-year-${year}-day${i}`}>
                                <defs>
                                    <linearGradient
                                        id={`rain-gradient-year${year}-day${i}`}
                                        gradientTransform="rotate(90)">
                                        <stop offset="0%" stopOpacity='100%' stopColor={heatColorScale(day['MIN'])}/>    
                                        <stop offset="80%" stopOpacity='100%' stopColor={'#2c48b8'}/>   
                                    </linearGradient>
                                </defs>
                                { (big && (day['PRCP'] != 0)) ? (
                                    <path
                                        d={`
                                            M${i},0
                                            h 1
                                            v${rainCoef * 50}
                                            a .5 .5 0 0 1 -.5 .5
                                            a .5 .5 0 0 1 -.5 -.5
                                            z
                                        `}
                                        fill={`url(#rain-gradient-year${year}-day${i})`}
                                    />
                                ) : (
                                    <rect
                                        width={1}
                                        height={50}
                                        x={i}
                                        y={0}
                                        fill={`rgba(0,191,255, ${rainCoef}`}>
                                    </rect>
                                )}
                            </React.Fragment>
                        ) : (
                            <rect
                                width={1}
                                height={50}
                                x={i}
                                y={0}
                                fill={`none`}>
                            </rect>)
                        ))
                })}
        </svg>
    )
}