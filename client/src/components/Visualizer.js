// File: /client/src/components/Visualizer.js
import React from 'react';
import Bar from './Bar';

const Visualizer = ({ array, highlights }) => {
  if (!array) return null;
  const barWidth = 100 / (array.length * 1.5);
  return (
    <div className="flex-grow bg-gray-100 p-4 rounded-lg shadow-inner min-h-[400px] flex items-end justify-center gap-1">
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
        />
      ))}
    </div>
  );
};

export default Visualizer;