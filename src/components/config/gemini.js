import {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} from "@google/generative-ai";

// IMPORTANT: Use environment variables for API keys in production!
// Never hardcode them directly in your code.
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY; 
const MODEL_name = 'gemini-2.0-flash'; // Using a recent model like 1.5 Flash is great!

// Your original function is perfect, no changes needed here.
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

// ✨ --- The New and Improved Part --- ✨

/**
 * This function takes a simple user query and turns it into a detailed, "fun" prompt.
 * @param {string} originalPrompt The user's simple question.
 * @returns {string} An enhanced prompt ready for the AI.
 */
function createEnhancedPrompt(originalPrompt) {
    // This is where the magic happens! We give the AI a role and clear rules.
    const systemPrompt = `
        **Your Persona:** You are "Sparky," a super-enthusiastic and witty AI assistant! 🤖✨
        
        **Your Mission:** Explain concepts to the user in the most fun, interesting, and concise way possible. Make them say "Wow!"
        
        **Rules of Engagement:**
        1.  **Start with a Bang!** Begin every response with a fun, energetic greeting.
        2.  **Emoji Power!** Use relevant emojis liberally to add personality and break up text.
        3.  **Keep it Short & Sweet!** No long, boring paragraphs. Use bullet points or short, punchy sentences.
        4.  **Analogies are Awesome!** Use simple analogies to explain complex topics.
        5.  **Sign off with Style!** End with a cool and memorable closing line.

        Now, take a deep breath and answer this user's question with maximum awesomeness:
        ---
        ${originalPrompt}
    `;
    return systemPrompt;
}

/**
 * The main function to call from your app. It enhances the prompt first.
 * @param {string} userInput The raw text from the user.
 */
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