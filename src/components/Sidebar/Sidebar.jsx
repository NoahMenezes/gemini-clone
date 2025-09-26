import React from 'react'
import './Sidebar.css'
import {assets} from '../../gemini-clone-assets/assets/assets'
const Sidebar = () => {
  return (
    <div className='sidebar'>
    <div className="top"> 
        <img src="menu" alt={assets.menu_icon} />
        <div className='new-chat'>
            <img src={assets.plus_icon} alt="" />    
            <p>New Chat</p>
        </div>
        <div className="recent">
            <p className="recent-title">Recent</p>
            <div className="reecent-entry">
                <img src={assets.message_icon} alt="" />
                <p>What is react...</p>
            </div>
            </div>    
     </div>
     <div className="bottom">
        <div className="botton-item recent-entry">
            <img src={assets.question_icon} alt="" />
            <p>Help</p>
        </div>
        <div className="botton-item recent-entry">
            <img src={assets.history_icon} alt="" />
            <p>Help</p>
        </div>
        <div className="botton-item recent-entry">
            <img src={assets.setting_icon} alt="" />
            <p>Help</p>
        </div>
     </div>
    </div>
  )
}

export default Sidebar
