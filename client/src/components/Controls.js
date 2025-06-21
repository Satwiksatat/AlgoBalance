// File: /client/src/components/Controls.js
import React from 'react';
import { ALGORITHMS } from '../constants';

const Controls = ({ onGenerate, onSort, onPause, onResume, onStep, onAlgoChange, isSorting, isPaused, algorithm, onSpeedChange, speed }) => (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-wrap">
            <button onClick={onGenerate} disabled={isSorting} className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors">New Array</button>
            <select value={algorithm} onChange={(e) => onAlgoChange(e.target.value)} disabled={isSorting} className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-200">
                {Object.entries(ALGORITHMS).map(([key, name]) => (<option key={key} value={key}>{name}</option>))}
            </select>
        </div>
        <div className="flex items-center gap-4 flex-wrap">
            {!isSorting ? <button onClick={onSort} className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition-colors">Sort!</button> : isPaused ? <button onClick={onResume} className="px-4 py-2 bg-yellow-500 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-600 transition-colors">Resume</button> : <button onClick={onPause} className="px-4 py-2 bg-yellow-500 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-600 transition-colors">Pause</button>}
            <button onClick={onStep} disabled={!isPaused} className="px-4 py-2 bg-indigo-500 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-600 disabled:bg-gray-400 transition-colors">Step</button>
        </div>
        <div className="flex items-center gap-2">
            <span className="font-medium text-gray-700">Speed</span>
            <input type="range" min="10" max="500" step="10" value={510 - speed} onChange={(e) => onSpeedChange(510 - e.target.value)} disabled={isSorting && !isPaused} className="w-32 cursor-pointer"/>
        </div>
    </div>
);

export default Controls;