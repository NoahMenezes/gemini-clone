import React, { useState } from 'react';
import './Sidebar.css';
import { assets } from '../../gemini-clone-assets/assets/assets';



const Sidebar = () => {
    const [extended, setExtended] = useState(false);

    return (
        <div className={extended ? 'sidebar' : 'sidebar collapsed'}>
            <div className="top">
                <img 
                    onClick={() => setExtended(prev => !prev)} 
                    className='menu' 
                    src={assets.menu_icon} 
                    alt="Menu Icon" 
                />
                <div className='new-chat'>
                    <img src={assets.plus_icon} alt="New Chat Icon" />
                    <p>New Chat</p>
                </div>
                
                <div className="recent">
                    <p className="recent-title">Recent</p>
                    {/* For demonstration, an active class is added to the first item */}
                    <div className="sidebar-item active">
                        <img src={assets.message_icon} alt="Message Icon" />
                        <p>What is react...</p>
                    </div>
                </div>
            </div>
            <div className="bottom">
                <div className="sidebar-item">
                    <img src={assets.question_icon} alt="Help Icon" />
                    <p>Help</p>
                </div>
                <div className="sidebar-item">
                    <img src={assets.history_icon} alt="History Icon" />
                    <p>Activity</p>
                </div>
                <div className="sidebar-item">
                    <img src={assets.setting_icon} alt="Settings Icon" />
                    <p>Settings</p>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;