import { useEffect, useState } from 'react';
import './InfoButton.css'
import InfoIcon from './InfoIcon';

// Full-page overlay for preset info buttons
const InfoButton = ({ title, body, id }) => {
    const [isOpen, setIsOpen] = useState(false);

    function handleClick(e) {
        setIsOpen(true);
    }

    function handleOverlayClose(e) {
        e.stopPropagation();
        if (e.target.id === 'info-overlay') {
            setIsOpen(false);
        }
    }

    // Prevent body scrolling when overlay is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isOpen])

    return (
        <div id={id} className='info-button' onClick={handleClick}>
            <InfoIcon/>
            { isOpen && (
                <div id='info-overlay' onClick={handleOverlayClose}>
                    <div className='info-wrapper'>
                        <div className='info-title-text'>
                            {title}
                        </div>
                        <div className='details-text'>
                            {body}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default InfoButton;