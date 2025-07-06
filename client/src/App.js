// File: client/src/App.js

import React, { useState, useEffect, useRef, useCallback } from 'react';

// Import components
import Controls from './components/Controls';
import AlgorithmPanel from './components/AlgorithmPanel';
import Visualizer from './components/Visualizer'; // Ensure Visualizer is imported
import AlgorithmInfo from './components/AlgorithmInfo'; // Ensure AlgorithmInfo is imported
import Modal from './components/Modal'; // Ensure Modal is imported

// Import helpers and constants
import { generateRandomArray, generateNearlySortedArray, generateReversedArray, generateFewUniqueArray, parseCustomArray } from './helpers/arrayManager';
import * as sortingAlgorithms from './algorithms'; // Assuming this imports generator functions
import { ALGORITHMS } from './constants'; // Import ALGORITHMS array from constants

function App() {
  // State for modes
  const [isCompareMode, setIsCompareMode]     = useState(false);
  const [isColorBlindMode, setIsColorBlindMode] = useState(false);

  // Panel 1 state
  const [array1,      setArray1]      = useState([]);
  const [selectedAlgorithm1,  setSelectedAlgorithm1]  = useState(ALGORITHMS[0]);
  const [highlights1, setHighlights1] = useState([]);
  const [metrics1,    setMetrics1]    = useState({ comparisons: 0, swaps: 0 });
  const [callLog1,    setCallLog1]    = useState([]);
  const [pseudocodeLine1, setPseudocodeLine1] = useState(0);
  const [currentCallLogIndex1, setCurrentCallLogIndex1] = useState(-1);
  const sorter1 = useRef(null);

  // Panel 2 state
  const [array2,      setArray2]      = useState([]);
  const [selectedAlgorithm2,  setSelectedAlgorithm2]  = useState(ALGORITHMS[1]);
  const [highlights2, setHighlights2] = useState([]);
  const [metrics2,    setMetrics2]    = useState({ comparisons: 0, swaps: 0 });
  const [callLog2,    setCallLog2]    = useState([]);
  const [pseudocodeLine2, setPseudocodeLine2] = useState(0);
  const [currentCallLogIndex2, setCurrentCallLogIndex2] = useState(-1);
  const sorter2 = useRef(null);

  // Shared controls
  const [customInput, setCustomInput] = useState('8, 4, 23, 42, 16, 4');
  const [isSorting,   setIsSorting]   = useState(false);
  const [isPaused,    setIsPaused]    = useState(false);
  const [speed,       setSpeed]       = useState(100);
  const [nextStep,    setNextStep]    = useState(0);
  const timeoutId = useRef(null);

  // For AlgorithmInfo Modal
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [infoModalAlgorithm, setInfoModalAlgorithm] = useState(null);


  const resetSorting = useCallback(() => {
    clearTimeout(timeoutId.current);
    setIsSorting(false);
    setIsPaused(false);

    setHighlights1([]);
    setMetrics1({ comparisons: 0, swaps: 0 });
    setCallLog1([]);
    setPseudocodeLine1(0);
    setCurrentCallLogIndex1(-1);

    setHighlights2([]);
    setMetrics2({ comparisons: 0, swaps: 0 });
    setCallLog2([]);
    setPseudocodeLine2(0);
    setCurrentCallLogIndex2(-1);

    sorter1.current = null;
    sorter2.current = null;
  }, []);

  const setInitialArrays = useCallback((newArray) => {
    setArray1(newArray);
    setArray2(JSON.parse(JSON.stringify(newArray))); // deep copy for compare mode
  }, []);

  const handleGenerateRandomArray = useCallback(() => {
    resetSorting();
    setInitialArrays(generateRandomArray(50, isColorBlindMode)); // Default size 50
  }, [resetSorting, setInitialArrays, isColorBlindMode]);

  const handleGenerateCustomArray = useCallback(() => {
    resetSorting();
    setInitialArrays(parseCustomArray(customInput, isColorBlindMode));
  }, [customInput, resetSorting, setInitialArrays, isColorBlindMode]);

  const handleGenerateArrayType = useCallback((type) => {
    resetSorting();
    let newArr;
    switch (type) {
      case 'random':
        newArr = generateRandomArray(50, isColorBlindMode);
        break;
      case 'nearlySorted':
        newArr = generateNearlySortedArray(50, isColorBlindMode);
        break;
      case 'reversed':
        newArr = generateReversedArray(50, isColorBlindMode);
        break;
      case 'fewUnique':
        newArr = generateFewUniqueArray(50, isColorBlindMode);
        break;
      default:
        newArr = generateRandomArray(50, isColorBlindMode);
    }
    setInitialArrays(newArr);
  }, [resetSorting, setInitialArrays, isColorBlindMode]);


  useEffect(() => {
    handleGenerateArrayType('random'); // Generate a random array on initial load
  }, [isColorBlindMode, handleGenerateArrayType]);

  const runAnimationStep = useCallback((sorterRef, setArray, setHighlights, setMetrics, setCallLog, setPseudocodeLine, setCurrentCallLogIndex) => {
    if (sorterRef.current) {
      const { value: event, done } = sorterRef.current.next();
      if (!done) {
        if (event.array !== undefined) {
          setArray(event.array);
        }
        setHighlights(event.comparing || []);
        setMetrics({ comparisons: event.comparisons, swaps: event.swaps });
        setPseudocodeLine(event.line || 0);

        if (event.type === 'call' || event.type === 'return') {
          setCallLog(prev => {
            const updatedLog = [...prev, event];
            setCurrentCallLogIndex(updatedLog.length - 1);
            return updatedLog;
          });
        }
      } else {
        setArray(event.value || []);
        sorterRef.current = null;
        setHighlights([]);
        setPseudocodeLine(0);
        setCurrentCallLogIndex(-1);
      }
      return done;
    }
    return true;
  }, []);

  useEffect(() => {
    if (isSorting && !isPaused) {
      timeoutId.current = setTimeout(() => {
        let done1 = runAnimationStep(sorter1, setArray1, setHighlights1, setMetrics1, setCallLog1, setPseudocodeLine1, setCurrentCallLogIndex1);
        let done2 = false;
        if (isCompareMode) {
          done2 = runAnimationStep(sorter2, setArray2, setHighlights2, setMetrics2, setCallLog2, setPseudocodeLine2, setCurrentCallLogIndex2);
        }

        if (done1 && (!isCompareMode || done2)) {
          setIsSorting(false);
          setIsPaused(false);
        } else {
          setNextStep(s => s + 1);
        }
      }, speed);
    }
    return () => clearTimeout(timeoutId.current);
  }, [isSorting, isPaused, speed, nextStep, isCompareMode, runAnimationStep]);


  const handleSort = () => {
    resetSorting();
    sorter1.current = sortingAlgorithms[selectedAlgorithm1.value](JSON.parse(JSON.stringify(array1)));
    if (isCompareMode) {
      sorter2.current = sortingAlgorithms[selectedAlgorithm2.value](JSON.parse(JSON.stringify(array2)));
    }
    setIsSorting(true);
    setIsPaused(false);
    setNextStep(1);
  };

  const handlePause  = () => setIsPaused(true);
  const handleResume = () => { setIsPaused(false); setNextStep(s => s + 1); };
  const handleStep   = () => {
    if (!isSorting && !sorter1.current) {
      sorter1.current = sortingAlgorithms[selectedAlgorithm1.value](JSON.parse(JSON.stringify(array1)));
      if (isCompareMode) {
        sorter2.current = sortingAlgorithms[selectedAlgorithm2.value](JSON.parse(JSON.stringify(array2)));
      }
      setIsSorting(true);
    }
    runAnimationStep(sorter1, setArray1, setHighlights1, setMetrics1, setCallLog1, setPseudocodeLine1, setCurrentCallLogIndex1);
    if (isCompareMode) {
      runAnimationStep(sorter2, setArray2, setHighlights2, setMetrics2, setCallLog2, setPseudocodeLine2, setCurrentCallLogIndex2);
    }
    setIsPaused(true);
  };


  return (
    // Main application container. Using min-h-screen to ensure it takes full viewport height.
    // Added 'flex-col' to allow vertical stacking of header, controls, and main content.
    <div className="bg-gray-50 min-h-screen font-sans p-4 sm:p-6 lg:p-8 flex flex-col">
      <div className="max-w-screen-2xl mx-auto flex-1 flex flex-col w-full"> {/* Added flex-1 and flex-col */}
        <header className="text-center mb-6 shrink-0"> {/* shrink-0 to prevent header from shrinking */}
          <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">
            Sorting Algorithm Stability Visualizer
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            An interactive tool to understand how sorting algorithms handle duplicate elements.
          </p>
        </header>

        <main className="flex-1 flex flex-col"> {/* flex-1 to take remaining vertical space */}
          <Controls
            onGenerateRandom={() => handleGenerateArrayType('random')}
            onGenerateCustom={handleGenerateCustomArray}
            customInput={customInput}
            onCustomInputChange={setCustomInput}
            onSort={handleSort}
            onPause={handlePause}
            onResume={handleResume}
            onStep={handleStep}
            selectedAlgorithm1={selectedAlgorithm1}
            onAlgoChange1={setSelectedAlgorithm1}
            selectedAlgorithm2={selectedAlgorithm2}
            onAlgoChange2={setSelectedAlgorithm2}
            isSorting={isSorting}
            isPaused={isPaused}
            speed={speed}
            onSpeedChange={setSpeed}
            isCompareMode={isCompareMode}
            onCompareModeChange={setIsCompareMode}
            isColorBlindMode={isColorBlindMode}
            onColorBlindModeChange={setIsColorBlindMode}
            algorithms={ALGORITHMS}
          />

          {/* This div now correctly uses flex-1 to take remaining height and manages its children */}
          <div className={`mt-4 grid gap-8 ${
            isCompareMode ? 'grid-cols-1 xl:grid-cols-2' : 'grid-cols-1'
          } flex-1`}> {/* Added flex-1 */}
            <AlgorithmPanel
              array={array1}
              highlights={highlights1}
              selectedAlgorithm={selectedAlgorithm1}
              metrics={metrics1}
              callLog={callLog1}
              pseudocodeLine={pseudocodeLine1}
              currentCallLogIndex={currentCallLogIndex1}
              onShowInfo={() => {
                setInfoModalAlgorithm(selectedAlgorithm1);
                setShowInfoModal(true);
              }}
            />
            {isCompareMode && (
              <AlgorithmPanel
                array={array2}
                highlights={highlights2}
                selectedAlgorithm={selectedAlgorithm2}
                metrics={metrics2}
                callLog={callLog2}
                pseudocodeLine={pseudocodeLine2}
                currentCallLogIndex={currentCallLogIndex2}
                onShowInfo={() => {
                  setInfoModalAlgorithm(selectedAlgorithm2);
                  setShowInfoModal(true);
                }}
              />
            )}
          </div>
        </main>

        <footer className="text-center mt-8 text-sm text-gray-500 shrink-0"> {/* shrink-0 to prevent footer from shrinking */}
          <p>
            Built based on the research paper "Visualizing Stability in Comparison Sorting Algorithms".
          </p>
        </footer>
      </div>
      {/* Modal for Algorithm Info - Rendered at a high level to ensure it floats correctly */}
      <Modal show={showInfoModal} onClose={() => setShowInfoModal(false)}>
        {infoModalAlgorithm && (
          <AlgorithmInfo
            algorithm={infoModalAlgorithm}
          />
        )}
      </Modal>
    </div>
  );
}

export default App;
