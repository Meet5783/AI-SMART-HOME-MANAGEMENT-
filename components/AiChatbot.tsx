import React, { useState, useRef, useEffect, useCallback } from 'react';
import { initChat } from '../services/geminiService';
import type { ChatMessage, Device } from '../types';
import type { Chat, GenerateContentResponse } from '@google/genai';
import { MicrophoneIcon, SparklesIcon } from './icons';

interface AiChatbotProps {
    devices: Device[];
}

// Browser SpeechRecognition API setup
const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
let recognition: any | null = null;
if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
}

export const NexaAiChatbot: React.FC<AiChatbotProps> = ({ devices }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const chatRef = useRef<Chat | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        chatRef.current = initChat(devices);
        setMessages([
            { id: 'initial', sender: 'ai', text: "Hello! I am Nexa, your AI assistant. How can I help you manage your smart home?" }
        ]);
    }, [devices]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = useCallback(async () => {
        if (!userInput.trim() || !chatRef.current || isLoading) return;

        const newUserMessage: ChatMessage = { id: `user-${Date.now()}`, sender: 'user', text: userInput };
        const loadingMessage: ChatMessage = { id: `ai-loading-${Date.now()}`, sender: 'ai', text: '', isLoading: true };
        
        setMessages(prev => [...prev, newUserMessage, loadingMessage]);
        setUserInput('');
        setIsLoading(true);

        try {
            const response: GenerateContentResponse = await chatRef.current.sendMessage({ message: userInput });
            const aiResponseText = response.text;
            
            const newAiMessage: ChatMessage = { id: `ai-${Date.now()}`, sender: 'ai', text: aiResponseText };
            setMessages(prev => {
                const newMessages = prev.filter(msg => !msg.isLoading);
                return [...newMessages, newAiMessage];
            });

        } catch (error) {
            console.error("Chat error:", error);
            const errorMessage: ChatMessage = { id: `ai-error-${Date.now()}`, sender: 'ai', text: "Sorry, I encountered an error. Please check your internet connection and try again." };
            setMessages(prev => {
                const newMessages = prev.filter(msg => !msg.isLoading);
                return [...newMessages, errorMessage];
            });
        } finally {
            setIsLoading(false);
        }
    }, [userInput, isLoading]);

    const handleListen = () => {
        if (!recognition) {
            const errorMessage: ChatMessage = { id: `ai-error-${Date.now()}`, sender: 'ai', text: "Sorry, your browser doesn't support speech recognition." };
            setMessages(prev => [...prev, errorMessage]);
            return;
        }
        if (isListening) {
            recognition.stop();
            setIsListening(false);
            return;
        }

        setIsListening(true);
        recognition.start();

        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setUserInput(transcript);
        };
        
        recognition.onerror = (event: any) => {
            console.error('Speech recognition error:', event.error);
            let errorText = "An error occurred during speech recognition. Please try again.";
            if (event.error === 'no-speech') {
                errorText = "I didn't hear anything. Please try again.";
            } else if (event.error === 'not-allowed') {
                errorText = "Microphone access is required. Please enable it in your browser settings.";
            }
            const errorMessage: ChatMessage = { id: `ai-error-${Date.now()}`, sender: 'ai', text: errorText };
            setMessages(prev => [...prev, errorMessage]);
            setIsListening(false);
        };
        
        recognition.onend = () => {
            setIsListening(false);
        };
    };

    const chatBubble = (msg: ChatMessage) => {
        const isUser = msg.sender === 'user';
        
        const baseBubbleStyles = 'max-w-[80%] px-4 py-3 rounded-xl shadow-md';
        const userBubbleStyles = 'bg-brand-blue text-white rounded-br-sm';
        const aiBubbleStyles = 'bg-gray-700 text-gray-200 rounded-bl-sm';

        return (
            <div key={msg.id} className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}>
                <div className={`${baseBubbleStyles} ${isUser ? userBubbleStyles : aiBubbleStyles}`}>
                    {msg.isLoading ? (
                        <div className="flex items-center space-x-1.5 py-1">
                            <span className="h-2 w-2 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                            <span className="h-2 w-2 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                            <span className="h-2 w-2 bg-gray-300 rounded-full animate-bounce"></span>
                        </div>
                    ) : (
                        <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                    )}
                </div>
            </div>
        );
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 bg-brand-blue text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center hover:bg-brand-blue-light transition-all duration-300 z-50"
                aria-label={isOpen ? "Close AI Assistant" : "Open AI Assistant"}
            >
                {isOpen ? (
                     <svg xmlns="http://www.w.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                ) : (
                    <SparklesIcon className="h-8 w-8" />
                )}
            </button>

            {isOpen && (
                <div className="fixed bottom-24 right-6 w-full max-w-sm h-[70vh] max-h-[600px] bg-gray-800 rounded-xl shadow-2xl flex flex-col z-40 overflow-hidden border border-gray-700">
                    <header className="bg-gray-900 p-4 text-white font-bold text-center">
                        Nexa AI Assistant
                    </header>
                    <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                        {messages.map(msg => chatBubble(msg))}
                        <div ref={messagesEndRef} />
                    </div>
                    <div className="p-4 border-t border-gray-700">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                placeholder="Ask or just speak..."
                                className="flex-grow bg-gray-700 border border-gray-600 rounded-full px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                                disabled={isLoading}
                            />
                             <button 
                                onClick={handleListen} 
                                disabled={isLoading || !recognition} 
                                className={`bg-gray-700 text-white rounded-full p-2 w-10 h-10 flex-shrink-0 flex items-center justify-center transition-colors
                                    ${isListening ? 'bg-red-500 animate-pulse' : 'hover:bg-gray-600'}
                                    disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed`}
                                aria-label="Use microphone"
                            >
                                <MicrophoneIcon className="h-5 w-5" />
                            </button>
                            <button onClick={handleSendMessage} disabled={isLoading || !userInput.trim()} className="bg-brand-blue text-white rounded-full p-2 w-10 h-10 flex-shrink-0 flex items-center justify-center hover:bg-brand-blue-light disabled:bg-gray-600 disabled:cursor-not-allowed">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
