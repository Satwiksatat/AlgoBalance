import React from 'react'; // React is needed for JSX in patterns

export const PALETTE = {
  primary: '#4A90E2', 
  secondary: '#50E3C2',
  comparing: '#F5A623',
  swapping: '#D0021B',
  sorted: '#7ED321',
  default: '#BDD7EE',
  pivot: '#f72585',
  // Color-blind friendly base color
  cb_base: '#808080',
  cb_pattern: 'rgba(0,0,0,0.5)',
};

export const ALGORITHMS = {
  bubbleSort: 'Bubble Sort',
  mergeSort: 'Merge Sort',
  quickSort: 'Quick Sort',
  heapSort: 'Heap Sort',
};

// SVG Patterns for Color-Blind Mode
export const PATTERNS = {
  stripes: {
    width: 8, height: 8, content: <path d="M-1,1 l2,-2 M0,8 l8,-8 M7,9 l2,-2" stroke={PALETTE.cb_pattern} strokeWidth="2"/>
  },
  dots: {
    width: 10, height: 10, content: <circle cx="5" cy="5" r="2" fill={PALETTE.cb_pattern}/>
  },
  grid: {
    width: 10, height: 10, content: <path d="M 5 0 L 5 10 M 0 5 L 10 5" stroke={PALETTE.cb_pattern} strokeWidth="1"/>
  },
  zig: {
    width: 8, height: 8, content: <path d="M 0 0 L 4 8 L 8 0" stroke={PALETTE.cb_pattern} strokeWidth="1" fill="none"/>
  }
};