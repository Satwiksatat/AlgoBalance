import React from 'react';

const Pseudocode = ({ code, activeLine }) => (
  <div className="bg-gray-800 text-white font-mono text-sm rounded-lg shadow-md p-4 h-full">
    <pre>
      {code.map((line, index) => (
        <div key={index} className={`whitespace-pre-wrap transition-colors duration-200 ${index + 1 === activeLine ? 'bg-blue-900' : ''}`}>
          {line}
        </div>
      ))}
    </pre>
  </div>
);

export default Pseudocode;
