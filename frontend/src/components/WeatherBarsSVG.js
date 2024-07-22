import "./WeatherBars.css"
import React, { useContext, useEffect, useRef, useState } from "react";
import { heatColorScale, rainScale } from "../helpers/colorScale";
import BarLoader from "./loader";
import PageParamsContext from "../contexts/PageParamsContext";
import * as d3 from 'd3-scale';
import { XAxis } from "./Axes";
import { Tooltip } from 'react-tooltip'
import 'react-tooltip/dist/react-tooltip.css'

export const WeatherBars = ({ blanketData }) => {
    const [isLoading, toolbarParams, setToolbarParams] = useContext(PageParamsContext);
    const reversedYears = [...toolbarParams.selectedYears.slice().reverse()];
    const [chartDims, setChartDims] = useState({});
    const chartRef = useRef();

    const xDomain = [0, 12];
    const xRange = [0 + 60, chartDims.width + 60];
    const xValues = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11 ];
    const xScale = d3.scaleLinear().domain(xDomain).range(xRange);
    const valueMap = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

    useEffect(() => {
        if (chartRef.current) {
            const resizeObserver = new ResizeObserver(() => {
                const chart = chartRef.current;
                const chartWidth = chart ? chart.getBoundingClientRect().width : null;
                setChartDims({
                    'width': chartWidth - 60,
                })
            }); 
            resizeObserver.observe(chartRef.current);
            return () => resizeObserver.disconnect();
        }
    }, [isLoading]);

    return (
        <div id='weather-bars' className='shadowed-inset' ref={chartRef}>
            {(chartDims.width && !isLoading) && (
                <XAxis
                    values={xValues}
                    domain={xDomain}
                    range={xRange}
                    scale={xScale}
                    valueMap={valueMap}/>
            )}
            {isLoading ? 
                <BarLoader/>
                :
                reversedYears.map((year) => {
                    return (
                        <div 
                            key={`year-${year}-wrapper`} 
                            className={`
                                year-data-wrapper 
                                ${toolbarParams.multiYear ? 
                                    'multi-year' : 'single-year'}`
                            }
                        >
                            <div key={`weather-year-${year}-label`} className='weather-year-label'>
                                {year}
                            </div>
                            <div className='weather-year'>
                                {(toolbarParams.dataType == 'heat' || 
                                  toolbarParams.dataType == 'both') &&
                                    <HeatYearSVG 
                                        year={year} 
                                        yearData={blanketData[year]} 
                                        big={!toolbarParams.multiYear}
                                    />}
                                {(toolbarParams.dataType == 'rain' || 
                                  toolbarParams.dataType == 'both') &&
                                    <RainYearSVG 
                                        year={year} 
                                        yearData={blanketData[year]} 
                                        big={!toolbarParams.multiYear}
                                    />}
                            </div>
                            {/* {blanketData[year].days.map((day, i) => (
                                day && <Tooltip 
                                    key={day['DATE']}
                                    id={`tooltip-year${year}-day${i}`}
                                    className='weather-tooltip'/>
                            ))} */}
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
            viewBox={`0 0 366 50`}
            // shapeRendering="crispEdges"
            preserveAspectRatio="none">
                {yearData.days.map((day, i) => {
                    if (day) {
                        // const tooltipHtml = (`
                        // <div class='tooltip-wrapper'>
                        //     <h3> ${day['DATE']} </h3>
                        //     <ul>
                        //         <li>High Temp: ${day['MAX'].trim()}&deg;F</li>
                        //         <li>Low Temp: ${day['MIN'].trim()}&deg;F</li>
                        //         <li>Precipitation: ${day['PRCP'].trim()} inches</li>
                        //     </ul>
                        // </div>
                        // `)
                        return (
                            <React.Fragment 
                                key={`heat-year-${year}-day${i}`}>
                                <defs>
                                    <linearGradient
                                        id={`heat-gradient-year${year}-day${i}`}
                                        gradientTransform="rotate(90)">
                                        <stop offset="0%" stopOpacity='100%' stopColor={heatColorScale(day['MAX'])}/>    
                                        <stop offset="100%" stopOpacity='100%' stopColor={heatColorScale(day['MIN'])}/>   
                                    </linearGradient>
                                </defs>
                                <rect
                                    data-day-data={JSON.stringify(day)}
                                    // data-tooltip-id={`tooltip-year${year}-day${i}`}
                                    // data-tooltip-html={tooltipHtml}
                                    data-html={true}
                                    width={1}
                                    height={50}
                                    x={i}
                                    y={0}
                                    fill={`url(#heat-gradient-year${year}-day${i})`}>
                                </rect>
                            </React.Fragment>
                        )
                    } else {
                        <rect
                            key={`heat-year-${year}-day${i}`}
                            width={1}
                            height={50}
                            x={i}
                            y={0}
                            fill={big ? 'none' : `var(--container-dark)`}>
                        </rect>
                    }
                })}
        </svg>
    )
}

const RainYearSVG = ({ yearData, year, big }) => {
    const [isLoading, toolbarParams] = useContext(PageParamsContext);

    return (
        <svg 
            className={`rain-year-svg ${toolbarParams.multiYear ? 'multi-year' : ''}`}
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

// String format tooltip for use with react-tooltip

const WeatherToolTip = ({ dayData }) => {
    return (`
        <div className='tooltip-wrapper'>
            <h3> ${dayData['day']} </h3>
            <ul>
                High Temp: ${dayData['MAX'].trim()}&#8457; 
            </ul>
            <ul>
                Low Temp: ${dayData['MIN'].trim()}&#8457; 
            </ul>
            <ul>
                Precipitation: ${dayData['PRCP'].trim()}inches
            </ul>
        </div>
    `)
}