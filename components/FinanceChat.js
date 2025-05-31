'use client';
import { useState, useCallback } from 'react';
import { MessageCircle, AlertCircle } from 'lucide-react';

export default function FinanceChat() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput('');
        setIsLoading(true);
        setError(null);

        // Add user message to chat
        const newMessages = [...messages, { role: 'user', content: userMessage }];
        setMessages(newMessages);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages: newMessages,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.details || 'Failed to get response');
            }

            // Handle streaming response
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let assistantMessage = '';

            // Add an initial assistant message that we'll update
            setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                if (chunk) {
                    assistantMessage += chunk;
                    // Update the last message (assistant's message) with the new content
                    setMessages(prev => {
                        const updated = [...prev];
                        updated[updated.length - 1] = {
                            role: 'assistant',
                            content: assistantMessage,
                        };
                        return updated;
                    });
                }
            }
        } catch (error) {
            console.error('Error:', error);
            setError(error.message);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: `I apologize, but I encountered an error: ${error.message}. Please try again.`,
            }]);
        } finally {
            setIsLoading(false);
        }
    }, [input, isLoading, messages]);

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
            <div className="flex items-center gap-2 mb-6">
                <MessageCircle className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-800">Financial Assistant (Powered by Gemini)</h2>
            </div>

            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-red-700 font-semibold">Error</p>
                        <p className="text-red-600">{error}</p>
                    </div>
                </div>
            )}

            <div className="space-y-4 mb-4 max-h-[400px] overflow-y-auto">
                {messages.length === 0 && (
                    <div className="p-4 rounded-lg bg-blue-50 text-blue-800">
                        <p className="font-semibold mb-2">Welcome to your Financial Assistant! 👋</p>
                        <p>I can help you with:</p>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                            <li>Investment calculations and strategies</li>
                            <li>Tax planning and optimization</li>
                            <li>Retirement planning (FIRE, pension)</li>
                            <li>Loan and mortgage calculations</li>
                            <li>General financial advice</li>
                        </ul>
                        <p className="mt-2">How can I assist you today?</p>
                    </div>
                )}
                {messages.map((message, i) => (
                    <div
                        key={i}
                        className={`p-4 rounded-lg ${
                            message.role === 'assistant'
                                ? 'bg-blue-50 text-blue-800'
                                : 'bg-gray-50 text-gray-800'
                        }`}
                    >
                        <p className="text-sm font-semibold mb-1">
                            {message.role === 'assistant' ? 'AI Assistant' : 'You'}
                        </p>
                        <p className="whitespace-pre-wrap">{message.content}</p>
                    </div>
                ))}
                {isLoading && (
                    <div className="p-4 rounded-lg bg-blue-50">
                        <div className="animate-pulse flex space-x-2">
                            <div className="h-2 w-2 bg-blue-400 rounded-full"></div>
                            <div className="h-2 w-2 bg-blue-400 rounded-full"></div>
                            <div className="h-2 w-2 bg-blue-400 rounded-full"></div>
                        </div>
                    </div>
                )}
            </div>

            <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about financial calculations, investment strategies, or tax planning..."
                    className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    type="submit"
                    disabled={isLoading}
                    className={`px-4 py-2 bg-blue-600 text-white rounded-md ${
                        isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
                    }`}
                >
                    Send
                </button>
            </form>
        </div>
    );
} 