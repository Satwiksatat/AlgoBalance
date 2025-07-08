// File: /client/src/components/Controls.js
import React from 'react';
import { ALGORITHMS } from '../constants';

const Controls = ({ 
    onGenerateRandom, onGenerateCustom, customInput, onCustomInputChange, 
    onSort, onPause, onResume, onStep, onStop, 
    algorithm1, onAlgoChange1, algorithm2, onAlgoChange2, 
    isSorting, isPaused, speed, onSpeedChange, 
    isCompareMode, onCompareModeChange, isColorBlindMode, onColorBlindModeChange,
    arraySize, onArraySizeChange
}) => {
    
    const ToggleSwitch = ({ label, checked, onChange }) => (
        <label className="flex items-center cursor-pointer">
            <span className="mr-3 text-sm font-medium text-gray-900">{label}</span>
            <div className="relative">
                <input type="checkbox" className="sr-only" checked={checked} onChange={e => onChange(e.target.checked)} disabled={isSorting} />
                <div className={`block w-14 h-8 rounded-full transition ${checked ? 'bg-blue-600' : 'bg-gray-600'}`}></div>
                <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition transform ${checked ? 'translate-x-full' : ''}`}></div>
            </div>
        </label>
    );
    
    return (
        <div className="bg-white p-4 rounded-lg shadow-md mb-4 space-y-4">
            {/* Top Row: Main Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div className="flex items-center gap-4 flex-wrap">
                    <select value={algorithm1} onChange={(e) => onAlgoChange1(e.target.value)} disabled={isSorting} className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-200">
                        {Object.entries(ALGORITHMS).map(([key, name]) => (<option key={key} value={key}>{name}</option>))}
                    </select>
                    {isCompareMode && (
                        <select value={algorithm2} onChange={(e) => onAlgoChange2(e.target.value)} disabled={isSorting} className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:bg-gray-200">
                            {Object.entries(ALGORITHMS).map(([key, name]) => (<option key={key} value={key}>{name}</option>))}
                        </select>
                    )}
                </div>

                <div className="flex items-center gap-4 flex-wrap justify-center">
                    {!isSorting ? (
                        <button onClick={onSort} className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition-colors">Sort!</button>
                    ) : isPaused ? (
                        <button onClick={onResume} className="px-4 py-2 bg-yellow-500 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-600 transition-colors">Resume</button>
                    ) : (
                        <button onClick={onPause} className="px-4 py-2 bg-yellow-500 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-600 transition-colors">Pause</button>
                    )}
                    {isSorting && (
                        <button onClick={onStop} className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition-colors">Stop</button>
                    )}
                    <button onClick={onStep} disabled={!isPaused} className="px-4 py-2 bg-indigo-500 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-600 disabled:bg-gray-400 transition-colors">Step</button>
                    <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-700">Speed</span>
                        <input type="range" min="10" max="500" step="10" value={510 - speed} onChange={(e) => onSpeedChange(510 - e.target.value)} disabled={isSorting && !isPaused} className="w-24 cursor-pointer"/>
                    </div>
                </div>

                <div className="flex items-center gap-4 justify-end">
                    <ToggleSwitch label="Color-Blind" checked={isColorBlindMode} onChange={onColorBlindModeChange} />
                    <ToggleSwitch label="Compare" checked={isCompareMode} onChange={onCompareModeChange} />
                </div>
            </div>

            {/* Bottom Row: Data Input */}
            <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
                {/* Random Array Generation */}
                <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-700">Size</span>
                    <input 
                        type="range" 
                        min="5" 
                        max={isCompareMode ? 30 : 70} 
                        step="5" 
                        value={arraySize} 
                        onChange={(e) => onArraySizeChange(Number(e.target.value))} 
                        disabled={isSorting} 
                        className="w-24 cursor-pointer"
                    />
                    {/* New input for direct number entry */}
                    <input
                        type="number"
                        min="5"
                        max={isCompareMode ? 30 : 70}
                        value={arraySize}
                        onChange={(e) => onArraySizeChange(Number(e.target.value))}
                        disabled={isSorting}
                        className="w-20 px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-200"
                    />
                    <button onClick={onGenerateRandom} disabled={isSorting} className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors">Generate Random</button>
                </div>

                {/* Custom Array Input */}
                <div className="flex items-center gap-2 flex-grow">
                     <input 
                        type="text"
                        value={customInput}
                        onChange={(e) => onCustomInputChange(e.target.value)}
                        disabled={isSorting}
                        placeholder="e.g. 8, 4, 23, 42, 16, 4"
                        className="px-3 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-200"
                     />
                     <button onClick={onGenerateCustom} disabled={isSorting} className="px-4 py-2 bg-gray-600 text-white font-semibold rounded-lg shadow-md hover:bg-gray-700 disabled:bg-gray-400">Use Data</button>
                </div>
            </div>
        </div>
    );
};

export default Controls;