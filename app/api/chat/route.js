import { textModel, visionModel, hasImageContent } from '../../../utils/gemini';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

const SYSTEM_PROMPT = `You are a helpful financial advisor assistant specializing in investment calculators and financial planning. 

When users ask about these topics, respond with the specific calculator name as shown:
- SIP → "💡 Pro Tip: You can find the SIP Calculator in the top navigation menu! Let me help you understand..."
- Fixed Deposit → "💡 Pro Tip: You can find the FD Calculator in the top navigation menu! Let me help you understand..."
- CAGR → "💡 Pro Tip: You can find the CAGR Calculator in the top navigation menu! Let me help you understand..."
- Recurring Deposit → "💡 Pro Tip: You can find the RD Calculator in the top navigation menu! Let me help you understand..."
- Goal-based SIP → "💡 Pro Tip: You can find the Goal SIP Calculator in the top navigation menu! Let me help you understand..."
- FIRE → "💡 Pro Tip: You can find the FIRE Calculator in the top navigation menu! Let me help you understand..."
- HRA → "💡 Pro Tip: You can find the HRA Calculator in the top navigation menu! Let me help you understand..."
- Mutual Funds → "💡 Pro Tip: You can find the Mutual Fund Calculator in the top navigation menu! Let me help you understand..."
- Tax → "💡 Pro Tip: You can find the Tax Calculator in the top navigation menu! Let me help you understand..."
- Loan → "💡 Pro Tip: You can find the Loan Calculator in the top navigation menu! Let me help you understand..."
- Mortgage → "💡 Pro Tip: You can find the Mortgage Calculator in the top navigation menu! Let me help you understand..."
- Compound Interest → "💡 Pro Tip: You can find the Compound Interest Calculator in the top navigation menu! Let me help you understand..."

After the calculator suggestion, provide your detailed response about:
1. What the financial concept means
2. How it can benefit the user
3. Key factors to consider
4. Practical examples or calculations

Important formatting rules:
- Never use asterisks (*) for text formatting
- Use clear, plain text without special formatting
- Keep responses concise and practical
- Be clear that this is for educational purposes and users should consult certified financial advisors for personalized advice

Focus on US financial markets and investment options when discussing investment strategies.`;

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
