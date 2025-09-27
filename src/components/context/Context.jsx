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
    const delayPara = (index,nextWord )=>{

    }
    const onSent = async (prompt) => {
        setResultData("");
        setLoading(true);
        setShowResult(true );
        setRecentPrompt(input);
        const response=await runChat(input);
        let responseArray=response.split("**")
        let newResponseArray;
        for(let i=0;i<responseArray.length;i++){
            if(i===0 ||i%2!==1){
                newArray+=responseArray[i];
            }   
            else{
                newArray+="<b>"+responseArray+"</b>";
            }
        }

        setResultData(newArray);
        setLoading(false);
        setInput("");
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
        setInput,
    };

    // The component must return JSX, not an object
    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    );
};

export default ContextProvider;