
import React, { useState } from 'react';
import { createAutomationRuleFromText } from '../../services/geminiService';
import type { AutomationRule } from '../../types';

interface AutomationProps {
    automationRules: AutomationRule[];
    setAutomationRules: React.Dispatch<React.SetStateAction<AutomationRule[]>>;
}

export const Automation: React.FC<AutomationProps> = ({ automationRules, setAutomationRules }) => {
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleCreateRule = async () => {
        if (!prompt.trim()) {
            setError('Please enter a description for the automation rule.');
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const parsedRule = await createAutomationRuleFromText(prompt);
            const newRule: AutomationRule = {
                id: `rule-${Date.now()}`,
                naturalLanguage: prompt,
                ...parsedRule
            };
            setAutomationRules(prev => [...prev, newRule]);
            setPrompt('');
        } catch (err: any) {
            setError(err.message || 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white">AI Automation</h1>
            
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold mb-4 text-white">Create a New Rule</h2>
                <p className="text-gray-400 mb-4">
                    Describe what you want to happen in plain English. For example: "If the sun sets and someone is home, turn on the living room lights."
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                    <input
                        type="text"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="e.g., Turn on kitchen light at 7 AM"
                        className="flex-grow bg-gray-700 border border-gray-600 rounded-md px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleCreateRule}
                        disabled={isLoading}
                        className="bg-brand-blue text-white font-bold py-2 px-6 rounded-md hover:bg-brand-blue-light transition-colors duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Creating...' : 'Create Rule'}
                    </button>
                </div>
                {error && <p className="text-red-500 mt-3">{error}</p>}
            </div>

            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold mb-4 text-white">Existing Rules</h2>
                {automationRules.length > 0 ? (
                    <ul className="space-y-4">
                        {automationRules.map(rule => (
                            <li key={rule.id} className="bg-gray-700 p-4 rounded-md">
                                <p className="font-semibold text-white">{rule.naturalLanguage}</p>
                                <div className="text-sm text-gray-400 mt-2 flex items-center gap-2 flex-wrap">
                                    <span className="font-mono bg-gray-600 px-2 py-1 rounded-md">
                                        TRIGGER: {rule.trigger.type} ({rule.trigger.value})
                                    </span>
                                    <span>&rarr;</span>
                                    <span className="font-mono bg-gray-600 px-2 py-1 rounded-md">
                                        ACTION: {rule.action.command} on {rule.action.deviceId}
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">You haven't created any automation rules yet.</p>
                )}
            </div>
        </div>
    );
};
