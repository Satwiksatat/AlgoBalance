// File: client/src/components/Visualizer.js

import React from 'react';
import Bar from './Bar';
import { PATTERNS } from '../constants';

export default function Visualizer({
  array,
  highlights,
  callLog = []
}) {
  if (!array) return null;
  const barWidth = 100 / (array.length * 1.5);

  return (
    <div className="flex gap-4">
      {/* Bars Visualization */}
      <div className="flex-grow bg-gray-100 p-4 rounded-lg shadow-inner min-h-[400px] flex items-end justify-center gap-1 relative">
        <svg width="0" height="0" style={{ position: 'absolute' }}>
          <defs>
            {Object.entries(PATTERNS).map(([id, pattern]) => (
              <pattern
                key={id}
                id={id}
                patternUnits="userSpaceOnUse"
                width={pattern.width}
                height={pattern.height}
              >
                {pattern.element}
              </pattern>
            ))}
          </defs>
        </svg>
        {array.map((item, idx) => (
          <Bar
            key={item.id ?? idx}
            value={item.value}
            color={item.color}
            patternId={item.patternId}
            height={(item.value / 100) * 90 + 5}
            width={barWidth}
            isComparing={highlights.comparing?.includes(idx)}
            isSwapping={highlights.swapping?.includes(idx)}
            isPivot={highlights.pivot === idx}
          />
        ))}
      </div>

      {/* Persistent Call-Log Panel */}
      <div className="w-1/3 bg-white p-4 rounded-lg shadow-inner min-h-[400px] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-2">Call Stack Log</h3>
        {callLog.length === 0 ? (
          <p className="text-gray-400 italic">No calls yet</p>
        ) : (
          <ul className="space-y-2">
            {callLog.map((frame, i) => (
              <li
                key={i}
                className="bg-gray-100 rounded p-2 font-mono text-sm"
              >
                <div>
                  <span className="font-semibold">{frame.name}</span>(
                  {(frame.args || []).map((a, j) => (
                    <span key={j}>
                      {JSON.stringify(a)}
                      {j < (frame.args || []).length - 1 ? ', ' : ''}
                    </span>
                  ))}
                  )
                </div>
                {frame.locals &&
                  Object.entries(frame.locals).map(([k, v]) => (
                    <div key={k} className="ml-4 text-xs text-gray-600">
                      {k}: {JSON.stringify(v)}
                    </div>
                  ))}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
