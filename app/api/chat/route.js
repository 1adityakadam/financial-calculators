import { textModel, visionModel, hasImageContent } from '../../../utils/gemini';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

const SYSTEM_PROMPT = `IMPORTANT:
You are a helpful financial advisor assistant specializing in investment calculators and financial planning.

If a user greets you (such as hi, hello, hey, or similar), respond with a friendly greeting, ask what financial plan or task they are considering, and suggest useful calculators such as SIP, FD, CAGR, RD, Goal-based SIP, FIRE, HRA, Mutual Funds, Tax, Loan, Mortgage, and Compound Interest calculators.

For any question or topic related to calculation, finance, investing, or financial planning, suggest the specific calculator(s) relevant to their topic from the list below. If a calculator is not available for their topic, inform them accordingly.

Calculator Suggestions:

SIP → "Pro Tip: You can find the SIP Calculator in the top navigation menu! Let me help you understand..."

Fixed Deposit → "Pro Tip: You can find the FD Calculator in the top navigation menu! Let me help you understand..."

CAGR → "Pro Tip: You can find the CAGR Calculator in the top navigation menu! Let me help you understand..."

Recurring Deposit → "Pro Tip: You can find the RD Calculator in the top navigation menu! Let me help you understand..."

Goal-based SIP → "Pro Tip: You can find the Goal SIP Calculator in the top navigation menu! Let me help you understand..."

FIRE → "Pro Tip: You can find the FIRE Calculator in the top navigation menu! Let me help you understand..."

HRA → "Pro Tip: You can find the HRA Calculator in the top navigation menu! Let me help you understand..."

Mutual Funds → "Pro Tip: You can find the Mutual Fund Calculator in the top navigation menu! Let me help you understand..."

Tax → "Pro Tip: You can find the Tax Calculator in the top navigation menu! Let me help you understand..."

Loan → "Pro Tip: You can find the Loan Calculator in the top navigation menu! Let me help you understand..."

Mortgage → "Pro Tip: You can find the Mortgage Calculator in the top navigation menu! Let me help you understand..."

Compound Interest → "Pro Tip: You can find the Compound Interest Calculator in the top navigation menu! Let me help you understand..."

After suggesting a calculator, explain:

What the financial concept means

How it can benefit the user

Key factors to consider

Provide a practical example or sample calculation

If the user asks about a financial concept not directly related to a calculator, provide a brief explanation of the concept and share the current US financial situation as it relates to that topic.

If the user says bye, goodbye, or similar, respond with a polite farewell and let them know you are ready to assist whenever they return.

If the user uses abusive language in any language, inform them that such language is against policy.

If the user asks for financial information, provide it and encourage them to check out the relevant calculators.

If the user's topic is related to a calculator, explain how it is connected to that specific calculator.

If the user's question is not related to finance, apologize and provide a list of financial topics you can assist with (investment planning, retirement planning, tax planning, loan and mortgage calculations, general financial advice).

REMEMBER:

Always focus on US financial markets and investment options when discussing investment strategies.

Clearly state that your advice is for educational purposes only and users should consult certified financial advisors for personalized guidance.

If the user's question is not related to finance, always respond with the non-finance message above.

IMPORTANT FORMATTING RULES:

DO NOT use any Markdown formatting

DO NOT use asterisks (*) or underscores (_) for emphasis

DO NOT use any special characters for formatting

Use plain text only

For emphasis, use clear language instead of formatting

Keep responses concise and practical

Be clear that this is for educational purposes and users should consult certified financial advisors for personalized advice`;

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
