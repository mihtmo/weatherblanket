import './Weatherblanket.css';
import { WeatherBars } from "./WeatherBars";


const WeatherBlanket = ({ blanketData }) => {

    console.log(blanketData)
    return (
        <div id='weatherblanket-wrapper'>
            <div id='key-wrapper'></div>
            <WeatherBars blanketData={blanketData}/>
        </div>
    )
}

export default WeatherBlanket