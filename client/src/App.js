// File: /client/src/App.js
import React, { useState, useEffect, useRef, useCallback } from 'react';

// Import components
import Controls from './components/Controls';
import AlgorithmPanel from './components/AlgorithmPanel';

// Import helpers and constants
import { generateRandomArray, parseCustomArray } from './helpers/arrayManager';
import { ALGO_FUNCTIONS } from './algorithms';

function App() {
  // State for modes
  const [isCompareMode, setIsCompareMode] = useState(false);
  const [isColorBlindMode, setIsColorBlindMode] = useState(false);

  // State for Panel 1
  const [array1, setArray1] = useState([]);
  const [algorithm1, setAlgorithm1] = useState('bubbleSort');
  const [highlights1, setHighlights1] = useState({});
  const [metrics1, setMetrics1] = useState({ comparisons: 0, swaps: 0 });
  const [stack1, setStack1] = useState([]); // New state for call stack
  const sorter1 = useRef(null);

  // State for Panel 2
  const [array2, setArray2] = useState([]);
  const [algorithm2, setAlgorithm2] = useState('quickSort');
  const [highlights2, setHighlights2] = useState({});
  const [metrics2, setMetrics2] = useState({ comparisons: 0, swaps: 0 });
  const [stack2, setStack2] = useState([]); // New state for call stack
  const sorter2 = useRef(null);
  
  // Shared state
  const [customInput, setCustomInput] = useState('8, 4, 23, 42, 16, 4');
  const [isSorting, setIsSorting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(100);
  const [arraySize, setArraySize] = useState(20); // New state for array size
  const [nextStep, setNextStep] = useState(0); 
  const timeoutId = useRef(null);

  const resetSorting = useCallback(() => {
    clearTimeout(timeoutId.current);
    setIsSorting(false);
    setIsPaused(false);
    setHighlights1({});
    setHighlights2({});
    setMetrics1({ comparisons: 0, swaps: 0 });
    setMetrics2({ comparisons: 0, swaps: 0 });
    setStack1([]); // Reset stack
    setStack2([]); // Reset stack
    sorter1.current = null;
    sorter2.current = null;
  }, []);

  const setInitialArrays = useCallback((newArray) => {
    setArray1(newArray);
    setArray2(JSON.parse(JSON.stringify(newArray))); // Deep copy
  }, []);

  const handleGenerateRandomArray = useCallback(() => {
    resetSorting();
    setInitialArrays(generateRandomArray(isColorBlindMode, isCompareMode ? Math.min(arraySize, 30) : arraySize));
  }, [resetSorting, setInitialArrays, isColorBlindMode, arraySize]);

  const handleGenerateCustomArray = useCallback(() => {
      resetSorting();
      setInitialArrays(parseCustomArray(customInput, isColorBlindMode, isCompareMode ? 30 : null));
  }, [customInput, resetSorting, setInitialArrays, isColorBlindMode]);
  
  // Regenerate arrays if color-blind mode changes
  useEffect(() => {
    handleGenerateRandomArray();
  }, [isColorBlindMode, handleGenerateRandomArray]);

  const runAnimationStep = useCallback(() => {
    let sorter1Done = !sorter1.current;
    let sorter2Done = !sorter2.current;

    if (sorter1.current) {
        const res1 = sorter1.current.next();
        if (!res1.done) {
            setArray1(res1.value.array);
            setHighlights1({ ...res1.value });
            setMetrics1({ comparisons: res1.value.comparisons, swaps: res1.value.swaps });
            setStack1(prevStack => [...prevStack, ...(res1.value.stack || [])]);
        } else {
            setArray1(res1.value);
            setHighlights1({ sortedIndices: Array.from(Array(res1.value.length).keys()) });
            sorter1.current = null;
            sorter1Done = true;
        }
    }

    if (isCompareMode && sorter2.current) {
        const res2 = sorter2.current.next();
        if (!res2.done) {
            setArray2(res2.value.array);
            setHighlights2({ ...res2.value });
            setMetrics2({ comparisons: res2.value.comparisons, swaps: res2.value.swaps });
            setStack2(prevStack => [...prevStack, ...(res2.value.stack || [])]);
        } else {
             setArray2(res2.value);
             setHighlights2({ sortedIndices: Array.from(Array(res2.value.length).keys()) });
             sorter2.current = null;
             sorter2Done = true;
        }
    }

    const allSortersAreDone = sorter1Done && (!isCompareMode || sorter2Done);

    if (allSortersAreDone) {
      setIsSorting(false);
      setIsPaused(false);
    } else {
      setNextStep(step => step + 1);
    }
  }, [isCompareMode]);

  useEffect(() => {
    if (isSorting && !isPaused) {
      timeoutId.current = setTimeout(runAnimationStep, speed);
    }
    return () => clearTimeout(timeoutId.current);
  }, [isSorting, isPaused, speed, nextStep, runAnimationStep]);

  const handleSort = () => {
    resetSorting(); // Reset metrics before starting
    const algoFn1 = ALGO_FUNCTIONS[algorithm1];
    sorter1.current = algoFn1([...array1]);
    
    if (isCompareMode) {
        const algoFn2 = ALGO_FUNCTIONS[algorithm2];
        sorter2.current = algoFn2([...array2]);
    }

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
     if (!isSorting) return;
     runAnimationStep();
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-screen-2xl mx-auto">
        <header className="text-center mb-6">
          <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">Sorting Algorithm Stability Visualizer</h1>
          <p className="mt-2 text-lg text-gray-600">An interactive tool to understand how sorting algorithms handle duplicate elements.</p>
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
            onStop={resetSorting} 
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
            arraySize={arraySize}
            onArraySizeChange={(size) => setArraySize(Math.min(70, Math.max(5, size)))}
          />
          <div className={`mt-4 grid gap-8 ${isCompareMode ? 'grid-cols-1 xl:grid-cols-2' : 'grid-cols-1'}`}>
              <AlgorithmPanel 
                  array={array1}
                  highlights={highlights1}
                  algoKey={algorithm1}
                  metrics={metrics1}
                  stack={stack1} // Pass stack
                  isSorting={isSorting}
              />
              {isCompareMode && (
                  <AlgorithmPanel
                      array={array2}
                      highlights={highlights2}
                      algoKey={algorithm2}
                      metrics={metrics2}
                      stack={stack2} // Pass stack
                      isSorting={isSorting}
                  />
              )}
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
