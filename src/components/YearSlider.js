import Nouislider from "nouislider-react";
import "nouislider/distribute/nouislider.css";
import { useRef } from "react";

const YearSlider = ( { id, multiYear, currentYear, handler, start }) => {

    function pipsFilter(value, type) {
        if ((value % 4) == 0) {
            return 2;
        }
    }

    return (
        <div id={id} className='year-slider'>
            <Nouislider 
                range={{ min: 2000, max: currentYear }} 
                start={ start } 
                step={1}
                onSlide={handler}
                connect 
                behaviour="drag"
                pips={{ mode: 'steps', density: 3, filter: pipsFilter }} />
        </div>
    )
}

export default YearSlider