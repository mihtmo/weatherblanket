import { useEffect, useState } from "react";
import { HeatKey, PrecipKey } from "./components/Key";
import WeatherBlanket from "./components/Weatherblanket";
import axios from "axios"
import "./App.css"
import InfoButton from "./components/InfoButton";
import CustomToggle from "./components/CustomToggle";

const App = () => {
    const [blanketData, setBlanketData] = useState(null);
    const [selectedYears, setSelectedYears] = useState(null);
    const [isDarkTheme, setIsDarkTheme] = useState(
        window.matchMedia("(prefers-color-scheme: dark)").matches
    );
    const [multiYear, setMultiYear] = useState(false);
    const [dataType, setDataType] = useState('both');

    const years = (Array.from({length: 25}, (x, i) => i + 2000));

    function handleYearChange(e) {
        setSelectedYears(e.target.value)
    }

    function handleMultiYearToggle(e) {
        if (e.target.checked) {
            setMultiYear(true);
            setDataType('heat');
        } else {
            setMultiYear(false);
            setDataType('both');
        }
    }

    function handleTypeSelect(e) {
        setDataType(e.target.value)
    }

    // On first load, get this years data from API
    useEffect(() => {
        axios({
            method: 'POST',
            url: 'http://localhost:5000/get-weather-data', 
            data: { year: selectedYears },
            headers: {
                Accept: 'application/json',
                "Content-Type": "application/json;charset=UTF-8",
            },
        })
        .then(({data}) => {
            setBlanketData({
                'days': data.days,
                'maxRain': data.maxRain
            })
        })
    }, [selectedYears])

    // Change theme (todo: this could be smarter)
    function handleThemeChange() {
        setIsDarkTheme(!isDarkTheme)
    }

    // Set overall body-element background-color based on CSS variable
    // This is done to prevent different background on scroll
    useEffect(() => {
        const backgroundColor = window.getComputedStyle(document.querySelector('.theme-wrapper')).getPropertyValue('--container-back');
        document.body.style.backgroundColor = backgroundColor;
    }, [isDarkTheme])

    const infoBodyText = (
        <div>
            <p>
                This is an artistic representation of temperatures and precipitation 
                levels in Austin, TX for the past 365 days. The color of the bars 
                correspond to the maximum daily temperature (at the top) and the 
                minimum daily temperature (at the bottom). The drips below the bars 
                indicate precipitation levels for that day. The data for this graphic 
                is coming directly from the NCEI API for Camp Mabry.
            </p>
            <p>
                Try hovering over the main graphic or the key on the left for more 
                information!
            </p>
            <p>
                This visual is best viewed on desktop or in landscape-mode.
            </p>
        </div>
    )

    return (
        <div className='theme-wrapper' data-theme={isDarkTheme?'dark':'light'}>
            <InfoButton id='weatherblanket-info-button' title={'Weatherblanket'} body={infoBodyText} />
            <CustomToggle 
                id='multi-year-toggle' 
                leftText='single-year' 
                rightText='multi-year'
                handler={handleMultiYearToggle}/>
            <select onChange={handleYearChange}>
                {years.map((year) => {
                    return ( <option value={year}> {year} </option>)
                })}
            </select>
            { multiYear &&
                <CustomToggle
                    id='data-type-toggle'
                    leftText='heat'
                    rightText='rain'
                    handler={handleTypeSelect}/>
            }
            <div id='weather-page-wrapper'>
                <div id='key-wrapper'>
                    <HeatKey/>
                    <PrecipKey/>
                </div>
                { blanketData && <WeatherBlanket blanketData={blanketData} /> }
            </div>
        </div>
    )
}

export default App