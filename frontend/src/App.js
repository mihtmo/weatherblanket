import { useEffect, useState } from "react";
import { HeatKey, PrecipKey } from "./components/Key";
import WeatherBlanket from "./components/Weatherblanket";
import axios from "axios"
import "./App.css"
import InfoButton from "./components/InfoButton";
import CustomToggle from "./components/CustomToggle";
import YearSlider from "./components/YearSlider";
import getDayOfTheYear from "./helpers/dayOfTheYear";
import { PageParamsContextProvider } from "./contexts/PageParamsContext";
import LightOrDarkIcon from "./components/LightOrDarkIcon";
import isMobileBrowser from "./helpers/isMobileBrowser.js";
import RotateIcon from "./components/RotateIcon";
import "react-datepicker/dist/react-datepicker.css";
import Sidebar from "./components/Sidebar.js"

const App = () => {
    const currentYear = new Date().getUTCFullYear();
    const [blanketData, setBlanketData] = useState(null);
    const [isDarkTheme, setIsDarkTheme] = useState(
        window.matchMedia("(prefers-color-scheme: dark)").matches
    );
    const [isLoading, setIsLoading] = useState(true);
    const [isLandscapeMode, setIsLandscapeMode] = useState(
        !window.matchMedia("(orientation: portrait)").matches
    );
    const [mobileUser, setMobileUser] = useState(isMobileBrowser());
    const [toolbarParams, setToolbarParams] = useState({
        'multiYear': true,
        'dataType': 'heat',
        'selectedStation': '72254413958',
        'selectedYears': [currentYear - 2, currentYear - 1, currentYear]
    })

    // Change theme (todo: this could be smarter)
    function handleThemeChange() {
        setIsDarkTheme(!isDarkTheme)
    }

    const getAllWeatherData = async () => {

        setIsLoading(true);

        const localData = JSON.parse(localStorage.getItem(toolbarParams['selectedStation']));
        if (localData) {
            console.log('found data in storage')
            setBlanketData(localData)
            setIsLoading(false);
        } else {
            const todaysDate = new Date().toJSON().slice(0, 10);
            const response = await axios.get(
                `https://www.ncei.noaa.gov/access/services/data/v1?dataset=global-summary-of-the-day&stations=${toolbarParams['selectedStation']}&startDate=${'2000-01-01'}&endDate=${todaysDate}&dataTypes=MAX,MIN,PRCP&format=json`
            )
            let dataArray = await response.data
            let allYearsData = {}
            for (let i = 2000; i <= currentYear; i++) {
                allYearsData[i] = {}
                allYearsData[i]['days'] = Array(366).fill(null);
            }
            for (let day in dataArray) {
                const date = dataArray[day]['DATE']
                let dayNumber = getDayOfTheYear(`${date}T00:00`);
                // console.warn('dayNumber:', dayNumber, 'day:', dataArray[day]['DATE'])
                allYearsData[date.slice(0, 4)]['days'][dayNumber-1] = dataArray[day]
            }
            localStorage.setItem(toolbarParams['selectedStation'], JSON.stringify(allYearsData));
            setBlanketData(allYearsData)
            setIsLoading(false);
        }
    }

    // On first load, get this years data from API
    useEffect(() => {
        getAllWeatherData()
    }, [toolbarParams['selectedStation']])

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

    return (
        <div 
            id='weather-page-wrapper' 
            className='theme-wrapper' 
            data-theme={isDarkTheme?'dark':'light'}
            >
            { (mobileUser && !isLandscapeMode) && (
                <div id='portrait-overlay'> 
                    <div id='overlay-text-wrapper'>
                        <div> this app was designed for landscape mode </div>
                        <RotateIcon/>
                        <div> please rotate your device </div>
                    </div>
                </div>
            )}
            {/* <button onClick={getWeatherData}></button> */}
            <PageParamsContextProvider value={[isLoading, toolbarParams, setToolbarParams]}>
                <div id='display-and-header-wrapper'>
                    <div id='weatherblanket-header'>
                        <div id='weatherblanket-title' className='title'> 
                            <h1> Weatherblanket </h1>
                        </div>
                        <LightOrDarkIcon
                            isDarkTheme={isDarkTheme}
                            clickHandler={handleThemeChange}/>
                    </div>
                    <div id='charts-and-menu-wrapper' className='canvases'>
                        <WeatherBlanket blanketData={blanketData}/>
                        <Sidebar/>
                    </div>
                    <div className='description-wrapper'>
                        <p> 
                            Weatherblanket was created as a way to depict local
                            weather data in a visually striking and easily
                            digestible way.
                        </p>
                        <p> 
                            If you haven't heard of them, I recommend giving 
                            "weatherblanket" a google—they're gorgeous. 
                            Weatherblankets are created by recording the high 
                            temperature of the day, assigning a color to it, 
                            and knitting/crocheting a row of that color onto a 
                            blanket to create a visual map of temperature 
                            throughout the year.
                        </p>
                        <p>
                            I found this concept delightful when I first saw it, 
                            and I wanted to give myself access to this kind of 
                            visualization for my own city (Austin), especially
                            considering the weather events we had been having. 
                            As I currently have no knitting skills, my thoughts 
                            turned to a digital visualization.
                        </p>
                        <p>
                            True to the original concept, each bar in the
                            visualization (from left to right) corresponds to
                            a day of the year. The color at the top of each bar
                            corresponds to the high temperature of the day, while
                            the bottom corresponds to the low. If the 'single-year'
                            option is selected on the visualization (see toolbar
                            on the right of the tool), there will also be 'drips'
                            at the bottom of the blanket. Each drip shows the
                            precipitation for that day. In 'multi-year' mode,
                            you can stack multiple years to examine their
                            differences. In this mode, you can switch between
                            a blanket depicting heat and a blanket depicting
                            precipitation.
                        </p>
                        <p>
                            I'll leave the explanations there—do some exploring!
                        </p>
                        <p>
                            This is the second version of this tool! &nbsp;
                            <a href='https://www.mitchwebb.me/weatherblanket'>Check out the
                            first version here.</a> This version is very much still
                            in development. I've recently switched over to a canvas-based
                            approach after finding SVGs a little too sluggish. 
                            Reach out on my <a href='https://www.mitchwebb.me/contact'>
                            contact page</a> if you find any issues!
                        </p>
                        <p>
                            Thanks for taking a peek! (July 2024)
                        </p>
                    </div>
                </div>
            </PageParamsContextProvider>
        </div>
    )
}

export default App