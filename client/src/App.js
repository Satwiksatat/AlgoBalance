// File: /client/src/App.js
import React, { useState, useEffect, useRef, useCallback } from 'react';

// Import components
import Controls from './components/Controls';
import Visualizer from './components/Visualizer';
import AlgorithmInfo from './components/AlgorithmInfo';
import Pseudocode from './components/Pseudocode';

// Import helpers and constants
import { generateVisualizerArray } from './helpers/arrayManager';
import { ALGO_FUNCTIONS, ALGO_DETAILS } from './algorithms';

function App() {
  const [array, setArray] = useState([]);
  const [algorithm, setAlgorithm] = useState('bubbleSort');
  const [isSorting, setIsSorting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(100);
  const [highlights, setHighlights] = useState({});
  const [nextStep, setNextStep] = useState(0); 
  const sorter = useRef(null);
  const timeoutId = useRef(null);

  const handleGenerateArray = useCallback(() => {
    clearTimeout(timeoutId.current);
    setIsSorting(false);
    setIsPaused(false);
    setHighlights({});
    sorter.current = null;
    setArray(generateVisualizerArray());
  }, []);
  
  useEffect(() => {
    handleGenerateArray();
  }, [handleGenerateArray]);

  const runAnimationStep = useCallback(() => {
    if (!sorter.current) return;
    const { value, done } = sorter.current.next();

    if (done) {
      setIsSorting(false);
      setIsPaused(false);
      setHighlights({ sortedIndices: Array.from(Array(value.length).keys()) });
      setArray(value);
    } else {
      setArray(value.array);
      setHighlights({ comparing: value.comparing, swapping: value.swapping, pivot: value.pivot, line: value.line });
      setNextStep(step => step + 1);
    }
  }, []);

  useEffect(() => {
    if (isSorting && !isPaused) {
      timeoutId.current = setTimeout(runAnimationStep, speed);
    }
    return () => {
      clearTimeout(timeoutId.current);
    };
  }, [isSorting, isPaused, speed, nextStep, runAnimationStep]);

  const handleSort = () => {
    const algoFn = ALGO_FUNCTIONS[algorithm];
    sorter.current = algoFn([...array]);
    setIsSorting(true);
    setIsPaused(false);
    setNextStep(1);
  };
  
  const handlePause = () => setIsPaused(true);
  
  const handleResume = () => {
    setIsPaused(false);
    setNextStep(step => step + 1);
  };
  
  const handleStep = () => {
     if (!sorter.current) return;
     runAnimationStep();
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-screen-xl mx-auto">
        <header className="text-center mb-6">
          <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">Sorting Algorithm Stability Visualizer</h1>
          <p className="mt-2 text-lg text-gray-600">An interactive tool to understand how sorting algorithms handle duplicate elements.</p>
        </header>

        <main>
          <Controls 
            onGenerate={handleGenerateArray} 
            onSort={handleSort} 
            onPause={handlePause} 
            onResume={handleResume} 
            onStep={handleStep} 
            onAlgoChange={setAlgorithm} 
            isSorting={isSorting} 
            isPaused={isPaused} 
            algorithm={algorithm} 
            speed={speed} 
            onSpeedChange={setSpeed}
          />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
            <div className="lg:col-span-2">
              <Visualizer array={array} highlights={highlights} />
            </div>
            <div className="flex flex-col gap-6">
              <AlgorithmInfo algoKey={algorithm} />
              <Pseudocode code={ALGO_DETAILS[algorithm]?.pseudocode || []} activeLine={highlights.line}/>
            </div>
          </div>
        </main>
        
        <footer className="text-center mt-8 text-sm text-gray-500">
            <p>Built based on the research paper "Visualizing Stability in Comparison Sorting Algorithms".</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
