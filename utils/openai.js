import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    dangerouslyAllowBrowser: true // Only for development, use API routes in production
});

export const generateAIResponse = async (message, context) => {
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: `You are a financial assistant specializing in:
                    - Investment calculations and planning
                    - Loan and mortgage scenarios
                    - Tax planning and estimates
                    - Retirement planning
                    - General financial advice
                    
                    You have access to various financial calculators. When responding:
                    1. If the query is not finance-related, politely redirect to financial topics
                    2. For calculations, recommend the appropriate calculator using <link>calculator-name</link> format
                    3. Provide brief, relevant financial advice
                    4. Keep responses concise and focused
                    5. Extract and reference any monetary values mentioned
                    
                    Available calculators: sip, mutual-fund, loan, mortgage, tax, fire, compound, fd, rd, hra, cagr, goal-sip`
                },
                {
                    role: "user",
                    content: message
                }
            ],
            temperature: 0.7,
            max_tokens: 500
        });

        return completion.choices[0].message.content;
    } catch (error) {
        console.error('OpenAI API Error:', error);
        throw new Error('Failed to generate response');
    }
}; 