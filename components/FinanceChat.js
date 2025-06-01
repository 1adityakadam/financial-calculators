'use client';
import { useState, useCallback, useEffect } from 'react';
import { MessageCircle, AlertCircle, Trash2 } from 'lucide-react';
import { saveChatMessage } from '../utils/chatStorage';
import { supabase } from '../lib/supabase';

export default function FinanceChat({ isDarkMode }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [lastMessageTime, setLastMessageTime] = useState(0);
    const [spamWarnings, setSpamWarnings] = useState(0);
    const [isBlocked, setIsBlocked] = useState(false);
    const [userId, setUserId] = useState('');

    // Generate or retrieve user ID on component mount
    useEffect(() => {
        let storedUserId = localStorage.getItem('financeChat_userId');
        if (!storedUserId) {
            storedUserId = `user_${Math.random().toString(36).substr(2, 9)}_${Date.now()}`;
            localStorage.setItem('financeChat_userId', storedUserId);
        }
        setUserId(storedUserId);
    }, []);

    // Load messages from localStorage on component mount
    useEffect(() => {
        if (userId) {
            const savedMessages = localStorage.getItem(`financeChat_messages_${userId}`);
            if (savedMessages) {
                setMessages(JSON.parse(savedMessages));
            }
        }
    }, [userId]);

    // Save messages to localStorage whenever they change
    useEffect(() => {
        if (userId) {
            localStorage.setItem(`financeChat_messages_${userId}`, JSON.stringify(messages));
        }
    }, [messages, userId]);

    const handleClearHistory = useCallback(() => {
        setMessages([]);
        if (userId) {
            localStorage.removeItem(`financeChat_messages_${userId}`);
        }
    }, [userId]);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading || isBlocked) return;

        try {
            const currentTime = Date.now();
            const timeDiff = currentTime - lastMessageTime;

            // Spam check
            if (timeDiff < 2000) { // Less than 2 seconds
                if (spamWarnings >= 2) {
                    setIsBlocked(true);
                    setError("You have been blocked due to multiple spam attempts. Please refresh the page to continue.");
                    return;
                } else {
                    setSpamWarnings(prev => prev + 1);
                    setError(`Warning ${spamWarnings + 1}/2: Messages sent too quickly. Please wait a moment.`);
                    return;
                }
            }

            setLastMessageTime(currentTime);
            const userMessage = input.trim();
            setInput('');
            setIsLoading(true);
            setError(null);

            // Save user message to Supabase
            await saveChatMessage(userId, { message: userMessage }, 'user');

            // Add user message to chat
            const newMessages = [...messages, { role: 'user', content: userMessage }];
            setMessages(newMessages);

            // Get assistant response
            const response = await fetch('/api/finance-assistant', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: userMessage,
                    userId: userId,
                    history: messages
                })
            });

            if (!response.ok) {
                throw new Error('Failed to get response');
            }

            const data = await response.json();
            setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);

            // Save assistant response to Supabase
            await saveChatMessage(userId, { message: data.response }, 'assistant');

        } catch (error) {
            console.error('Error:', error);
            setError('Failed to process your request. Please try again.');
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: `I apologize, but I encountered an error: ${error.message}. Please try again.`,
            }]);
        } finally {
            setIsLoading(false);
        }
    }, [input, isLoading, messages, lastMessageTime, spamWarnings, isBlocked, userId]);

    return (
        <div className={`max-w-4xl mx-auto p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg transition-colors duration-200`}>
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <MessageCircle className={`w-6 h-6 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
                    <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                        Financial Assistant (Powered by Gemini)
                    </h2>
                </div>
                <button
                    onClick={handleClearHistory}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md ${
                        isDarkMode
                            ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    } transition-colors duration-200`}
                    title="Clear chat history"
                >
                    <Trash2 className="w-4 h-4" />
                    Clear History
                </button>
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
                    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-emerald-50 text-emerald-800'}`}>
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
                                ? isDarkMode 
                                    ? 'bg-gray-700 text-gray-200' 
                                    : 'bg-emerald-50 text-emerald-800'
                                : isDarkMode
                                    ? 'bg-gray-600 text-gray-200'
                                    : 'bg-gray-50 text-gray-800'
                        }`}
                    >
                        <p className={`text-sm font-semibold mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {message.role === 'assistant' ? 'AI Assistant' : 'You'}
                        </p>
                        <p className="whitespace-pre-wrap">{message.content}</p>
                    </div>
                ))}
                {isLoading && (
                    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-emerald-50'}`}>
                        <div className="animate-pulse flex space-x-2">
                            <div className={`h-2 w-2 ${isDarkMode ? 'bg-emerald-400' : 'bg-emerald-400'} rounded-full`}></div>
                            <div className={`h-2 w-2 ${isDarkMode ? 'bg-emerald-400' : 'bg-emerald-400'} rounded-full`}></div>
                            <div className={`h-2 w-2 ${isDarkMode ? 'bg-emerald-400' : 'bg-emerald-400'} rounded-full`}></div>
                        </div>
                    </div>
                )}
            </div>

            <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about financial calculations, investment strategies, or tax planning..."
                    className={`flex-1 p-2 border ${
                        isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-gray-200 focus:ring-emerald-400' 
                            : 'bg-white border-gray-300 text-gray-800 focus:ring-emerald-500'
                    } rounded-md focus:outline-none focus:ring-2 transition-colors duration-200`}
                />
                <button
                    type="submit"
                    disabled={isLoading}
                    className={`px-4 py-2 ${
                        isDarkMode
                            ? 'bg-emerald-500 hover:bg-emerald-600'
                            : 'bg-emerald-600 hover:bg-emerald-700'
                    } text-white rounded-md ${
                        isLoading ? 'opacity-50 cursor-not-allowed' : ''
                    } transition-colors duration-200`}
                >
                    Send
                </button>
            </form>
        </div>
    );
} 