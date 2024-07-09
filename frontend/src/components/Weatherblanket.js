import './Weatherblanket.css';
import { WeatherBars } from "./WeatherBars";
import WeatherYearSVG from './WeatherBarSVG';


const WeatherBlanket = ({ blanketData, selectedYears }) => {
    return (
        <div id='weatherblanket-wrapper'>
            <div id='key-wrapper'></div>
            <WeatherBars blanketData={blanketData} selectedYears={selectedYears}/>
        </div>
    )
}

export default WeatherBlanket