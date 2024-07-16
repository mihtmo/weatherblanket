import { useEffect, useState } from "react";
import { HeatKey, PrecipKey } from "./components/Key";
import WeatherBlanket from "./components/Weatherblanket";
import axios from "axios"
import "./App.css"
import InfoButton from "./components/InfoButton";
import CustomToggle from "./components/CustomToggle";
import YearSlider from "./components/YearSlider";
import getDayOfTheYear from "./helpers/dayOfTheYear";
import { PageStateContextProvider } from "./contexts/PageStateContext";

const App = () => {
    const currentYear = new Date().getFullYear();
    const [blanketData, setBlanketData] = useState(null);
    const [selectedYears, setSelectedYears] = useState([currentYear - 2, currentYear - 1, currentYear]);
    const [isDarkTheme, setIsDarkTheme] = useState(
        window.matchMedia("(prefers-color-scheme: dark)").matches
    );
    const [multiYear, setMultiYear] = useState(true);
    const [dataType, setDataType] = useState('heat');
    const [isLoading, setIsLoading] = useState(true);

    function unfoldYears(years) {
        let selectedYearsList = [];
        for (let i = years[0]; i <= years[1]; i++) {
            selectedYearsList.push(parseInt(i))
        }
        return selectedYearsList;
    }

    function handleMultiYearToggle(e) {
        if (e.target.checked) {
            setMultiYear(true);
            setSelectedYears(unfoldYears([selectedYears[0], currentYear]))
            setDataType('heat');
        } else {
            setMultiYear(false);
            setSelectedYears([selectedYears[0]])
            setDataType('both');
        }
    }

    function handleTypeSelect(e) {
        if (e.target.checked) {
            setDataType('rain');
        } else {
            setDataType('heat');
        }
    }

    const getAllWeatherData = async () => {

        setIsLoading(true);

        const localData = JSON.parse(localStorage.getItem('weatherData'));
        if (localData) {
            console.log('look what I found', localData)
            setBlanketData(localData)
            setIsLoading(false);
        } else {
            const todaysDate = new Date().toJSON().slice(0, 10);
            const response = await axios.get(
                `https://www.ncei.noaa.gov/access/services/data/v1?dataset=global-summary-of-the-day&stations=72254413958&startDate=${'2000-01-01'}&endDate=${todaysDate}&dataTypes=MAX,MIN,PRCP&format=json`
            )
            let dataArray = await response.data
            let allYearsData = {}
            for (let i = 2000; i <= currentYear; i++) {
                allYearsData[i] = {}
                allYearsData[i]['days'] = Array(366).fill(null);
            }
            console.warn(allYearsData, "ACL")
            for (let day in dataArray) {
                console.log(dataArray[day])
                const date = dataArray[day]['DATE']
                let dayNumber = getDayOfTheYear(`${date}T00:00`);
                console.log(dayNumber)
                console.warn('dayNumber:', dayNumber, 'day:', dataArray[day]['DATE'])
                allYearsData[date.slice(0, 4)]['days'][dayNumber-1] = dataArray[day]
            }
            console.log(JSON.stringify(allYearsData))
            localStorage.setItem('weatherData', JSON.stringify(allYearsData));
            setBlanketData(allYearsData)
            setIsLoading(false);
        }

    }

    // const getWeatherData = async ( years ) => {
        
        
    //     let endDate = ''
    //     if (year == currentYear) {
    //         endDate = new Date().toJSON().slice(0, 10);
    //     } else {
    //         endDate = `${year}-12-31`
    //     }
    //     let startDate = `${year}-01-01`

    //     const response = await axios.get(
    //         `https://www.ncei.noaa.gov/access/services/data/v1?dataset=global-summary-of-the-day&stations=72254413958&startDate=${'2000-01-01'}&endDate=${'2024-12-31'}&dataTypes=MAX,MIN,PRCP&format=json`
    //     ).catch(function (err) {
    //         if (err) {
    //             console.log(err);
    //         }
    //     })

    //     let dataArray = response.data
    //     console.log(dataArray)
    //     if (dataArray.length !== 366) {
    //         console.warn(dataArray.length)
    //         dataArray.push(...Array(366 - dataArray.length).fill(null));
    //         console.log("not a full year of data, adding blanks to end")
    //     }
    //     setBlanketData({
    //         ...blanketData,
    //         [year]: {
    //             'days': dataArray,
    //             'maxRain': 2
    //         }
    //     })
    // }

    // On first load, get this years data from API
    useEffect(() => {
        // getWeatherData(['2000', currentYear])

        // axios({
        //     method: 'POST',
        //     url: 'http://localhost:5000/get-weather-data', 
        //     data: { years: selectedYears },
        //     headers: {
        //         Accept: 'application/json',
        //         "Content-Type": "application/json;charset=UTF-8",
        //     },
        // })
        // .then(({data}) => {
        //     setBlanketData({
        //         'days': data.days,
        //         'maxRain': data.maxRain
        //     })
        // })
        getAllWeatherData()
    }, [])

    // Change theme (todo: this could be smarter)
    function handleThemeChange() {
        setIsDarkTheme(!isDarkTheme)
    }

    function handleSliderChange(value) {
        // If selecting single year, set both years to same
        if (value.length === 1) {
            setSelectedYears([parseInt(value)])
        // Else return range of two
        } else {
            setSelectedYears(unfoldYears([value[0], value[1]]))
        }
    }

    console.log(selectedYears)

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
        <div 
            id='weather-page-wrapper' 
            className='theme-wrapper' 
            data-theme={isDarkTheme?'dark':'light'}
            >
            {/* <button onClick={getWeatherData}></button> */}
            <PageStateContextProvider value={[isLoading, multiYear, dataType]}>
                <div id='display-and-header-wrapper'>
                    <div id='weatherblanket-header'>
                        <div id='weatherblanket-title' className='title'> Weatherblanket </div>
                        <InfoButton id='weatherblanket-info-button' title={'Weatherblanket'} body={infoBodyText} />
                    </div>
                    <WeatherBlanket blanketData={blanketData} selectedYears={selectedYears}/>
                </div>
            </PageStateContextProvider>
            <div id='toolbar'>
                <CustomToggle
                    id='multi-year-toggle' 
                    leftText='single-year' 
                    rightText='multi-year'
                    handler={handleMultiYearToggle}
                    defaultOn={true}/>
                { multiYear &&
                    <CustomToggle
                        id='data-type-toggle'
                        leftText='heat'
                        rightText='rain'
                        handler={handleTypeSelect}/>
                }
                { multiYear ? 
                    <YearSlider
                        key={2}
                        id={'multi-year-slider'}
                        multiYear={true} 
                        start={ [currentYear - 2, currentYear]}
                        currentYear={currentYear}
                        handler={handleSliderChange}/>
                    :
                    <YearSlider
                        key={1}
                        id={'single-year-slider'}
                        currentYear={currentYear}
                        start={[ currentYear ]}
                        handler={handleSliderChange}/>
                }
            </div>
        </div>
    )
}

export default App