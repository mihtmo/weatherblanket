import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import './App.css';
import getDayOfTheYear from './helpers/dayOfTheYear';
import { PageParamsContextProvider } from './contexts/PageParamsContext';
import LightOrDarkIcon from './components/LightOrDarkIcon';
import isMobileBrowser from './helpers/isMobileBrowser.js';
import RotateIcon from './components/RotateIcon';
import 'react-datepicker/dist/react-datepicker.css';
import { XAxis } from './components/Axes';
import ChartAndAxes from './components/ChartAndAxes.js';

const App = () => {
    const renderCount = useRef(0);
    renderCount.current += 1;
    console.log('Render #', renderCount.current, {
        isLoading,
        toolbarParams,
        blanketData: !!blanketData,
    });
    console.log('App rendering');
    const currentYear = new Date().getUTCFullYear();
    const [blanketData, setBlanketData] = useState(null);
    const [isDarkTheme, setIsDarkTheme] = useState(
        window.matchMedia('(prefers-color-scheme: dark)').matches,
    );
    const [isLoading, setIsLoading] = useState(true);
    const [isLandscapeMode, setIsLandscapeMode] = useState(
        !window.matchMedia('(orientation: portrait)').matches,
    );
    const [mobileUser, setMobileUser] = useState(isMobileBrowser());
    const [toolbarParams, setToolbarParams] = useState({
        multiYear: true,
        dataType: 'heat',
        selectedStation: 'GHCND:USW00013958',
        selectedYears: [currentYear - 2, currentYear - 1, currentYear],
    });

    // Change theme (todo: this could be smarter)
    function handleThemeChange() {
        setIsDarkTheme(!isDarkTheme);
    }

    // Watch for orientation change, set state respectively
    useEffect(() => {
        function handleOrientationChange(e) {
            const landscape = e.matches;
            setIsLandscapeMode(landscape);
        }
        window
            .matchMedia('(orientation: landscape)')
            .addEventListener('change', handleOrientationChange);
        // Cleanup event listener
        return window
            .matchMedia('(orientation: landscape)')
            .removeEventListener('change', handleOrientationChange);
    }, []);

    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const getWeatherData = async (signal) => {
        setIsLoading(true);
        let allYearsData = {};

        for (let year of toolbarParams.selectedYears) {
            if (signal.aborted) return;

            const cacheKey = `${toolbarParams.selectedStation}-${year}`;
            const cached = JSON.parse(localStorage.getItem(cacheKey));

            if (cached && year !== currentYear) {
                allYearsData[year] = cached;
                continue;
            }

            allYearsData[year] = { days: Array(366).fill(null) };

            const startdate = `${year}-01-01`;
            const enddate =
                year === currentYear
                    ? new Date().toJSON().slice(0, 10)
                    : `${year}-12-31`;

            // Have to make separate calls because of the 1000 result limit
            // Each data param is a result, so we lose December
            const urls = [
                `/api/noaa?datasetid=GHCND&stationid=${toolbarParams.selectedStation}&startdate=${startdate}&enddate=${enddate}&datatypeid=TMAX,TMIN&limit=1000&units=standard`,
                `/api/noaa?datasetid=GHCND&stationid=${toolbarParams.selectedStation}&startdate=${startdate}&enddate=${enddate}&datatypeid=PRCP&limit=1000&units=standard`,
            ];

            for (const url of urls) {
                let success = false;
                while (!success && !signal.aborted) {
                    try {
                        const response = await axios.get(url, { signal });
                        const results = response.data?.results ?? [];
                        for (let record of results) {
                            const date = record.date.slice(0, 10);
                            const recordYear = date.slice(0, 4);
                            const dayNumber = getDayOfTheYear(`${date}T00:00`);
                            if (!allYearsData[recordYear].days[dayNumber - 1]) {
                                allYearsData[recordYear].days[dayNumber - 1] = {
                                    date,
                                };
                            }
                            allYearsData[recordYear].days[dayNumber - 1][
                                record.datatype
                            ] = record.value;
                        }
                        success = true;
                    } catch (err) {
                        if (axios.isCancel(err)) return;
                        console.error(
                            `Error fetching ${year}, retrying...`,
                            err.message,
                        );
                        await delay(2000);
                    }
                }
                await delay(300);
            }

            if (year !== currentYear) {
                localStorage.setItem(
                    `${toolbarParams.selectedStation}-${year}`,
                    JSON.stringify(allYearsData[year]),
                );
            }
        }

        setBlanketData(allYearsData);
        setIsLoading(false);
    };

    // On first load, get recent data from API
    useEffect(() => {
        const controller = new AbortController();
        getWeatherData(controller.signal);
        return () => controller.abort();
    }, [toolbarParams.selectedStation, toolbarParams.selectedYears]);

    // Set overall body-element background-color based on CSS variable
    // This is done to prevent different background on scroll
    useEffect(() => {
        const backgroundColor = window
            .getComputedStyle(document.querySelector('.theme-wrapper'))
            .getPropertyValue('--container-back');
        document.body.style.backgroundColor = backgroundColor;
    }, [isDarkTheme]);

    return (
        <div
            id="weather-page-wrapper"
            className="theme-wrapper"
            data-theme={isDarkTheme ? 'dark' : 'light'}
        >
            {mobileUser && !isLandscapeMode && (
                <div id="portrait-overlay">
                    <div id="overlay-text-wrapper">
                        <div> this app was designed for landscape mode </div>
                        <RotateIcon />
                        <div> please rotate your device </div>
                    </div>
                </div>
            )}
            <PageParamsContextProvider
                value={[isLoading, toolbarParams, setToolbarParams]}
            >
                <div id="display-and-header-wrapper">
                    <div id="weatherblanket-header">
                        <div id="weatherblanket-title" className="title">
                            <h1> Weatherblanket </h1>
                        </div>
                        <LightOrDarkIcon
                            isDarkTheme={isDarkTheme}
                            clickHandler={handleThemeChange}
                        />
                    </div>
                    <ChartAndAxes blanketData={blanketData} />
                    <div className="description-wrapper">
                        <p>
                            Weatherblanket was created as a way to depict local
                            weather data in a visually striking and easily
                            digestible way.
                        </p>
                        <p>
                            If you haven't heard of them, I recommend giving
                            "weatherblanket" a google—they're gorgeous.
                            Weatherblankets are created by recording the high
                            temperature of the day, assigning a color to it, and
                            knitting/crocheting a row of that color onto a
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
                            visualization (from left to right) corresponds to a
                            day of the year. The color at the top of each bar
                            corresponds to the high temperature of the day,
                            while the bottom corresponds to the low. If the
                            'single-year' option is selected on the
                            visualization (see toolbar on the right of the
                            tool), there will also be 'drips' at the bottom of
                            the blanket. Each drip shows the precipitation for
                            that day. In 'multi-year' mode, you can stack
                            multiple years to examine their differences. In this
                            mode, you can switch between a blanket depicting
                            heat and a blanket depicting precipitation.
                        </p>
                        <p>
                            I'll leave the explanations there—do some exploring!
                        </p>
                        <p>
                            Also, this app was designed for desktop. Mobile
                            viewing works, but is not optimal. Sorry about that,
                            maybe in the future! Reach out on my{' '}
                            <a href="https://www.mitchwebb.me/contact">
                                contact page
                            </a>{' '}
                            if you find any issues!
                        </p>
                        <p>Thanks for taking a peek! (July 2024)</p>
                    </div>
                </div>
            </PageParamsContextProvider>
        </div>
    );
};

export default App;
