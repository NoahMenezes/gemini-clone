import React from 'react'
import './Main.css'
import { assets } from '../../gemini-clone-assets/assets/assets'

const Main = () => {
  return (
    <div className='main'>
        <div className="nav">
            <p>Gemini</p>
            <img src={assets.user_icon} alt="" />
        </div>
        <div className="main-container">
            <div className="greet">
                <p><span>Hello, Noah.</span></p>
                <p>How can I help you today?</p>
            </div>
            <div className="cards">
                <div className="card">
                    <p>Suggest beautiful places to see on an upcoming road trip </p>
                    <img src={assets.compass_icon} alt="" />
                </div>
                <div className="card">
                    <p>Briefly summarizze this concept: urban planning</p>
                    <img src={assets.bulb_icon} alt="" />
                </div>
                <div className="card">
                    <p>Brainstorm team bonding activities for our work retreat</p>
                    <img src={assets.message_icon} alt="" />
                </div>
                <div className="card">
                    <p>Improve the readability of the following code</p>
                    <img src={assets.code_icon} alt="" />
                </div>
            </div>

<div className="main-bottom">
    <div className="search-box">
        <input type="text" placeholder='Enter a prompt here' />
        <div>
            <img src={assets.gallery_icon} alt="" />
            <img src={assets.mic_icon} alt="" />
            <img src={assets.send_icon} alt="" />
        </div>
    </div>
    <div className="bottom-info">
        {/* Text is now wrapped in a <p> tag and typos are fixed */}
        <p>Gemini may be inaccurate, so please double-check the info</p>
    </div>
</div>
        </div>
    </div>
  )
}

export default Main
