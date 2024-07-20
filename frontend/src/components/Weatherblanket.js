import './Weatherblanket.css';
import { WeatherBars } from "./WeatherBars";
import { XAxis } from './Axes.js'
import { useContext, useEffect, useRef, useState } from 'react';
import * as d3 from "d3-scale";
import PageParamsContext from '../contexts/PageParamsContext';


const WeatherBlanket = ({ blanketData }) => {
    const [mouseCoords, setMouseCoords] = useState([0, 0]);
    const [tooltipData, setTooltipData] = useState({});

    // function storeMousePosition(e) {
    //     const dayData = e.target.dataset.dayData
    //     if (dayData) {
    //         setMouseCoords([e.clientX, e.clientY]);
    //         const data = JSON.parse(e.target.dataset.dayData)
    //         setTooltipData(data);
    //     } else {
    //         // console.log('hide me')
    //     }
    // }

    return (
        <div id='weatherblanket-wrapper'>
            {/* <div id='key-wrapper'></div> */}
            <WeatherBars blanketData={blanketData}/>
            {/* <BlanketTooltip mouseCoords={mouseCoords} data={tooltipData}/> */}
        </div>
    )
}

// const BlanketTooltip = ({ mouseCoords, data }) => {

//     return (
//         <div id='blanket-tooltip' style={{'left': mouseCoords[0], 'top': mouseCoords[1]}}>
//             {data?.['DATE']}
//         </div>
//     )
// }

export default WeatherBlanket

