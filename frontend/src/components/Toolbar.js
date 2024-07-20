import { useContext, useEffect, useState } from "react";
import DatePicker from "react-datepicker"
import CustomToggle from "./CustomToggle";
import PageParamsContext from "../contexts/PageParamsContext";

const Toolbar = () => {
    const currentYear = new Date().getUTCFullYear();
    const [startYear, setStartYear] = useState(currentYear - 2);
    const [endYear, setEndYear] = useState(currentYear);
    const [isLoading, toolbarParams, setToolbarParams] = useContext(PageParamsContext);

    // function handleSliderChange(value) {
    //     // If selecting single year, set both years to same
    //     if (value.length === 1) {
    //         setToolbarParams({
    //             ...toolbarParams,
    //             'selectedYears': [parseInt(value)]
    //         })
    //     // Else return range of two
    //     } else {
    //         setToolbarParams({
    //             ...toolbarParams,
    //             'selectedYears': unfoldYears(value[0], value[1])
    //         })
    //     }
    // }

    function handleMultiYearToggle(e) {
        if (e.target.checked) {
            setToolbarParams({
                ...toolbarParams,
                'multiYear': true,
                'selectedYears': unfoldYears(startYear, endYear),
                'dataType': 'heat'
            })
        } else {
            setToolbarParams({
                ...toolbarParams,
                'multiYear': false,
                'selectedYears': [startYear],
                'dataType': 'both'
            })
        }
    }

    function handleTypeSelect(e) {
        if (e.target.checked) {
            setToolbarParams({
                ...toolbarParams,
                'dataType': 'rain',
            })
        } else {
            setToolbarParams({
                ...toolbarParams,
                'dataType': 'heat',
            })
        }
    }

    function handleStationSelect(e) {
        setToolbarParams({
            ...toolbarParams,
            'selectedStation': e.target.value,
        })
    }

    function handleStartDateChange(year) {
        setStartYear(year.getUTCFullYear());
    }

    function handleEndDateChange(year) {
        setEndYear(year.getUTCFullYear());
    }

    function unfoldYears(startYear, endYear) {
        let selectedYearsList = [];
        for (let i = startYear; i <= endYear; i++) {
            selectedYearsList.push(parseInt(i))
        }
        return selectedYearsList;
    }

    // Whenever start/end years change, update selected years
    useEffect(() => {
        setToolbarParams({
            ...toolbarParams,
            'selectedYears': toolbarParams.multiYear ? 
                unfoldYears(startYear, endYear)
                :
                [startYear]
        })
    }, [startYear, endYear])

    return (
        <div id='toolbar'>
            <div className='tools-group'>
                <div className='tools-title'>Location:</div>
                <div id='station-select-wrapper'>
                    <select id='station-select' onChange={handleStationSelect}>
                        <option value='72254413958'>Austin (Camp Mabry)</option>
                        <option value='72259003927'>Dallas (DFW Airport)</option>
                        <option value='72253012921'>San Antonio (SAT Airport)</option>
                        <option value='72243012960'>Houston (IAH Airport)</option>
                        <option value='72270023044'>El Paso (ELP Airport)</option>
                    </select>
                </div>
            </div>
            <div className='tools-group'>
                <div className='tools-title'>Year Range:</div>
                <div className='year-picker-wrapper tools-content'>
                    { toolbarParams.multiYear ?
                        <>
                        <div id='start-year-picker' className='year-picker'>
                            <DatePicker
                                showIcon
                                openToDate={new Date(String(startYear + 1)).toISOString()}
                                selected={new Date(String(startYear + 1)).toISOString()}
                                minDate={new Date('2001').toISOString()}
                                maxDate={new Date(String(endYear + 1)).toISOString()}
                                onChange={handleStartDateChange}
                                showYearPicker
                                dateFormat="yyyy"/>
                        </div>
                        <div id='year-picker-middle'/>
                        <div id='end-year-picker' className='year-picker'>
                            <DatePicker
                                showIcon
                                openToDate={new Date(String(endYear + 1)).toISOString()}
                                selected={new Date(String(endYear + 1)).toISOString()}
                                minDate={new Date(String(startYear + 1)).toISOString()}
                                maxDate={new Date()}
                                onChange={handleEndDateChange}
                                showYearPicker
                                dateFormat="yyyy"/>
                        </div>
                        </>
                        :
                        <div className='year-picker single-year-picker'>
                            <DatePicker
                                showIcon
                                openToDate={new Date(String(startYear + 1)).toISOString()}
                                selected={new Date(String(startYear + 1)).toISOString()}
                                minDate={new Date('2001')}
                                maxDate={new Date()}
                                onChange={handleStartDateChange}
                                showYearPicker
                                dateFormat='yyyy'/>
                        </div>
                    }
                </div>
            </div>
            <div id='toggles-wrapper' className='tools-group'>
                <div className='tools-title'>General:</div>
                <CustomToggle
                    id='multi-year-toggle' 
                    leftText='single-year' 
                    rightText='multi-year'
                    handler={handleMultiYearToggle}
                    defaultOn={true}/>
                <CustomToggle
                    id='data-type-toggle'
                    leftText='heat'
                    rightText='rain'
                    handler={handleTypeSelect}
                    disabled={!toolbarParams.multiYear}/>
            </div>
        </div>
    )
}

export default Toolbar