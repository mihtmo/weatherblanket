import { useEffect, useState } from "react";
import { HeatKey, PrecipKey } from "./components/Key";
import WeatherBlanket from "./components/Weatherblanket";
import axios from "axios"
import "./App.css"
import InfoButton from "./components/InfoButton";
import CustomToggle from "./components/CustomToggle";
import YearSlider from "./components/YearSlider";

const App = () => {
    const currentYear = new Date().getFullYear();
    const [blanketData, setBlanketData] = useState(null);
    const [selectedYears, setSelectedYears] = useState([currentYear]);
    const [isDarkTheme, setIsDarkTheme] = useState(
        window.matchMedia("(prefers-color-scheme: dark)").matches
    );
    const [multiYear, setMultiYear] = useState(false);
    const [dataType, setDataType] = useState('both');

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

    // useEffect(() => {
    //     console.warn(selectedYears);
    //     if (selectedYears) {
    //         for (let i = selectedYears[0]; i <= selectedYears[selectedYears.length - 1]; i++) {
    //             if (!blanketData || (!blanketData[i])) {
    //                 getWeatherData(i)
    //                 console.log(`retrieving data for ${i}`)
    //             } else if (i in blanketData) {
    //                 return
    //             }
    //         }
    //     }
    // }, [selectedYears])

    const getAllWeatherData = async () => {
        const localData = JSON.parse(localStorage.getItem('weatherData'));
        if (localData) {
            console.log('look what I found', localData)
            setBlanketData(localData)
        } else {
            const allYears = Array.from({ length: currentYear - 1999 }, (_, index) => index + 2000);
            let allYearsData = {};
            for (let i = allYears[allYears.length - 1]; i >= allYears[0]; i--) {
                console.warn(i)
                let endDate = ''
                if (i == currentYear) {
                    endDate = new Date().toJSON().slice(0, 10);
                } else {
                    endDate = `${i}-12-31`
                }
                let startDate = `${i}-01-01`
                const response = await axios.get(
                    `https://www.ncei.noaa.gov/access/services/data/v1?dataset=global-summary-of-the-day&stations=72254413958&startDate=${startDate}&endDate=${endDate}&dataTypes=MAX,MIN,PRCP&format=json`
                )
                let dataArray = await response.data
                if (dataArray.length !== 366) {
                    dataArray.push(...Array(366 - dataArray.length).fill(null));
                    console.log("not a full year of data, adding blanks to end")
                }
                allYearsData[i] = {'days': dataArray}
            }
            console.log(JSON.stringify(allYearsData))
            localStorage.setItem('weatherData', JSON.stringify(allYearsData));
            setBlanketData(allYearsData)
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
            let selectedYearsList = [];
            for (let i = value[0]; i < value[1]; i++) {
                selectedYearsList.push(parseInt(i))
            }
            selectedYearsList.push(parseInt(value[1]))
            setSelectedYears(selectedYearsList)
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
        <div className='theme-wrapper' data-theme={isDarkTheme?'dark':'light'}>
            <InfoButton id='weatherblanket-info-button' title={'Weatherblanket'} body={infoBodyText} />
            {/* <button onClick={getWeatherData}></button> */}
            <div id='toolbar'>
                <CustomToggle 
                    id='multi-year-toggle' 
                    leftText='single-year' 
                    rightText='multi-year'
                    handler={handleMultiYearToggle}/>
                {/* <select onChange={handleYearChange}>
                    {years.map((year) => {
                        return ( <option value={year}> {year} </option>)
                    })}
                </select> */}
                { multiYear ? 
                    <YearSlider
                        key={2}
                        id={'multi-year-slider'}
                        multiYear={true} 
                        start={ [2010, 2024]}
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
                { multiYear &&
                    <CustomToggle
                        id='data-type-toggle'
                        leftText='heat'
                        rightText='rain'
                        handler={handleTypeSelect}/>
                }
            </div>
            <div id='weather-page-wrapper'>
                <div id='key-wrapper'>
                    <HeatKey/>
                    { (multiYear && dataType == 'rain') &&
                        <PrecipKey/>
                    }
                </div>
                { (blanketData && selectedYears) && <WeatherBlanket blanketData={blanketData} selectedYears={selectedYears} /> }
            </div>
        </div>
    )
}

export default App