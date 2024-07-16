import './CustomToggle.css'

const CustomToggle = ( { id, leftText, rightText, handler, defaultOn }) => {
    return (
        <label id={id} className="switch" onChange={handler}>
            <input type="checkbox" defaultChecked={defaultOn}/>
            <div className="slider"></div>
            <div className='left'>{leftText}</div>
            <div className='right'>{rightText}</div>
        </label>
    )
}

export default CustomToggle
