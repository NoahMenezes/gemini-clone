import { createContext } from "react";
import React from 'react'

export const Context = createContext();

const ContextProvider=(props)=>{


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