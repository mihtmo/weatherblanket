import './Weatherblanket.css';
import { WeatherBars } from "./WeatherBars";
import { useContext, useEffect, useRef, useState } from 'react';
import PageParamsContext from '../contexts/PageParamsContext';


const WeatherBlanket = ({ blanketData }) => {
    const [isLoading, toolbarParams, setToolbarParams] = useContext(PageParamsContext);
    const [mouseCoords, setMouseCoords] = useState([0, 0]);
    const [tooltipData, setTooltipData] = useState(null);
    const [chartDims, setChartDims] = useState({});

    function storeMousePosition(e) {
        setMouseCoords([e.clientX, e.clientY]);
        const reversedYears = [...toolbarParams.selectedYears.slice().reverse()];
        const canvasRect = e.target.getBoundingClientRect();
        const yearCount = toolbarParams.selectedYears.length
        const barWidth = chartDims.width / 366;
        const barHeight = chartDims.height / yearCount;
        const dayIndex = Math.floor((e.clientX - canvasRect.left) / barWidth);
        const yearIndex = Math.floor((e.clientY - canvasRect.top) / barHeight);
        const dayData = blanketData?.[reversedYears[yearIndex]]?.days?.[dayIndex];
        setTooltipData(dayData);
    }

    function clearMouseCoords() {
        setMouseCoords(null);
    }

    return (
        <div id='weatherblanket-wrapper'>
            {/* <div id='key-wrapper'></div> */}
            <WeatherBars 
                setChartDims={setChartDims} 
                chartDims={chartDims} 
                handleMousePosition={storeMousePosition}
                clearMouseCoords={clearMouseCoords}
                blanketData={blanketData}/>
            {(mouseCoords && tooltipData) &&
                <BlanketTooltip mouseCoords={mouseCoords} data={tooltipData}/>
            }
        </div>
    )
}

const BlanketTooltip = ({ mouseCoords, data }) => {
    const tooltipRef = useRef();
    const [toolTipCoords, setTooltipCoords] = useState({
        'left': 0,
        'top': 0
    });

    const precipitation = (
        (data['PRCP'].trim() == '99.99') ? 
            '0.00' 
            :
            data['PRCP'].trim()
    );

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    

    useEffect(() => {
        if (tooltipRef.current) {
            const tooltipRect = tooltipRef.current.getBoundingClientRect();
            const halfHeight = tooltipRect.height / 2;
            const width = tooltipRect.width;
            const left = (mouseCoords[0] + width > screenWidth) ?
                mouseCoords[0] - width
                :
                mouseCoords[0]
            let top;
            if ((mouseCoords[1] + halfHeight) > screenHeight) {
                top = mouseCoords[1] - tooltipRect.height;
            } else if (mouseCoords[1] - halfHeight < 0) {
                top = mouseCoords[1];
            } else {
                top = mouseCoords[1] - halfHeight;
            }
                
            setTooltipCoords({
                'left': left,
                'top': top
            })
        }
    }, [mouseCoords])


    return (
        <div ref={tooltipRef} id='blanket-tooltip' style={{'left': toolTipCoords.left, 'top': toolTipCoords.top}}>
            <div className='tooltip-wrapper'>
                <h3> {data['DATE']} </h3>
                <ul>
                    <li>High Temp: {data['MAX'].trim()}&deg;F</li>
                    <li>Low Temp: {data['MIN'].trim()}&deg;F</li>
                    <li>Precipitation: {precipitation} inches</li>
                </ul>
            </div>
        </div>
    )
}

export default WeatherBlanket

