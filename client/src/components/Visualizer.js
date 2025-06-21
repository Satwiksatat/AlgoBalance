// File: /client/src/components/Visualizer.js
import React from 'react';
import Bar from './Bar';
import { PATTERNS } from '../constants';

const Visualizer = ({ array, highlights }) => {
  if (!array) return null;
  const barWidth = 100 / (array.length * 1.5);

  return (
    <div className="flex-grow bg-gray-100 p-4 rounded-lg shadow-inner min-h-[400px] flex items-end justify-center gap-1 relative">
      {/* Define SVG patterns for color-blind mode */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          {Object.entries(PATTERNS).map(([id, pattern]) => (
            <pattern key={id} id={id} patternUnits="userSpaceOnUse" width={pattern.width} height={pattern.height}>
              {pattern.content}
            </pattern>
          ))}
        </defs>
      </svg>
      
      {array.map((item, index) => (
        <Bar
          key={item.id}
          value={item.value}
          color={item.color}
          height={(item.value / 100) * 90 + 5}
          width={barWidth}
          isComparing={highlights.comparing?.includes(index)}
          isSwapping={highlights.swapping?.includes(index)}
          isPivot={highlights.pivot === index}
          patternId={item.patternId}
        />
      ))}
    </div>
  );
};

export default Visualizer;
