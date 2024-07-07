// // Three.js version of weatherblanket
// // Doesn't particularly offer benefits, but it was a good test
// function enable3D() {
//     let checkbox = document.getElementById("threeCheckbox")
//     let threeWindow = document.getElementById("threeBlanket)")
//     let keyBox = document.getElementById("keybox")
//     let blankets = document.getElementById("blankets")

//     if (checkbox.checked == true) {
//         threeBlanket.style.display = "block"
//         keyBox.style.display = "none"
//         blankets.style.display = "none"
//     } else {
//         threeBlanket.style.display = "none"
//         keyBox.style.display = "block"
//         blankets.style.display = "block"
//     }
// }  

function createHeatTics() {

    const degreeCount = 10;

    const heatKeyWrapper = document.querySelector('#heat-key-wrapper')
    const degWrapper = document.querySelector('#degrees-wrapper')
    const heatTicWrapper = document.querySelector('#heat-tic-wrapper')

    for (let i=0; i <= degreeCount; i++) {
        let degText = document.createElement('p');
        degText.setAttribute('id', `deg${i}`);
        degText.setAttribute('class', 'units');
        const tempBreaks = []
        if (i === 0) {
            degText.innerText = '0';
        } else {
            degText.innerText = `${(i * 10.6).toFixed(1)}°F`;
        }
        degText.style.bottom = `calc(${((100 / degreeCount) * i)}% - .5em)`
        degWrapper.appendChild(degText)

        let heatTic = document.createElement('hr');
        heatTic.setAttribute('id', `heat-tic${i}`);
        heatTic.setAttribute('class', 'heat-tic');
        heatTic.style.bottom = `${(100 / degreeCount) * i}%`;
        heatTicWrapper.appendChild(heatTic);
    }
    heatKeyWrapper.appendChild(degWrapper);
    heatKeyWrapper.appendChild(heatTicWrapper);
}


function createPrecipTics(maxRain) {
    const precipDivisions = 4

    const precipKeyWrapper = document.querySelector('#precip-key-wrapper')
    const inchWrapper = document.querySelector('#inch-wrapper')
    const precipTicWrapper = document.querySelector('#precip-tic-wrapper')
    for (let i=1; i <= precipDivisions; i++) {
        let inchText = document.createElement('p');
        inchText.setAttribute('id', `inch${i}`);
        inchText.setAttribute('class', 'units');
        inchText.innerText = `${(i * (maxRain/precipDivisions)).toFixed(2)} in`;
        inchText.style.top = `calc(${((100 / precipDivisions) * i)}% - 1.5em)`;
        inchWrapper.appendChild(inchText);

        let precipTic = document.createElement('hr');
        precipTic.setAttribute('id', `precip-tic${i}`);
        precipTic.setAttribute('class', 'precip-tic');
        precipTic.style.top = `calc(${((100 / precipDivisions) * i)}%)`;
        precipTicWrapper.appendChild(precipTic);
    }
    precipKeyWrapper.appendChild(inchWrapper);
    precipKeyWrapper.appendChild(precipTicWrapper);
}

function createWeatherblanket(dayNum, weatherData, maxRain) {
    let keyWrapper = document.querySelector('#key-wrapper');
    keyWrapper.addEventListener('mouseover', hideText);
    keyWrapper.addEventListener('mouseout', showText);
    
    // Handle mouseover tooltips
    const handleMouseEnter = (e) => {
        const dayIndex = e.target.dataset.index;
        const targetBar = document.querySelector(`#${e.target.id}`);
        targetBar.style.flex = 10;
        const tooltip = document.querySelector(`#${e.target.id} .weather-tooltip`);
        const barRect = targetBar.getBoundingClientRect();
        targetBar.addEventListener('mousemove', (e) => {
            let xOffset = Math.round(e.pageX - barRect.left);
            if (dayIndex <= 121) {
                tooltip.style.left = `${xOffset}px`;
            } else if (dayIndex > 121 && dayIndex < 243) {
                tooltip.style.left = `${Math.round(xOffset - 125)}px`;
            } else if (dayIndex >= 243) {
                tooltip.style.left = `${Math.round(xOffset - 250)}px`;
            }
            tooltip.style.top = `${e.pageY - 50}px`;
        })
        tooltip.style.display = 'block';
    }
    const handleMouseLeave = (e) => {
        // const dayIndex = e.target.dataset.index;
        const targetBar = document.querySelector(`#${e.target.id}`);
        targetBar.style.flex = 1;
        const tooltip = document.querySelector(`#${e.target.id} .weather-tooltip`);
        tooltip.style.display = 'none';
    }

    // Variable of the half-width of each column, used for rounding corners
    const halfWidth = ((.8*(window.innerWidth))/(dayNum * 2)) + 'px';
    
    for (let i = 0; i < dayNum; i++) {
        let dayBar = document.createElement('div');
        dayBar.setAttribute('id', `day${i}`);
        dayBar.setAttribute('class', 'day-bar')

        let heatBar = document.createElement('div');
        heatBar.setAttribute('id', `temp-bar${i}`);
        heatBar.setAttribute('class', 'blanket-column heat-column');
        heatBar.style.backgroundImage = 
            `linear-gradient(
                ${heatColorScale(weatherData[i]['MAX'])}, 
                ${heatColorScale(weatherData[i]['MIN'])}
            )`;
        dayBar.appendChild(heatBar);

        rainBar = document.createElement('div');
        rainBar.setAttribute('id', `rain-bar${i}`);
        rainBar.setAttribute('class', 'blanket-column rain-column');
        // rainBar.setAttribute('align', 'left');
        rainCoef = rainScale(weatherData[i]['PRCP'], maxRain);
        lowTemp = weatherData[i]['MIN'];
        lowColor = heatColorScale(lowTemp);
        // Rainbar is gradient from color of heatbar to blue
        rainBar.style.backgroundImage = 
            `linear-gradient(${lowColor} 60%, #2c48b8)`;

        // Create invisible placeholder divs or drips of representative length
        if (rainCoef !== 0){
            // Rainbars take up 40% of space, longest bar set to 40%
            rainBar.style.flexBasis = `${rainCoef * 40}vh`;
            rainBar.style.borderBottomLeftRadius = halfWidth;
            rainBar.style.borderBottomRightRadius = halfWidth;
            dayBar.appendChild(rainBar);
        }

        dayBar.dataset.index = i;

        let tooltip = document.createElement('div');
        tooltip.setAttribute('class', 'weather-tooltip');

        tooltip.innerHTML =
        `
            <h3 class='tooltip-header data-item'> ${weatherData[i]['DATE']} </h3>
            <ul class='tooltip-data'>
                <li class='data-item'> 
                    <b>Minimum Temp:</b> ${weatherData[i]['MIN']} ºF 
                </li>
                <li class='data-item'> 
                    <b>Maximum Temp:</b> ${weatherData[i]['MAX']} ºF 
                </li>
                <li class='data-item'> 
                    <b>Precipitation Level:</b> ${weatherData[i]['PRCP']} in. 
                </li>
            </ul>
        `
        
        dayBar.appendChild(tooltip);

        dayBar.addEventListener('mouseenter', handleMouseEnter);
        document.addEventListener('touchstart', handleMouseEnter);
        dayBar.addEventListener('mouseleave', handleMouseLeave);
        document.addEventListener('touchmove', handleMouseLeave);
        document.addEventListener('touchcancel', handleMouseLeave);
        document.addEventListener('touchend', handleMouseLeave);

        document.querySelector('#weather-bars').appendChild(dayBar);
    }

    function hideText(){
        document.querySelector('#blanket-text').style.opacity = '0%'
    }
    function showText(){
        document.querySelector('#blanket-text').style.opacity = '60%'
    }

    // Create visuals and datapoints for key
    createHeatTics()
    createPrecipTics(maxRain)
}