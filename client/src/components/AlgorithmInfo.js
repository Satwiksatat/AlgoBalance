// File: /client/src/components/AlgorithmInfo.js
import React, { useState } from 'react';
import Modal from './Modal';
import { ALGO_DETAILS } from '../algorithms';

const AlgorithmInfo = ({ algoKey }) => {
    const [explanation, setExplanation] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    
    const info = ALGO_DETAILS[algoKey];
    if (!info) return null;

    const fetchExplanation = async () => {
        setIsLoading(true);
        setShowModal(true);
        setExplanation("");

        const prompt = `Please provide a simple, line-by-line explanation of the following sorting algorithm pseudocode for a beginner. Explain what each line does in simple terms.

Pseudocode:
---
${info.pseudocode.join('\n')}
---`;
        
        let chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
        const payload = { contents: chatHistory };
        const apiKey = ""; // Remember to add your API key here
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const result = await response.json();
            if (result.candidates && result.candidates[0]?.content?.parts[0]?.text) {
                setExplanation(result.candidates[0].content.parts[0].text);
            } else {
                setExplanation("Sorry, I couldn't generate an explanation at this time.");
            }
        } catch (error) {
            console.error("Error fetching explanation:", error);
            setExplanation("An error occurred while fetching the explanation. Please check the console.");
        } finally {
            setIsLoading(false);
        }
    };


    const stabilityClass = info.stable ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
    return (
        <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-800 mb-2">{info.name}</h2>
            <div className="flex items-center gap-4 mb-3 flex-wrap">
                <p className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{info.complexity}</p>
                <span className={`text-sm font-semibold px-2 py-1 rounded-full ${stabilityClass}`}>{info.stable ? 'Stable' : 'Unstable'}</span>
            </div>
            <p className="text-gray-600 text-sm mb-4">{info.description}</p>
            <button onClick={fetchExplanation} disabled={isLoading} className="w-full px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 disabled:bg-gray-400 flex items-center justify-center gap-2 transition-colors">
                 {isLoading ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Generating...
                    </>
                ) : (
                    "✨ Explain this Code"
                )}
            </button>
            <Modal show={showModal} onClose={() => setShowModal(false)} title={`Explanation for ${info.name}`}>
                 <div className="prose max-w-none">
                    {isLoading ? <p>Generating explanation...</p> : <div dangerouslySetInnerHTML={{__html: explanation.replace(/\n/g, '<br />')}}/>}
                 </div>
            </Modal>
        </div>
    )
};

export default AlgorithmInfo;