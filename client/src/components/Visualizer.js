import React from 'react';
import Bar from './Bar';

// Helper function to format values for display in the call stack log.
const formatValue = (value) => {
  if (Array.isArray(value)) {
    const display = value.slice(0, 5).map(item => item.value !== undefined ? item.value : item);
    return `[${display.join(', ')}${value.length > 5 ? ', ...' : ''}]`;
  }
  if (typeof value === 'object' && value !== null) {
    if (value.hasOwnProperty('value') && value.hasOwnProperty('id')) {
        return `{value: ${value.value}, id: ${value.id}}`;
    }
    return 'Object';
  }
  if (typeof value === 'string') {
      return `'${value}'`;
  }
  return String(value);
};


function Visualizer({ array, highlights, pseudocode, pseudocodeLine, callLog, currentStepIndex }) {
  return (
    // The main container for the visualizer.
    // It uses flex-col to stack its children vertically.
    // flex-1 ensures it takes all available vertical space within its parent (AlgorithmPanel).
    <div className="flex flex-col items-center w-full flex-1 p-4 bg-white rounded-lg shadow-md">

      {/* Array Visualization Area: Displays the bars representing the array elements. */}
      {/* Fixed height (h-40) to ensure bars are always visible and don't collapse. */}
      {/* shrink-0 prevents this section from shrinking. */}
      <div className="flex items-end justify-center w-full h-40 border-b pb-4 overflow-hidden shrink-0">
        {array.length > 0 ? (
          array.map((item, index) => (
            <Bar
              key={item.id}
              value={item.value}
              isHighlighted={highlights.includes(index)}
              isPivot={highlights[0] === index && highlights.length === 1 && (item.isPivot || false)}
              arrayLength={array.length}
            />
          ))
        ) : (
          <p className="text-gray-500">Generate an array to start visualizing!</p>
        )}
      </div>

      {/* Panels for Pseudocode and Call Stack, arranged side-by-side. */}
      {/* This div uses flex-1 to take up the remaining vertical space after the bars. */}
      {/* It uses flex-row to arrange its children (pseudocode and call stack) horizontally. */}
      {/* gap-4 provides spacing between these two panels. */}
      <div className="flex w-full mt-4 flex-1 gap-4">
        {/* Pseudocode Panel: Displays the algorithm's pseudocode. */}
        {/* flex-1 for width, h-full to fill parent height, overflow-auto for independent scrolling. */}
        <div className="flex-1 overflow-auto bg-gray-50 p-4 rounded-lg shadow-inner h-full">
          <h3 className="text-lg font-semibold mb-2 text-gray-800">Pseudocode</h3>
          <pre className="text-sm font-mono whitespace-pre-wrap">
            {pseudocode.map((line, index) => (
              <p
                key={index}
                className={`${
                  index + 1 === pseudocodeLine
                    ? 'bg-yellow-200 font-bold text-gray-900'
                    : 'text-gray-700'
                } p-1 rounded-sm transition-colors duration-150`}
              >
                {line}
              </p>
            ))}
          </pre>
        </div>

        {/* Call Stack Log Panel: Displays the dynamic call stack of the algorithm. */}
        {/* flex-1 for width, h-full to fill parent height, overflow-auto for independent scrolling. */}
        <div className="flex-1 overflow-auto bg-gray-50 p-4 rounded-lg shadow-inner h-full">
          <h3 className="text-lg font-semibold mb-2 text-gray-800">Call Stack</h3>
          {callLog.length === 0 ? (
            <p className="text-gray-500 text-sm">Call stack will appear here as the algorithm runs.</p>
          ) : (
            <div className="space-y-2 font-mono text-xs">
              {callLog.map((frame, index) => (
                <div
                  key={index}
                  className={`p-2 rounded transition-colors duration-200
                    ${frame.type === 'call' ? 'bg-blue-50' : 'bg-green-50'}
                    ${index === currentStepIndex ? 'border-2 border-blue-500 shadow-md' : 'border border-gray-200'}
                  `}
                  style={{ marginLeft: frame.locals?.callDepth ? `${frame.locals.callDepth * 20}px` : '0px' }}
                >
                  <div className="flex items-center space-x-1">
                    {frame.type === 'call' && (
                      <span className="text-blue-600">&#9656;</span>
                    )}
                    {frame.type === 'return' && (
                      <span className="text-green-600">&#9666;</span>
                    )}
                    <span className="font-semibold text-gray-800">{frame.name}</span>
                    {frame.line !== undefined && (
                      <span className="text-gray-500">(line {frame.line})</span>
                    )}
                  </div>
                  {frame.args && frame.args.length > 0 && (
                    <div className="ml-4 text-gray-700">Args: {frame.args.map(arg => formatValue(arg)).join(', ')}</div>
                  )}
                  {frame.locals && Object.keys(frame.locals).length > 0 && (
                    <div className="ml-4 text-gray-700">Locals: {Object.entries(frame.locals).map(([key, value]) => (
                      <span key={key} className="mr-2">{key}: {formatValue(value)}</span>
                    ))}</div>
                  )}
                  {frame.type === 'return' && frame.returnValue !== undefined && (
                    <div className="ml-4 text-green-700">Returns: {formatValue(frame.returnValue)}</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Visualizer;
