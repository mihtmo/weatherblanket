import { heatColorScale, rainScale } from "../helpers/colorScale"
import "./WeatherBars.css"
import WeatherYearSVG from "./WeatherBarSVG"

export const WeatherBars = ({ blanketData, selectedYears }) => {
    const weatherBarYears = []
    console.log(selectedYears)
    return (
        <div id='weather-bars'>
            {selectedYears.map((year) => {
                return (
                    <div key={`year-${year}-wrapper`} className='year-data-svg'>
                        <WeatherYearSVG year={year} yearData={blanketData[year]}/>
                    </div>
                )
            })}

        </div>
    )
}

const DayBar = ( {data, dayNum, maxRain}) => {

    const highColor = data ? heatColorScale(data['MAX']) : 'none';
    const lowColor = data ? heatColorScale(data['MIN']) : 'none';
    const rainCoef = (data && maxRain) ? rainScale(data['PRCP'], maxRain) : null;

    return (
        <div 
            key={dayNum}
            id={`day${dayNum}`} 
            className='day-bar' 
            data-index={dayNum}
        >
            <div 
                id={`temp-bar${dayNum}`} 
                className='blanket-column heat-column'
                style={{
                    'backgroundImage' : `linear-gradient(${highColor}, ${lowColor})`
                }}/>
            <div
                id={`rain-bar${dayNum}`}
                className='blanket-column rain-column'
                style={ data ? {
                    'backgroundImage' : `linear-gradient(${lowColor} 60%, #2C48B8)`,
                    'flexBasis': `${rainCoef * 40}vh`,
                } : {}}/>
        </div>
    )
}