import { useContext, useState } from 'react';
import './Sidebar.css';
import SidebarIcon from './SidebarIcon';
import Toolbar from './Toolbar.js'

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(true);
    
    function handleOpenMenu() {
        setIsOpen(!isOpen);
    }

    return (
        <div id='sidebar-wrapper' className={isOpen?'menu-open':'menu-closed'}>
        {(isOpen) ? (
            <div id='sidebar'>
                <div id='open-sidebar-icon' className='sidebar-icon-wrapper' onClick={handleOpenMenu}>
                    <SidebarIcon/>
                </div>
                <div id='menu-header'>
                    <h2> Settings: </h2>
                </div>
                <div id='preset-menu'>
                    <Toolbar/>
                </div>
            </div>
        ):(
            <div onClick={handleOpenMenu} id='closed-sidebar-icon' className='sidebar-icon-wrapper'>
                <SidebarIcon/>
            </div>
        )}
        </div>
    )
}

export default Sidebar;