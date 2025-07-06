// File: client/src/components/AlgorithmPanel.js

import React from 'react';
import Visualizer from './Visualizer';
// ALGORITHMS is only needed if you want to look up algorithm details here,
// but since 'selectedAlgorithm' is passed as a full object, it's not strictly needed.
// import { ALGORITHMS } from '../constants'; // Keeping this commented out for now

export default function AlgorithmPanel({
  array,
  highlights,
  selectedAlgorithm, // This is the full algorithm object passed from App.js
  metrics,
  callLog,
  pseudocodeLine,
  currentCallLogIndex,
  onShowInfo // Function to open the info modal for this algorithm
}) {
  // Defensive check: If no algorithm is selected or found, render a placeholder.
  if (!selectedAlgorithm) {
    return (
      <div className="flex flex-col gap-6 bg-white p-4 rounded-lg shadow-lg w-full h-[700px]"> {/* Fixed height for panel */}
        <div className="bg-white p-4 rounded-lg shadow-md border text-center text-gray-500 flex-1 flex items-center justify-center">
          Please select an algorithm to view its details and visualization.
        </div>
      </div>
    );
  }

  // Destructure properties directly from the selectedAlgorithm object
  const { name, complexity, stable, description, pseudocode } = selectedAlgorithm;

  // Determine stability class for styling
  const stabilityClass = stable ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";

  return (
    // Main container for the AlgorithmPanel.
    // Using flex-col to stack Visualizer and Algorithm Info vertically.
    // Added a fixed height (e.g., h-[700px]) to ensure this panel occupies a consistent space.
    // This height should be sufficient to contain both the Visualizer and AlgorithmInfo sections without overflow.
    <div className="flex flex-col gap-6 bg-white p-4 rounded-lg shadow-lg w-full h-[700px]"> {/* Adjusted height */}
      {/* Visualizer Component: This will display the bars, pseudocode, and call stack. */}
      {/* It will manage its own internal layout and scrolling. */}
      <Visualizer
        array={array}
        highlights={highlights}
        callLog={callLog}
        pseudocode={pseudocode || []} // Pass pseudocode array
        pseudocodeLine={pseudocodeLine} // Pass active pseudocode line
        currentStepIndex={currentCallLogIndex} // Pass current call log index for highlighting
      />

      {/* Algorithm Info Display: This section shows algorithm details and metrics. */}
      {/* It will take up the remaining space in the AlgorithmPanel. */}
      <div className="bg-white p-4 rounded-lg shadow-md border flex-1 flex flex-col"> {/* Added flex-1 and flex-col */}
        <h2 className="text-xl font-bold text-gray-800 mb-2">{name}</h2>

        <div className="flex justify-around bg-gray-50 p-2 rounded-lg mb-3 shrink-0"> {/* shrink-0 for metrics */}
          <div className="text-center">
            <p className="text-sm text-gray-500">Comparisons</p>
            <p className="text-2xl font-bold text-blue-600">{metrics.comparisons}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">Swaps</p>
            <p className="text-2xl font-bold text-red-600">{metrics.swaps}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-3 flex-wrap shrink-0"> {/* shrink-0 for complexity/stability */}
            <p className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{complexity}</p>
            <span className={`text-sm font-semibold px-2 py-1 rounded-full ${stabilityClass}`}>
                {stable ? 'Stable' : 'Unstable'}
            </span>
        </div>
        {/* Description can grow, but if it gets too long, it should scroll. */}
        <p className="text-gray-600 text-sm mb-4 flex-1 overflow-auto"> {/* flex-1 and overflow-auto for description */}
          {description}
        </p>
        <button
            onClick={onShowInfo} // Call the passed onShowInfo function
            className="w-full px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 disabled:bg-gray-400 flex items-center justify-center gap-2 transition-colors shrink-0"
        >
            ✨ Explain this Code
        </button>
      </div>
    </div>
  );
}
