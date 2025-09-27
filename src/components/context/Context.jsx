import React, { createContext, useState } from "react";
import runChat from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {
    // State to manage input, loading, and results
    const [input, setInput] = useState("");
    const [recentPrompt, setRecentPrompt] = useState("");
    const [prevPrompts, setPrevPrompts] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState("");

    const onSent = async (prompt) => {
        setLoading(true);
        setShowResult(true);
        setRecentPrompt(input);
        
        // The await call is now correctly inside the async function
        const response = await runChat(input);
        
        setResultData(response);
        setLoading(false);
        setInput(""); // Clear input after sending
    };

    // The context value is an object with keys and values
    const contextValue = {
        prevPrompts,
        setPrevPrompts,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResult,
        loading,
        resultData,
        input,
        setInput
    };

    // The component must return JSX, not an object
    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    );
};

export default ContextProvider;