// File: client/src/App.js

import React, { useState, useEffect, useRef, useCallback } from 'react';

// Import components
import Controls from './components/Controls';
import AlgorithmPanel from './components/AlgorithmPanel';

// Import helpers and constants
import { generateRandomArray, parseCustomArray } from './helpers/arrayManager';
import { ALGO_FUNCTIONS } from './algorithms';

function App() {
  // State for modes
  const [isCompareMode, setIsCompareMode]     = useState(false);
  const [isColorBlindMode, setIsColorBlindMode] = useState(false);

  // Panel 1 state
  const [array1,      setArray1]      = useState([]);
  const [algorithm1,  setAlgorithm1]  = useState('bubbleSort');
  const [highlights1, setHighlights1] = useState({});
  const [metrics1,    setMetrics1]    = useState({ comparisons: 0, swaps: 0 });
  const [callLog1,    setCallLog1]    = useState([]);
  const sorter1 = useRef(null);

  // Panel 2 state
  const [array2,      setArray2]      = useState([]);
  const [algorithm2,  setAlgorithm2]  = useState('quickSort');
  const [highlights2, setHighlights2] = useState({});
  const [metrics2,    setMetrics2]    = useState({ comparisons: 0, swaps: 0 });
  const [callLog2,    setCallLog2]    = useState([]);
  const sorter2 = useRef(null);

  // Shared controls
  const [customInput, setCustomInput] = useState('8, 4, 23, 42, 16, 4');
  const [isSorting,   setIsSorting]   = useState(false);
  const [isPaused,    setIsPaused]    = useState(false);
  const [speed,       setSpeed]       = useState(100);
  const [nextStep,    setNextStep]    = useState(0);
  const timeoutId = useRef(null);

  const resetSorting = useCallback(() => {
    clearTimeout(timeoutId.current);
    setIsSorting(false);
    setIsPaused(false);

    setHighlights1({});
    setMetrics1({ comparisons: 0, swaps: 0 });
    setCallLog1([]);

    setHighlights2({});
    setMetrics2({ comparisons: 0, swaps: 0 });
    setCallLog2([]);

    sorter1.current = null;
    sorter2.current = null;
  }, []);

  const setInitialArrays = useCallback((newArray) => {
    setArray1(newArray);
    setArray2(JSON.parse(JSON.stringify(newArray))); // deep copy
  }, []);

  const handleGenerateRandomArray = useCallback(() => {
    resetSorting();
    setInitialArrays(generateRandomArray(isColorBlindMode));
  }, [resetSorting, setInitialArrays, isColorBlindMode]);

  const handleGenerateCustomArray = useCallback(() => {
    resetSorting();
    setInitialArrays(parseCustomArray(customInput, isColorBlindMode));
  }, [customInput, resetSorting, setInitialArrays, isColorBlindMode]);

  useEffect(() => {
    handleGenerateRandomArray();
  }, [isColorBlindMode, handleGenerateRandomArray]);

  const runAnimationStep = useCallback(() => {
    let done1 = !sorter1.current;
    let done2 = !sorter2.current;

    // ─── Panel 1 ───
    if (sorter1.current) {
      const { value: event, done } = sorter1.current.next();
      if (!done) {
        if (event.type === 'call') {
          setCallLog1(prev => [...prev, event]);
        }
        // only update array when snapshot present
        if (event.array !== undefined) {
          setArray1(event.array);
        }
        setHighlights1({ ...event });
        setMetrics1({ comparisons: event.comparisons, swaps: event.swaps });
      } else {
        // final sorted state
        setArray1(event.value || []);
        sorter1.current = null;
        done1 = true;
      }
    }

    // ─── Panel 2 (compare mode) ───
    if (isCompareMode && sorter2.current) {
      const { value: event, done } = sorter2.current.next();
      if (!done) {
        if (event.type === 'call') {
          setCallLog2(prev => [...prev, event]);
        }
        if (event.array !== undefined) {
          setArray2(event.array);
        }
        setHighlights2({ ...event });
        setMetrics2({ comparisons: event.comparisons, swaps: event.swaps });
      } else {
        setArray2(event.value || []);
        sorter2.current = null;
        done2 = true;
      }
    }

    const allDone = done1 && (!isCompareMode || done2);
    if (allDone) {
      setIsSorting(false);
      setIsPaused(false);
    } else {
      setNextStep(s => s + 1);
    }
  }, [isCompareMode]);

  useEffect(() => {
    if (isSorting && !isPaused) {
      timeoutId.current = setTimeout(runAnimationStep, speed);
    }
    return () => clearTimeout(timeoutId.current);
  }, [isSorting, isPaused, speed, nextStep, runAnimationStep]);

  const handleSort = () => {
    resetSorting();
    sorter1.current = ALGO_FUNCTIONS[algorithm1]([...array1]);
    if (isCompareMode) {
      sorter2.current = ALGO_FUNCTIONS[algorithm2]([...array2]);
    }
    setIsSorting(true);
    setIsPaused(false);
    setNextStep(1);
  };

  const handlePause  = () => setIsPaused(true);
  const handleResume = () => { setIsPaused(false); setNextStep(s => s + 1); };
  const handleStep   = () => { if (!isSorting) return; runAnimationStep(); };

  return (
    <div className="bg-gray-50 min-h-screen font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-screen-2xl mx-auto">
        <header className="text-center mb-6">
          <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">
            Sorting Algorithm Stability Visualizer
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            An interactive tool to understand how sorting algorithms handle duplicate elements.
          </p>
        </header>

        <main>
          <Controls
            onGenerateRandom={handleGenerateRandomArray}
            onGenerateCustom={handleGenerateCustomArray}
            customInput={customInput}
            onCustomInputChange={setCustomInput}
            onSort={handleSort}
            onPause={handlePause}
            onResume={handleResume}
            onStep={handleStep}
            algorithm1={algorithm1}
            onAlgoChange1={setAlgorithm1}
            algorithm2={algorithm2}
            onAlgoChange2={setAlgorithm2}
            isSorting={isSorting}
            isPaused={isPaused}
            speed={speed}
            onSpeedChange={setSpeed}
            isCompareMode={isCompareMode}
            onCompareModeChange={setIsCompareMode}
            isColorBlindMode={isColorBlindMode}
            onColorBlindModeChange={setIsColorBlindMode}
          />

          <div className={`mt-4 grid gap-8 ${
            isCompareMode ? 'grid-cols-1 xl:grid-cols-2' : 'grid-cols-1'
          }`}>
            <AlgorithmPanel
              array={array1}
              highlights={highlights1}
              algoKey={algorithm1}
              metrics={metrics1}
              callLog={callLog1}
            />
            {isCompareMode && (
              <AlgorithmPanel
                array={array2}
                highlights={highlights2}
                algoKey={algorithm2}
                metrics={metrics2}
                callLog={callLog2}
              />
            )}
          </div>
        </main>

        <footer className="text-center mt-8 text-sm text-gray-500">
          <p>
            Built based on the research paper "Visualizing Stability in Comparison Sorting Algorithms".
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
