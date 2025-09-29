import {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} from "@google/generative-ai";

// IMPORTANT: Use environment variables for API keys in production!
// Never hardcode them directly in your code.
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY; 
const MODEL_name = 'gemini-2.0-flash'; // model name

// Your original function is perfect, no changes needed here.
async function runChat(prompt) {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_name });

    const generationConfig = {
        temperature: 0.6, // more consistent, tool-like
        topK: 32,
        topP: 0.9,
        maxOutputTokens: 2048,
    };

    const safetySettings = [
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    ];

    try {
        const chat = model.startChat({
            generationConfig,
            safetySettings,
            history: [],
        });

        const result = await chat.sendMessage(prompt);
        const response = result.response;
        return response.text();
    } catch (error) {
        console.error("Error running chat:", error);
        return "Sorry, something went wrong. Please try again. 😵";
    }
}

/**
 * This function takes a simple user query and turns it into a detailed, "fun" prompt.
 * @param {string} originalPrompt The user's simple question.
 * @returns {string} An enhanced prompt ready for the AI.
 */
function createEnhancedPrompt(originalPrompt) {
    const systemPrompt = `You are a professional AI assistant. Provide clear, accurate, and structured answers in clean Markdown.

Formatting rules:
- Start with a concise 1–2 line summary.
- Use headings (##) to organize sections when useful.
- Prefer bullet lists over long paragraphs.
- Use fenced code blocks (\`\`\`lang) for code and shell.
- Use tables only when they aid clarity.
- Keep tone neutral and tool-like. Minimize emojis.

User request:
---
${originalPrompt}
---`;
    return systemPrompt;
}

async function getFunResponse(userInput) {
    // 1. Create the enhanced prompt
    const enhancedPrompt = createEnhancedPrompt(userInput);
    
    // 2. Log for debugging to see the full prompt being sent
    console.log("Sending this enhanced prompt to Gemini:\n", enhancedPrompt);

    // 3. Call your original runChat function with the new, powerful prompt
    return await runChat(enhancedPrompt);
}

// Export the new function so your application can use it
export default getFunResponse;