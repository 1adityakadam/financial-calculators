import { GoogleGenerativeAI } from '@google/generative-ai';

if (!process.env.GOOGLE_API_KEY) {
    throw new Error('Missing GOOGLE_API_KEY environment variable');
}

// Initialize the API with the correct configuration
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// Common generation config
const generationConfig = {
    temperature: 0.7,
    topK: 40,
    topP: 0.8,
    maxOutputTokens: 1000,
};

// Safety settings
const safetySettings = [
    {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
    },
    {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
    },
    {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
    },
    {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
    },
];

// Text-only model (Gemini 1.5 Flash)
export const textModel = genAI.getGenerativeModel({ 
    model: 'gemini-1.5-flash-002',
    generationConfig,
    safetySettings,
}); 

// Vision model
export const visionModel = genAI.getGenerativeModel({ 
    model: 'gemini-pro-vision',
    generationConfig,
    safetySettings,
});

// List available models
export async function listModels() {
    try {
        const models = await genAI.listModels();
        return models;
    } catch (error) {
        console.error('Error listing models:', error);
        throw error;
    }
}

// Helper function to determine if input contains image
export function hasImageContent(content) {
    return content.parts && content.parts.some(part => part.hasOwnProperty('inlineData'));
} 