import { getGeminiResponse } from '@/utils/gemini';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { prompt } = await request.json();

        if (!prompt) {
            return NextResponse.json(
                { error: 'Prompt is required' },
                { status: 400 }
            );
        }

        const response = await getGeminiResponse(prompt);
        return NextResponse.json({ response });
    } catch (error) {
        console.error('Error in models API:', error);
        return NextResponse.json(
            { error: 'Failed to process request' },
            { status: 500 }
        );
    }
} 