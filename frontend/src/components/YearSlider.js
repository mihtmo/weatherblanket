import Nouislider from "nouislider-react";
import "nouislider/distribute/nouislider.css";
import { useRef } from "react";

const YearSlider = ( { id, multiYear, currentYear, handler, start }) => {

    return (
        <div id={id} className='year-slider'>
                <Nouislider 
                    range={{ min: 2000, max: currentYear }} 
                    start={ start } 
                    step={1}
                    onSlide={handler}
                    connect />
        </div>
    )
}

export default YearSlider