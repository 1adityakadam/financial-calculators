import { textModel, visionModel, hasImageContent } from '../../../utils/gemini';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

const SYSTEM_PROMPT = `You are a helpful financial advisor assistant specializing in investment calculators and financial planning. You can help users with:

1. SIP (Systematic Investment Plan) calculations and strategies
2. Fixed Deposit (FD) and Recurring Deposit (RD) planning
3. CAGR (Compound Annual Growth Rate) understanding
4. Tax calculations and optimization
5. Retirement planning (NPS, FIRE method)
6. Mutual fund investments
7. HRA and tax benefits
8. Goal-based financial planning

If users provide images of financial documents, charts, or statements, analyze them and provide relevant insights.
Provide accurate, helpful advice while being clear that this is for educational purposes and users should consult certified financial advisors for personalized advice. Keep responses concise and practical.

Focus on US financial markets and investment options when discussing SIP and investment strategies.`;

export async function POST(req) {
    try {
        const { messages } = await req.json();
        
        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            throw new Error('Invalid messages format');
        }

        // Get the last message
        const lastMessage = messages[messages.length - 1];

        // Determine which model to use based on content type
        const model = hasImageContent(lastMessage) ? visionModel : textModel;

        try {
            // Prepare the chat content
            const chatContent = [
                { text: SYSTEM_PROMPT },
                { text: 'I understand and will act as a financial advisor.' }
            ];

            // Add the user's message
            if (hasImageContent(lastMessage)) {
                chatContent.push({
                    parts: lastMessage.parts
                });
            } else {
                chatContent.push({
                    text: lastMessage.content
                });
            }

            // Generate response with the appropriate model
            const result = await model.generateContentStream(chatContent);

            // Create a ReadableStream from the Gemini response
            const stream = new ReadableStream({
                async start(controller) {
                    try {
                        for await (const chunk of result.stream) {
                            const text = chunk.text();
                            if (text) {
                                controller.enqueue(new TextEncoder().encode(text));
                            }
                        }
                        controller.close();
                    } catch (error) {
                        console.error('Streaming error:', error);
                        controller.error(error);
                    }
                },
            });

            return new Response(stream);
        } catch (error) {
            console.error('Gemini API Error:', error);
            throw error;
        }
    } catch (error) {
        console.error('Chat API Error:', error);
        return NextResponse.json(
            { 
                error: 'Internal server error',
                details: error.message,
                stack: error.stack
            },
            { status: 500 }
        );
    }
}
