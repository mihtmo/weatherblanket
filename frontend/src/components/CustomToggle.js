import './CustomToggle.css'

const CustomToggle = ( { id, leftText, rightText, handler }) => {
    return (
        <label id={id} className="switch" onChange={handler}>
            <input type="checkbox"/>
            <div className="slider"></div>
            <div className='left'>{leftText}</div>
            <div className='right'>{rightText}</div>
        </label>
    )
}

export default CustomToggle
