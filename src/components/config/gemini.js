import {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} from "@google/generative-ai";

// Best practice: Store your API key in an environment variable
const API_KEY = "AIzaSyAbe7dX42BKpqIJQcRAKBd3gzO0rVLMW0M"; // <-- IMPORTANT: Replace with your actual API Key
const MODEL_name = 'gemini-1.0-pro';

async function runChat(prompt) {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_name });

    const generationConfig = {
        temperature: 0.9,
        topK: 1,
        topP: 1,
        maxOutputTokens: 2048,
    };

    const safetySettings = [
        {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
    ];

    try {
        const chat = model.startChat({
            generationConfig,
            safetySettings,
            history: [],
        });

        const result = await chat.sendMessage(prompt);
        const response = result.response;
        // Return the text so it can be used in the state
        return response.text();
    } catch (error) {
        console.error("Error running chat:", error);
        return "Sorry, something went wrong. Please try again.";
    }
}

export default runChat;