import './CustomToggle.css'

const CustomToggle = ( { id, leftText, rightText, handler, defaultOn, disabled }) => {
    return (
        <label id={id} className={`custom-switch ${disabled ? 'disabled' : ''}`} onChange={handler}>
            <input type="checkbox" defaultChecked={defaultOn} disabled={disabled}/>
            <div className="slider"></div>
            <div className='left'>{leftText}</div>
            <div className='right'>{rightText}</div>
        </label>
    )
}

export default CustomToggle
