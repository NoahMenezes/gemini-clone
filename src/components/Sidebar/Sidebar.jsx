import React, { useState, useEffect, useRef, useContext } from 'react';
import './Sidebar.css';
import { assets } from '../../gemini-clone-assets/assets/assets';
import { Context } from '../context/Context';

const Sidebar = () => { 
    const { sessions, currentSessionId, newChat, selectSession, deleteSession, clearAllSessions } = useContext(Context);
    const [extended, setExtended] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const settingsRef = useRef(null);

    // Array of objects for the settings menu items (use available icons only)
    const settingsOptions = [
        { icon: assets.history_icon, text: 'Activity' },
        { icon: assets.user_icon, text: 'Personal context' },
        { icon: assets.youtube_icon, text: 'Public links' },
        { icon: assets.code_icon, text: 'Developer options' },
    ];
    
    useEffect(() => {
        function handleClickOutside(event) {
            // Check if settingsRef exists AND the click is outside the settings container
            if (settingsRef.current && !settingsRef.current.contains(event.target)) {
                // The original additional check (if (!event.target.closest('.settings-item-container'))) 
                // is redundant because the check against settingsRef.current already covers the entire container.
                // It's safer to just rely on the main check.
                setShowSettings(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    // Removed settingsRef from dependency array as a ref object rarely changes and adding it 
    // can cause linting warnings or unnecessary re-runs.
    }, []); 


    return (
        <div className={extended ? 'sidebar' : 'sidebar collapsed'}>
            <div className="top">
                <img 
                    onClick={() => setExtended(prev => !prev)} 
                    className='menu' 
                    src={assets.menu_icon} 
                    alt="Menu Icon" 
                />
                <div className='new-chat' onClick={newChat}>
                    <img src={assets.plus_icon} alt="New Chat Icon" />
                    {extended ? <p>New Chat</p> : null}
                </div>
                
                {extended ? (
                    <div className="recent">
                        <p className="recent-title">Recent</p> 
                        {sessions.map((s) => (
                            <div
                              key={s.id}
                              className={`sidebar-item recent-entry ${currentSessionId === s.id ? 'active' : ''}`}
                              onClick={() => selectSession(s.id)}
                            >
                                <img src={assets.message_icon} alt="Message Icon" />
                                <p title={s.title}>{s.title && s.title.length > 24 ? s.title.substring(0, 21) + '...' : (s.title || 'New chat')}</p>
                                <button className="delete-btn" title="Delete chat" onClick={(e) => { e.stopPropagation(); deleteSession(s.id); }}>×</button>
                            </div>
                        ))}
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
                            {settingsOptions.map((item, index) => (
                                <div key={index} className="settings-item">
                                    <img src={item.icon} alt={`${item.text} Icon`} />
                                    <p>{item.text}</p>
                                </div>
                            ))}
                            <hr />
                            <div className="settings-item" onClick={() => { if (confirm('Clear all chats?')) clearAllSessions(); }}>
                                <img src={assets.history_icon} alt="Clear all" />
                                <p>Clear all chats</p>
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