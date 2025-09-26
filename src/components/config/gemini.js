// This is a placeholder for your actual API key.
// In a real application, you would never hardcode this in client-side JavaScript.
// It would be securely fetched from a backend or environment variable.
 // Replace with how you securely access your key
const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} = require('@google/generative-ai');

// 1. Declare the API Key only once
const API_KEY = "AIzaSyAbe7dX42BKpqIJQcRAKBd3gzO0rVLMW0M"; // Best practice: Use process.env.GEMINI_API_KEY
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
            // 2. Corrected the threshold value here
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

    const chat = model.startChat({
        generationConfig,
        safetySettings,
        history: [],
    });

    const result = await chat.sendMessage(prompt);
    const response = result.response;
    console.log(response.text());
}

export default runChat;