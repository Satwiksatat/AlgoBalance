// File: /client/src/components/Modal.js
import React from 'react';
import ReactDOM from 'react-dom';

const Modal = ({ show, onClose, children, title = "Information" }) => {
  if (!show) {
    return null;
  }

  // Render the modal directly into the body to ensure it's on top of other content
  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200 shrink-0">
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        {/* Added overflow-y-auto to the body for scrolling content */}
        <div className="p-4 flex-1 overflow-y-auto">
          {children}
        </div>

        {/* Modal Footer (optional, can add buttons here) */}
        {/* <div className="p-4 border-t border-gray-200 flex justify-end shrink-0">
          <button onClick={onClose} className="px-4 py-2 bg-blue-500 text-white rounded-lg">Close</button>
        </div> */}
      </div>
    </div>,
    document.body // Portal into the document body
  );
};

export default Modal;
