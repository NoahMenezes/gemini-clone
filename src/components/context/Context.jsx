// src/components/context/Context.jsx

import React, { createContext, useState } from "react";
import runChat from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {
    const [input, setInput] = useState("");
    const [recentPrompt, setRecentPrompt] = useState("");
    const [prevPrompts, setPrevPrompts] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState("");

    // Simple Markdown -> HTML converter and typing helpers
    const formatMarkdownToHtml = (md) => {
        if (!md) return "";
        let html = md;
        // Fenced code blocks
        html = html.replace(/```([\s\S]*?)```/g, (m, p1) => {
            const code = p1.replace(/</g, "&lt;").replace(/>/g, "&gt;");
            return `<pre><code>${code}</code></pre>`;
        });
        // Inline code
        html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
        // Headings
        html = html.replace(/^###\s+(.+)$/gm, '<h3>$1</h3>')
                   .replace(/^##\s+(.+)$/gm, '<h2>$1</h2>')
                   .replace(/^#\s+(.+)$/gm, '<h1>$1</h1>');
        // Bold/italic
        html = html.replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>')
                   .replace(/\*([^*]+)\*/g, '<i>$1</i>')
                   .replace(/_([^_]+)_/g, '<i>$1</i>');
        // Lists
        html = html.replace(/^(?:- |\* )(.+)$/gm, '<li>$1</li>');
        html = html.replace(/(?:\n)?(<li>.*?<\/li>\s*)+/gms, (m) => `<ul>${m.replace(/\n/g, '')}</ul>`);
        // Paragraph breaks
        html = html.replace(/\n{2,}/g, '<br/><br/>' ).replace(/\n/g, '<br/>' );
        return html;
    };

    const stripForTyping = (md) => {
        return md
            .replace(/```[\s\S]*?```/g, (m) => m.replace(/`/g, ''))
            .replace(/\*\*|__/g, '')
            .replace(/`/g, '')
            .replace(/^###\s+/gm, '')
            .replace(/^##\s+/gm, '')
            .replace(/^#\s+/gm, '')
            .replace(/^((?:- |\* )(.+))?$/gm, '• ');
    };

    // Add words to the state one by one with a delay
    const delayPara = (index, nextChunk) => {
        setTimeout(function () {
            setResultData(prev => prev + nextChunk);
        }, 35 * index);
    };

    const onSent = async (prompt) => {
        setResultData("");
        setLoading(true);
        setShowResult(true);
        setRecentPrompt(input);
        
        const response = await runChat(input);

        // Format full HTML and prepare a stripped typing text
        const formattedHtml = formatMarkdownToHtml(response);
        const typingText = stripForTyping(response);

        const words = typingText.split(/(\s+)/); // keep spaces
        for (let i = 0; i < words.length; i++) {
            delayPara(i, words[i]);
        }

        // After typing finishes, swap in the formatted HTML
        setTimeout(() => {
            setResultData(formattedHtml);
            setLoading(false);
            setInput("");
        }, 35 * (typingText.split(/\s+/).length + 2));
    };

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

    return (
        <Context.Provider value={{
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
        }}>
            {props.children}
        </Context.Provider>
    );
};

export default ContextProvider;