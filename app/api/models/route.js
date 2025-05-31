import { listModels } from '../../../utils/gemini';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
    try {
        const models = await listModels();
        return NextResponse.json({ models });
    } catch (error) {
        console.error('Error fetching models:', error);
        return NextResponse.json(
            { 
                error: 'Failed to fetch models',
                details: error.message 
            },
            { status: 500 }
        );
    }
} 