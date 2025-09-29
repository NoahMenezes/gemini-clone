// src/components/context/Context.jsx

import React, { createContext, useEffect, useMemo, useState } from "react";
import runChat from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {
    const [input, setInput] = useState("");
    const [recentPrompt, setRecentPrompt] = useState("");
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState("");

    // Session management
    // sessions: [{ id, title, messages: [{role: 'user'|'assistant', content}], createdAt }]
    const [sessions, setSessions] = useState(() => {
        try {
            const raw = localStorage.getItem("gc_sessions");
            return raw ? JSON.parse(raw) : [];
        } catch {
            return [];
        }
    });
    const [currentSessionId, setCurrentSessionId] = useState(() => {
        try {
            return localStorage.getItem("gc_currentSessionId") || "";
        } catch {
            return "";
        }
    });

    // Derive prevPrompts for Sidebar (titles)
    const prevPrompts = useMemo(() => sessions.map(s => s.title), [sessions]);

    // Persist sessions and current session
    useEffect(() => {
        try { localStorage.setItem("gc_sessions", JSON.stringify(sessions)); } catch {}
    }, [sessions]);
    useEffect(() => {
        try { localStorage.setItem("gc_currentSessionId", currentSessionId); } catch {}
    }, [currentSessionId]);

    const getCurrentSession = () => sessions.find(s => s.id === currentSessionId) || null;

    const newChat = () => {
        const id = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
        const session = { id, title: "New chat", messages: [], createdAt: Date.now() };
        setSessions(prev => [session, ...prev]);
        setCurrentSessionId(id);
        setRecentPrompt("");
        setResultData("");
        setShowResult(false);
        setInput("");
    };

    const selectSession = (id) => {
        setCurrentSessionId(id);
        const s = sessions.find(x => x.id === id);
        if (s) {
            const lastUser = [...s.messages].reverse().find(m => m.role === 'user');
            setRecentPrompt(lastUser ? lastUser.content : "");
            const lastAssistant = [...s.messages].reverse().find(m => m.role === 'assistant');
            setResultData(lastAssistant ? lastAssistant.content : "");
            setShowResult(!!lastAssistant);
            setInput("");
        }
    };

    const deleteSession = (id) => {
        setSessions(prev => prev.filter(s => s.id !== id));
        if (currentSessionId === id) {
            // move to next available session or reset view
            const remaining = sessions.filter(s => s.id !== id);
            if (remaining.length > 0) {
                setCurrentSessionId(remaining[0].id);
                const s0 = remaining[0];
                const lastAssistant = [...s0.messages].reverse().find(m => m.role === 'assistant');
                setResultData(lastAssistant ? lastAssistant.content : "");
                const lastUser = [...s0.messages].reverse().find(m => m.role === 'user');
                setRecentPrompt(lastUser ? lastUser.content : "");
                setShowResult(!!lastAssistant);
            } else {
                setCurrentSessionId("");
                setRecentPrompt("");
                setResultData("");
                setShowResult(false);
            }
        }
    };

    const clearAllSessions = () => {
        setSessions([]);
        setCurrentSessionId("");
        setRecentPrompt("");
        setResultData("");
        setShowResult(false);
        setInput("");
    };

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
        if (!md) return "";
        return md
            // Keep code text visible but remove backticks
            .replace(/```[\s\S]*?```/g, (m) => m.replace(/`/g, ''))
            // Remove strong/inline formatting markers
            .replace(/\*\*|__/g, '')
            .replace(/`/g, '')
            // Strip heading markers only
            .replace(/^###\s+/gm, '')
            .replace(/^##\s+/gm, '')
            .replace(/^#\s+/gm, '')
            // Convert ONLY actual markdown list items to a bullet prefix
            .replace(/^[-*]\s+/gm, '• ')
            // Collapse excessive blank lines to a single newline
            .replace(/\n{3,}/g, '\n\n');
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
        const userText = (typeof prompt === 'string' && prompt.length > 0) ? prompt : input;
        setRecentPrompt(userText);
        // ensure there is a current session
        let workingSessionId = currentSessionId;
        if (!workingSessionId) {
            const id = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
            const session = { id, title: userText.slice(0, 40) || 'New chat', messages: [], createdAt: Date.now() };
            setSessions(prev => [session, ...prev]);
            setCurrentSessionId(id);
            workingSessionId = id;
        }

        // add user message
        setSessions(prev => prev.map(s => s.id === workingSessionId ? {
            ...s,
            title: s.messages.length === 0 ? (userText.slice(0, 40) || 'New chat') : s.title,
            messages: [...s.messages, { role: 'user', content: userText }]
        } : s));
        
        const response = await runChat(userText);

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
            // add assistant message (store full HTML for rendering later)
            const htmlToStore = formattedHtml;
            setSessions(prev => prev.map(s => s.id === workingSessionId ? {
                ...s,
                messages: [...s.messages, { role: 'assistant', content: htmlToStore }]
            } : s));
        }, 35 * (typingText.split(/\s+/).length + 2));
    };

    return (
        <Context.Provider value={{
            // chat io
            onSent,
            input,
            setInput,
            recentPrompt,
            setRecentPrompt,
            showResult,
            loading,
            resultData,
            // sessions
            sessions,
            currentSessionId,
            newChat,
            selectSession,
            deleteSession,
            clearAllSessions,
            // derived
            prevPrompts,
            getCurrentSession,
        }}>
            {props.children}
        </Context.Provider>
    );
};

export default ContextProvider;