import { textModel, visionModel, hasImageContent } from '../../../utils/gemini';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

const SYSTEM_PROMPT = `You are a helpful financial advisor assistant specializing in investment calculators and financial planning. 


IMPORTANT: 
If a user says hi, hello, hey, heyyyy, heyy, etc then respond with: 
-Hello! How can I help you today?

After the greeting, for any questions or topics related to calculation, finance, investing, or financial planning
Before the calculator suggestion, in these situations:
If a user inquires about gold, silver, platinum, copper, or any metal or stones then respond with general information based on the current US financial market for precious metals or precious stones. Also, let them know that we do not have a specific calculator available for these topics.
If a user inquires about real estate, then respond with general information based on the current US financial market for real estate. Also, let them know that we do not have a specific calculator available for these topics.
If a user inquires about methods for stock, shares then respond with general information based on the current US financial market for stocks, shares, etc beyond the calculators we offer. Also, let them know that we do not have a specific calculator available for these topics.
If a user inquires about methods for cryptocurrency then respond with general information based on the current US financial market for cryptocurrencies etc beyond the calculators we offer. Also, let them know that we do not have a specific calculator available for these topics.
Else respond with the specific calculator suggestions:
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

For any questions or topics NOT related to calculation, finance, investing, or financial planning respond with:
"I apologize, I cannot help with general questions on spending money, kindly choose an investment type by looking at the top navigation menu. I specialize in financial planning, investment strategies, and calculator guidance. Please feel free to ask me about:
- Investment planning and calculations
- Retirement planning and FIRE
- Tax planning and HRA calculations
- Loan and mortgage calculations
- General financial advice and strategies"

After the calculator suggestion, provide your detailed response about:
1. What the financial concept means
2. How it can benefit the user
3. Key factors to consider
4. Practical examples or calculations

If a user says bye, see you, goodbye, shut up, sleep, etc then respond with: 
-It was nice helping you! Feel free to ask me anything again when you need help - I'll be here.

IMPORTANT FORMATTING RULES:
- DO NOT use any Markdown formatting
- DO NOT use asterisks (*) or underscores (_) for emphasis
- DO NOT use any special characters for formatting
- Use plain text only
- For emphasis, use clear language instead of formatting
- Keep responses concise and practical
- Be clear that this is for educational purposes and users should consult certified financial advisors for personalized advice

Focus on US financial markets and investment options when discussing investment strategies.

Remember: If the user's question is not related to finance, ALWAYS respond with the non-finance message above.`;

// Add a function to clean the text
function cleanMarkdownFormatting(text) {
    // Remove Markdown formatting while preserving the content
    return text
        .replace(/\*\*(.*?)\*\*/g, '$1')  // Remove bold
        .replace(/\*(.*?)\*/g, '$1')      // Remove italics
        .replace(/_(.*?)_/g, '$1')        // Remove underscores
        .replace(/`(.*?)`/g, '$1');       // Remove code formatting
}

export async function POST(req) {
    try {
        const { messages, userId } = await req.json();
        
        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            throw new Error('Invalid messages format');
        }

        if (!userId || typeof userId !== 'string' || !userId.startsWith('user_')) {
            throw new Error('Invalid or missing user ID');
        }

        // Get the last message
        const lastMessage = messages[messages.length - 1];

        // Determine which model to use based on content type
        const model = hasImageContent(lastMessage) ? visionModel : textModel;

        try {
            // Prepare the chat content with user context
            const chatContent = [
                { text: SYSTEM_PROMPT }
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
                            const text = cleanMarkdownFormatting(chunk.text());
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
