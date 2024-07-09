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