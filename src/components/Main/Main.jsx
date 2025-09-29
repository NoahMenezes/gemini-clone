// src/components/Main/Main.jsx

import React, { useContext, useEffect, useRef, useState } from 'react';
import './Main.css';
import { assets } from '../../gemini-clone-assets/assets/assets';
import { Context } from '../context/Context';

const Main = () => {
    // FIX: Destructure context as an object {} instead of an array []
    const { onSent, recentPrompt, showResult, loading, resultData, setInput, input, currentMessages, currentSessionId } = useContext(Context);
    const chatContainerRef = useRef(null);

    // Voice recognition state
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef(null);

    // Auto-scroll to bottom when new messages are added
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [currentMessages, resultData, loading]);
    
    const toggleListening = () => {
        // Check if the browser supports SpeechRecognition
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            alert("Your browser doesn't support the Web Speech API. Please use Chrome or Edge.");
            return;
        }

        // Check if we're on HTTPS or localhost
        if (location.protocol !== 'https:' && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
            alert("Voice recognition requires HTTPS or localhost. Please use a secure connection.");
            return;
        }

        if (isListening) {
            // STOP Listening
            recognitionRef.current?.stop();
            setIsListening(false);
            console.log("Speech recognition stopped.");
        } else {
            // START Listening
            const recognition = new SpeechRecognition();
            recognition.continuous = false; // Only get a single result
            recognition.interimResults = false; // Don't show interim results
            recognition.lang = 'en-US'; 
            
            recognition.onstart = () => {
                setIsListening(true);
                console.log("🎤 Speech recognition started... Speak now!");
            };

            recognition.onresult = (event) => {
                const transcript = Array.from(event.results)
                    .map(result => result[0])
                    .map(result => result.transcript)
                    .join('');
                
                // 1. Set the transcribed text into the input field
                setInput(transcript);

                // 2. Automatically send the prompt if transcription is successful
                if (transcript.trim() !== '') {
                    onSent(transcript); 
                }
            };

            recognition.onend = () => {
                setIsListening(false);
                console.log("Speech recognition ended.");
            };

            recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                setIsListening(false);
                
                let errorMessage = 'Voice input error: ';
                switch(event.error) {
                    case 'no-speech':
                        errorMessage += 'No speech detected. Please try again and speak clearly.';
                        break;
                    case 'audio-capture':
                        errorMessage += 'Microphone not accessible. Please check your microphone permissions.';
                        break;
                    case 'not-allowed':
                        errorMessage += 'Microphone permission denied. Please allow microphone access and try again.';
                        break;
                    case 'network':
                        errorMessage += 'Network error. Please check your internet connection.';
                        break;
                    default:
                        errorMessage += event.error;
                }
                alert(errorMessage);
            };

            recognitionRef.current = recognition;
            recognition.start();
        }
    };

    return (
        <div className='main'>
            <div className="nav">
                <p>Gemini</p>
                <img src={assets.user_icon} alt="" />
            </div>
            <div className="main-container">
                
                {/* Show welcome screen if no session or no messages */}
                {!currentSessionId || currentMessages.length === 0 ? (
                    <>
                        <div className="greet">
                            <p><span>Hello, Noah.</span></p>
                            <p>How can I help you today?</p>
                        </div>
                        <div className="cards">
                            <div className="card" onClick={() => onSent("Suggest beautiful places to see on an upcoming road trip")}>
                                <p>Suggest beautiful places to see on an upcoming road trip </p>
                                <img src={assets.compass_icon} alt="" />
                            </div>
                            <div className="card" onClick={() => onSent("Briefly summarize this concept: urban planning")}>
                                <p>Briefly summarize this concept: urban planning</p>
                                <img src={assets.bulb_icon} alt="" />
                            </div>
                            <div className="card" onClick={() => onSent("Brainstorm team bonding activities for our work retreat")}>
                                <p>Brainstorm team bonding activities for our work retreat</p>
                                <img src={assets.message_icon} alt="" />
                            </div>
                            <div className="card" onClick={() => onSent("Improve the readability of the following code")}>
                                <p>Improve the readability of the following code</p>
                                <img src={assets.code_icon} alt="" />
                            </div>
                        </div>
                    </>
                ) : (
                    <div className='chat-history' ref={chatContainerRef}>
                        {/* Display all messages in the current session */}
                        {currentMessages.map((message, index) => (
                            <div key={index} className={`message ${message.role}`}>
                                <div className="message-header">
                                    <img 
                                        src={message.role === 'user' ? assets.user_icon : assets.gemini_icon} 
                                        alt={message.role} 
                                    />
                                </div>
                                <div className="message-content">
                                    {message.role === 'user' ? (
                                        <p>{message.content}</p>
                                    ) : (
                                        <p dangerouslySetInnerHTML={{__html: message.content}}></p>
                                    )}
                                </div>
                            </div>
                        ))}
                        
                        {/* Show current typing response if loading */}
                        {loading && (
                            <div className="message assistant">
                                <div className="message-header">
                                    <img src={assets.gemini_icon} alt="assistant" />
                                </div>
                                <div className="message-content">
                                    {resultData ? (
                                        <p dangerouslySetInnerHTML={{__html: resultData}}></p>
                                    ) : (
                                        <div className="loader">
                                            <hr />
                                            <hr />
                                            <hr />
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                        
                        {/* Show final response if not in stored messages yet */}
                        {!loading && showResult && recentPrompt && !currentMessages.some(m => m.role === 'user' && m.content === recentPrompt) && (
                            <>
                                <div className="message user">
                                    <div className="message-header">
                                        <img src={assets.user_icon} alt="user" />
                                    </div>
                                    <div className="message-content">
                                        <p>{recentPrompt}</p>
                                    </div>
                                </div>
                                <div className="message assistant">
                                    <div className="message-header">
                                        <img src={assets.gemini_icon} alt="assistant" />
                                    </div>
                                    <div className="message-content">
                                        <p dangerouslySetInnerHTML={{__html: resultData}}></p>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                )}

                <div className="main-bottom">
                    <div className="search-box">
                        <input 
                            onChange={(e) => setInput(e.target.value)} 
                            value={input} 
                            type="text" 
                            placeholder='Enter a prompt here'
                            onKeyPress={(e) => e.key === 'Enter' && input && onSent()}
                        />
                        <div>
                            <img src={assets.gallery_icon} alt="" />
                            {/* FIX: Add the voice functionality here */}
                            <img 
                                src={assets.mic_icon} 
                                alt="Mic" 
                                onClick={toggleListening} 
                                className={isListening ? 'listening-pulse' : ''}
                            />
                            {/* FIX: Only show send button if there is input */}
                            {input ? <img onClick={() => onSent()} src={assets.send_icon} alt="Send" /> : null}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Main;