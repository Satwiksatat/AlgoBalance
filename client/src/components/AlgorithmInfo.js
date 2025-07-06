// File: /client/src/components/AlgorithmInfo.js
import React, { useState } from 'react';
import Modal from './Modal';
import { ALGORITHMS } from '../constants'; // Import ALGORITHMS array

const AlgorithmInfo = ({ algorithm }) => { // Now receives the full algorithm object as 'algorithm'
    const [explanation, setExplanation] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

    // Use the passed 'algorithm' object directly
    if (!algorithm) return null;

    const fetchExplanation = async () => {
        setIsLoading(true);
        setShowModal(true);
        setExplanation("");

        const prompt = `Please provide a simple, line-by-line explanation of the following sorting algorithm pseudocode for a beginner. Explain what each line does in simple terms.

Pseudocode:
---
${algorithm.pseudocode.join('\n')}
---`;

        // NOTE: Your original API key and URL were specific to an internal network.
        // For this to work in a general environment, you'd need a publicly accessible
        // Gemini API endpoint and a valid API key. I'm reverting to the standard
        // Gemini API URL and an empty API key (which Canvas provides at runtime).
        let chatHistory = { contents: [{ role: "user", parts: [{ text: prompt }] }] };
        const apiKey = ""; // Leave as empty string for Canvas to provide at runtime
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(chatHistory)
            });
            const result = await response.json();

            if (result.candidates && result.candidates.length > 0 &&
                result.candidates[0].content && result.candidates[0].content.parts &&
                result.candidates[0].content.parts.length > 0) {
                setExplanation(result.candidates[0].content.parts[0].text);
            } else {
                setExplanation("Sorry, I couldn't generate an explanation at this time. Unexpected API response structure.");
            }
        } catch (error) {
            console.error("Error fetching explanation:", error);
            setExplanation("An error occurred while fetching the explanation. Please check the console.");
        } finally {
            setIsLoading(false);
        }
    };

    const stabilityClass = algorithm.stable ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
    return (
        <div className="bg-white p-4 rounded-lg shadow-md border">
            <h2 className="text-xl font-bold text-gray-800 mb-2">{algorithm.name}</h2>

            {/* Metrics are not directly relevant for the info modal's primary purpose (explanation),
                so they are commented out or can be removed if not needed here.
            <div className="flex justify-around bg-gray-50 p-2 rounded-lg mb-3">
                <div className="text-center">
                    <p className="text-sm text-gray-500">Comparisons</p>
                    <p className="text-2xl font-bold text-blue-600">{metrics.comparisons}</p>
                </div>
                 <div className="text-center">
                    <p className="text-sm text-gray-500">Swaps</p>
                    <p className="text-2xl font-bold text-red-600">{metrics.swaps}</p>
                </div>
            </div>
            */}

            <div className="flex items-center gap-4 mb-3 flex-wrap">
                <p className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{algorithm.complexity}</p>
                <span className={`text-sm font-semibold px-2 py-1 rounded-full ${stabilityClass}`}>{algorithm.stable ? 'Stable' : 'Unstable'}</span>
            </div>
            <p className="text-gray-600 text-sm mb-4">{algorithm.description}</p>
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
            <Modal show={showModal} onClose={() => setShowModal(false)} title={`Explanation for ${algorithm.name}`}>
                 <div className="prose max-w-none">
                    {isLoading ? <p>Generating explanation...</p> : <div dangerouslySetInnerHTML={{__html: explanation.replace(/\n/g, '<br />')}}/>}
                 </div>
            </Modal>
        </div>
    )
};

export default AlgorithmInfo;
