import "./WeatherBars.css"
import React, { useContext, useEffect, useRef, useState } from "react";
import { heatColorScale, rainScale } from "../helpers/colorScale";
import BarLoader from "./Loader.js";
import PageParamsContext from "../contexts/PageParamsContext";
import * as d3 from 'd3-scale';
import { XAxis } from "./Axes";
import { Tooltip } from 'react-tooltip'
import 'react-tooltip/dist/react-tooltip.css'

export const WeatherBars = ({ blanketData, handleMousePosition, setChartDims, chartDims, clearMouseCoords }) => {
    const [isLoading, toolbarParams, setToolbarParams] = useContext(PageParamsContext);
    const reversedYears = [...toolbarParams.selectedYears.slice().reverse()];
    const chartRef = useRef();
    const canvasRef = useRef();
    const yearCount = toolbarParams.selectedYears.length;

    function handleMouseMove(e) {
        handleMousePosition(e);
    }

    const paintCanvas = () => {
        const canvas = canvasRef.current;
        const canvasCtx = canvas.getContext('2d', {willReadFrequently: true}, {alpha: false});
        canvas.height = chartDims.height;
        canvas.width = chartDims.width;
        canvasCtx.clearRect(0, 0, chartDims.width, chartDims.height);
        canvasCtx.beginPath();

        const barWidth = chartDims.width / 366;
        let heatbarHeight = chartDims.height / yearCount;

        // If showing single-year view, preserve space for rainbars
        if (!toolbarParams.multiYear) {
            heatbarHeight = heatbarHeight * .7;
        }

        // For years in yearCount
        for (let i = 0; i < yearCount; i++) {
            // Because of floor, bars will be slighty different widths
            // This is necessary to have clean edges
            const y = Math.floor(i * heatbarHeight);
            canvasCtx.clearRect(0, y, chartDims.width, heatbarHeight)
            // For days in year (including leap year)
            for (let j = 0; j < 366; j++) {
                if (blanketData?.[reversedYears[i]]?.['days']?.[j]) {
                    canvasCtx.beginPath();
                    const x = Math.floor(j * barWidth);
                    const yearData = blanketData?.[reversedYears[i]]?.['days']
                    if (toolbarParams.dataType == 'heat' || !toolbarParams.multiYear) {
                        const highTempColor = heatColorScale(yearData?.[j]?.['MAX']);
                        const lowTempColor = heatColorScale(yearData?.[j]?.['MIN']);
                        const grad = canvasCtx.createLinearGradient(x, y, x + barWidth, y + heatbarHeight);
                        grad.addColorStop(0, highTempColor);
                        grad.addColorStop(1, lowTempColor);
                        canvasCtx.fillStyle = grad;
                    } else if (toolbarParams.dataType == 'rain') {
                        canvasCtx.fillStyle = `rgba(0,191,255, ${rainScale(yearData[j]['PRCP'], 5)}`
                    }
                    canvasCtx.rect(x, y, Math.ceil(barWidth), Math.ceil(heatbarHeight));
                    canvasCtx.fill();
                    // If showing single year, paint rain drips below
                    if (!toolbarParams.multiYear) {
                        const rainAmount = yearData[j]['PRCP']
                        const rainStart = Math.ceil(y + heatbarHeight);
                        const rainHeight = Math.ceil(rainScale(rainAmount, 5) * chartDims.height * .3)
                        canvasCtx.beginPath();
                        const grad = canvasCtx.createLinearGradient(x, rainStart, x + barWidth, rainStart + rainHeight);
                        grad.addColorStop(0, heatColorScale(yearData?.[j]?.['MIN']));
                        grad.addColorStop(1, '#2c48b8');
                        canvasCtx.fillStyle = grad;
                        canvasCtx.rect(x, rainStart, Math.ceil(barWidth), rainHeight);
                        canvasCtx.fill();
                    }
                }

            }
        }
    };

    useEffect(() => {
        if (chartRef.current) {
            const resizeObserver = new ResizeObserver(() => {
                const chart = chartRef.current;
                if (chart) {
                    const chartRect = chart.getBoundingClientRect();
                    setChartDims({
                        'width': chartRect.width,
                        'height': chartRect.height
                    })
                }
            }); 
            resizeObserver.observe(chartRef.current);
            return () => resizeObserver.disconnect();
        }
    }, [isLoading]);

    useEffect(() => {
        if (canvasRef.current) {
            paintCanvas();
        }
    }, [chartDims, toolbarParams, blanketData])

    const xDomain = [0, 12];
    const xRange = [0, chartDims.width];
    const xValues = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11 ];
    const xScale = d3.scaleLinear().domain(xDomain).range(xRange);
    const valueMap = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

    return (
        <div id='weather-bars' className='shadowed-inset'>
            {isLoading ? 
                <BarLoader/>
                :
                <div className='chart-and-axes-wrapper'>
                    {(chartDims.width && !isLoading) && (
                        <XAxis
                            values={xValues}
                            domain={xDomain}
                            range={xRange}
                            scale={xScale}
                            valueMap={valueMap}/>
                    )}
                    <div className='years-labels'>
                        {reversedYears.map((year) => {
                            return(
                                <div 
                                    key={`year-${year}-label`} 
                                    className='year-label'
                                    style={{'height': chartDims.height / yearCount}}>
                                    {year}
                                </div>
                            )
                        })}
                    </div>
                    <div className='chart-wrapper' ref={chartRef}>
                        { chartRef.current &&
                            <canvas onMouseLeave={clearMouseCoords} onMouseMove={handleMouseMove} id='weather-canvas' ref={canvasRef}></canvas>
                        }
                    </div>
                </div>

            }
        </div>
    )
}