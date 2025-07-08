import React, { useState, useEffect } from 'react';

const CallStack = ({ stack, isSorting }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    // Automatically open when sorting starts
    if (isSorting) {
      setIsOpen(true);
      setIsMinimized(false); // Ensure it's not minimized when sorting starts
    }
  }, [isSorting]);

  if (!stack || stack.length === 0 || !isOpen) {
    return null; // Don't render if the stack is empty or closed
  }

  return (
    <div className="absolute top-4 right-4 bg-white p-3 rounded-lg shadow-lg border border-gray-200 max-w-xs w-full z-10">
      <div className="flex justify-between items-center mb-2 border-b pb-1">
        <h3 className="text-sm font-bold text-gray-800 text-center flex-grow">
          Call Stack
        </h3>
        <div className="flex items-center">
          <button 
            onClick={() => setIsMinimized(!isMinimized)} 
            className="text-gray-500 hover:text-gray-800 focus:outline-none mr-2"
            aria-label={isMinimized ? "Maximize call stack" : "Minimize call stack"}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              {isMinimized ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path> // Up arrow for maximize
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path> // Down arrow for minimize
              )}
            </svg>
          </button>
          <button 
            onClick={() => setIsOpen(false)} 
            className="text-gray-500 hover:text-gray-800 focus:outline-none"
            aria-label="Close call stack"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>
      {!isMinimized && (
        <div className="flex flex-col-reverse gap-1 mt-2 max-h-80 overflow-y-auto">
          {stack.map((frame, index) => {
            const isCurrent = index === stack.length - 1;
            return (
              <div 
                key={index} 
                className={`
                  text-xs font-mono p-2 rounded-md shadow-sm text-left
                  ${isCurrent 
                    ? 'bg-indigo-500 text-white font-bold scale-105 shadow-lg' 
                    : 'bg-indigo-100 text-indigo-900'}
                  transition-all duration-300 ease-in-out
                `}
              >
                {`${index + 1}. ${frame}`}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CallStack;