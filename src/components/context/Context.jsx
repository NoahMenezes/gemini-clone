import { createContext, useState } from "react";
import React from 'react'

export const Context = createContext();

const ContextProvider=(props)=>{
    const[input, setInput]=useState("");
    const[recentPrompt, setRecentPrompt]=useState("");
    const[prevPrompt, setPrevPrompts]=useState([]);
    const[showResult, setShowResult]=useState(false);
    const[loading, setLoading]=useState(false); 
    const[resultData, setResultData]=useState("");


    const onSent= async (prompt)=>{
        await runChat(prompt);
    }
    const contextValue={

    }
    // Incorrect return
// Correct return
return (
    <Context.Provider value={contextValue}>
        {props.children}
    </Context.Provider>
)
}

export default ContextProvider;