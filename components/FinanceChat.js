'use client';
import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Calculator } from 'lucide-react';
import Link from 'next/link';
import { generateAIResponse } from '../utils/openai';

const FinanceChat = () => {
    const [messages, setMessages] = useState([
        {
            type: 'bot',
            content: 'Hello! I\'m your Financial Assistant. I can help you with:\n\n' +
                    '• Investment calculations and planning\n' +
                    '• Loan and mortgage scenarios\n' +
                    '• Tax planning and estimates\n' +
                    '• Retirement planning\n' +
                    '• General financial advice\n\n' +
                    'Feel free to ask me specific questions like "I want to invest $10,000 monthly" or "I need a $300,000 mortgage".'
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const extractNumbers = (text) => {
        const matches = text.match(/\$?(\d{1,3}(,\d{3})*(\.\d+)?|\d+(\.\d+)?)/g);
        if (matches) {
            return matches.map(match => parseFloat(match.replace(/[$,]/g, '')));
        }
        return [];
    };

    const getCalculatorLink = (type) => {
        const calculatorPaths = {
            sip: '/?calculator=sip',
            investment: '/?calculator=mutual-fund',
            loan: '/?calculator=loan',
            mortgage: '/?calculator=mortgage',
            tax: '/?calculator=tax',
            retirement: '/?calculator=fire',
            compound: '/?calculator=compound',
            fd: '/?calculator=fd',
            rd: '/?calculator=rd',
            hra: '/?calculator=hra',
            cagr: '/?calculator=cagr',
            'goal-sip': '/?calculator=goal-sip'
        };
        return calculatorPaths[type] || null;
    };

    const generateResponse = (message) => {
        const lowerMessage = message.toLowerCase();
        const numbers = extractNumbers(message);

        // Check if the message is non-financial
        if (lowerMessage.includes('weather') || 
            lowerMessage.includes('sports') || 
            lowerMessage.includes('politics') ||
            lowerMessage.includes('movies') ||
            lowerMessage.includes('music')) {
            return "I apologize, but I'm specialized in financial topics only. Please feel free to ask me about investments, loans, taxes, or other financial matters.";
        }

        // Investment-related queries
        if (lowerMessage.includes('sip') || lowerMessage.includes('monthly invest')) {
            const amount = numbers[0] || 0;
            const years = numbers[1] || 0;
            let response = `For a monthly SIP investment of $${amount.toLocaleString()}, I recommend using our SIP Calculator to see potential returns. `;
            
            if (amount >= 10000) {
                response += `That's a significant monthly investment! You might want to consider diversifying across different asset classes. `;
            }
            
            response += `\n\nClick here to use the SIP Calculator: <link>sip</link>\n\nWould you like to know more about:
            1. Different investment options for your monthly savings?
            2. How to optimize your SIP for tax benefits?
            3. Goal-based SIP planning?`;
            
            return response;
        }

        // Lump sum investment queries
        if (lowerMessage.includes('lump sum') || lowerMessage.includes('one time invest')) {
            const amount = numbers[0] || 0;
            let response = `For a lump sum investment of $${amount.toLocaleString()}, you have several options. `;
            
            if (amount > 100000) {
                response += `Given the significant amount, you might want to consider a mix of:
                • Fixed Deposits for stability
                • Mutual Funds for growth
                • Bonds for regular income`;
            }
            
            response += `\n\nUse these calculators to compare returns:
            • Compound Interest Calculator: <link>compound</link>
            • Mutual Fund Calculator: <link>mutual-fund</link>
            • FD Calculator: <link>fd</link>`;
            
            return response;
        }

        // Loan-related queries
        if (lowerMessage.includes('loan')) {
            const amount = numbers[0] || 0;
            let response = `For a loan amount of $${amount.toLocaleString()}, `;
            
            if (amount > 100000) {
                response += `you'll want to carefully consider the interest rates and tenure. `;
            }
            
            response += `Use our Loan Calculator to:
            • Calculate monthly payments
            • View complete amortization schedule
            • Compare different interest rates
            
            Click here: <link>loan</link>`;
            
            return response;
        }

        // Mortgage queries
        if (lowerMessage.includes('mortgage') || lowerMessage.includes('home loan')) {
            const amount = numbers[0] || 0;
            let response = `For a mortgage of $${amount.toLocaleString()}, consider these factors:
            • Down payment requirements
            • Monthly payments
            • Property taxes and insurance
            • PMI if down payment is less than 20%
            
            Use our Mortgage Calculator to get detailed estimates: <link>mortgage</link>`;
            
            return response;
        }

        // Retirement planning
        if (lowerMessage.includes('retire') || lowerMessage.includes('fire')) {
            let response = `For retirement planning, consider using our FIRE Calculator. It will help you:
            • Calculate your retirement corpus needed
            • Plan your investments
            • Account for inflation
            • Estimate post-retirement expenses
            
            Click here to plan your retirement: <link>fire</link>`;
            
            return response;
        }

        // Tax planning
        if (lowerMessage.includes('tax')) {
            let response = `Our Tax Calculator can help you:
            • Estimate federal and state taxes
            • Calculate effective tax rate
            • Plan deductions and credits
            • Optimize your tax savings
            
            Use the Tax Calculator here: <link>tax</link>`;
            
            return response;
        }

        // Default response for other financial queries
        return `I can help you calculate and plan your finances. Would you like to:
        1. Calculate investment returns
        2. Plan a loan or mortgage
        3. Estimate taxes
        4. Plan for retirement
        
        Just let me know your specific financial goal, and I'll guide you to the right calculator and provide personalized advice.`;
    };

    const formatResponse = (response) => {
        // Replace link tags with actual links
        return response.replace(/<link>(.*?)<\/link>/g, (match, calculator) => {
            const path = getCalculatorLink(calculator);
            if (path) {
                return `[Click to open ${calculator.toUpperCase()} Calculator](${path})`;
            }
            return match;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { type: 'user', content: userMessage }]);
        setIsLoading(true);

        try {
            const aiResponse = await generateAIResponse(userMessage);
            const formattedResponse = formatResponse(aiResponse);
            setMessages(prev => [...prev, { 
                type: 'bot', 
                content: formattedResponse
            }]);
        } catch (error) {
            console.error('Error:', error);
            setMessages(prev => [...prev, { 
                type: 'bot', 
                content: 'I apologize, but I encountered an error. Please try again.' 
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const renderMessage = (message) => {
        // Convert markdown-style links to actual links
        const content = message.content.replace(/\[(.*?)\]\((.*?)\)/g, (match, text, url) => {
            return (
                <Link href={url} className="text-blue-600 hover:text-blue-800 inline-flex items-center gap-1">
                    <Calculator className="w-4 h-4" />
                    {text}
                </Link>
            );
        });

        return (
            <div className={`p-2 rounded-lg ${
                message.type === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-800'
            }`}>
                <p className="whitespace-pre-wrap">{content}</p>
            </div>
        );
    };

    return (
        <div className="max-w-4xl mx-auto p-4 bg-white rounded-lg shadow-lg">
            <div className="mb-4">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <Bot className="text-blue-600" />
                    Financial Assistant
                </h2>
            </div>
            
            <div className="h-[500px] flex flex-col">
                <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`flex items-start gap-2 max-w-[80%] ${
                                message.type === 'user' 
                                    ? 'flex-row-reverse' 
                                    : 'flex-row'
                            }`}>
                                {renderMessage(message)}
                                {message.type === 'user' ? (
                                    <User className="w-6 h-6 text-gray-600" />
                                ) : (
                                    <Bot className="w-6 h-6 text-blue-600" />
                                )}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="bg-gray-100 p-4 rounded-lg">
                                <div className="flex space-x-2">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <form onSubmit={handleSubmit} className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask about investments, loans, taxes, or retirement..."
                        className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default FinanceChat; 