import { heatColorScale, rainScale } from "../helpers/colorScale"
import "./WeatherBars.css"

export const WeatherBars = ({ blanketData }) => {
    console.log(blanketData.days)
    return (
        <div id='weather-bars'>
            { blanketData.days.map((data, i) => {
                return (<DayBar data={data} dayNum={i + 1} maxRain={blanketData.maxRain}/>)
            }) }
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