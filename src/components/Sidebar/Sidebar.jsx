import React, { useState, useEffect, useRef } from 'react';
import './Sidebar.css';
import { assets } from '../../gemini-clone-assets/assets/assets';

const Sidebar = () => {
    const [extended, setExtended] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const settingsRef = useRef(null);

    // Array of objects for the settings menu items
    const settingsOptions = [
        { icon: assets.history_icon, text: 'Activity' },
        { icon: assets.user_icon, text: 'Personal context' },
        { icon: assets.apps_icon, text: 'Apps' },
        { icon: assets.scheduled_icon, text: 'Scheduled actions' },
        { icon: assets.link_icon, text: 'Your public links' },
        { icon: assets.theme_icon, text: 'Theme' },
        { icon: assets.subscription_icon, text: 'Manage subscription' },
        { icon: assets.upgrade_icon, text: 'Upgrade to Google AI Ultra' },
        { icon: assets.feedback_icon, text: 'Send feedback' },
    ];
    
    useEffect(() => {
        function handleClickOutside(event) {
            if (settingsRef.current && !settingsRef.current.contains(event.target)) {
                if (!event.target.closest('.settings-item-container')) {
                    setShowSettings(false);
                }
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [settingsRef]);


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
                    {extended ? <p>New Chat</p> : null}
                </div>
                
                {extended ? (
                    <div className="recent">
                        <p className="recent-title">Recent</p>
                        <div className="sidebar-item active">
                            <img src={assets.message_icon} alt="Message Icon" />
                            <p>What is react...</p>
                        </div>
                    </div>
                ) : null}
            </div>
            <div className="bottom">
                <div className="sidebar-item">
                    <img src={assets.question_icon} alt="Help Icon" />
                    {extended ? <p>Help</p> : null}
                </div>
                <div className="sidebar-item">
                    <img src={assets.history_icon} alt="History Icon" />
                    {extended ? <p>Activity</p> : null}
                </div>
                
                <div ref={settingsRef} className="settings-item-container">
                    {showSettings && (
                        <div className="settings-menu">
                            {/* Map over the settings options array, rendering only text */}
                            {settingsOptions.map((item, index) => (
                                <div key={index} className="settings-item">
                                    <p>{item.text}</p>
                                </div>
                            ))}
                            <hr />
                             <div className="settings-item">
                                <p>Help</p>
                            </div>
                            <div className='location-info'>
                                <p>Bandiwa, Goa, India</p>
                            </div>
                             <p className='location-subtext'>From your IP address • Update location</p>
                        </div>
                    )}

                    <div className="sidebar-item" onClick={() => setShowSettings(!showSettings)}>
                        <img src={assets.setting_icon} alt="Settings Icon" />
                        {extended ? <p>Settings</p> : null}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;