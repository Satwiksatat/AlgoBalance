// File: /client/src/components/AlgorithmInfo.js
import React, { useState } from 'react';
import Modal from './Modal';
import { ALGO_DETAILS } from '../algorithms';

const AlgorithmInfo = ({ algoKey, metrics }) => {
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
    
        let chatHistory = { user: "user", response_mode:"blocking", inputs: { query: prompt } };
        // const payload = { contents: chatHistory };
        const apiKey = "app-KyPmXcKemwcLTFeCjtW7wxqL";
        const apiUrl = 'http://172.16.3.123:80/v1/completion-messages';

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json',
                           'Authorization': `Bearer ${apiKey}`
                 },
                body: JSON.stringify(chatHistory)
            });
            const result = await response.json();
            // console.error(result);
            if (result.answer) {
                setExplanation(result.answer);
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
        <div className="bg-white p-4 rounded-lg shadow-md border">
            <h2 className="text-xl font-bold text-gray-800 mb-2">{info.name}</h2>
            
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