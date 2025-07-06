// File: /client/src/components/AlgorithmPanel.js
import React from 'react';

import Visualizer from './Visualizer';
import AlgorithmInfo from './AlgorithmInfo';
import Pseudocode from './Pseudocode';
import { ALGO_DETAILS } from '../algorithms';

// This component encapsulates one entire visualization pane
const AlgorithmPanel = ({ array, highlights, algoKey, metrics, stack, isSorting }) => {
  return (
    <div className="flex flex-col gap-6 bg-white p-4 rounded-lg shadow-lg">
      <Visualizer array={array} highlights={highlights} stack={stack} isSorting={isSorting} />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <AlgorithmInfo algoKey={algoKey} metrics={metrics}/>
        <Pseudocode code={ALGO_DETAILS[algoKey]?.pseudocode || []} activeLine={highlights.line}/>
      </div>
    </div>
  );
};

export default AlgorithmPanel;