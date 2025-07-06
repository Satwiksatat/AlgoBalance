// client/src/constants/index.js
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

// Define ALGORITHMS as an array of objects, each containing full details
export const ALGORITHMS = [
    {
        name: 'Bubble Sort',
        value: 'bubbleSort', // Unique identifier for the algorithm
        complexity: 'O(n^2)',
        stable: true,
        description: 'A simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.',
        pseudocode: [
            'procedure BubbleSort(A)',
            '  n = length(A)',
            '  for i = 0 to n-2',
            '    for j = 0 to n-i-2',
            '      if A[j] > A[j+1]',
            '        swap A[j], A[j+1]',
            '      end if',
            '    end for',
            '  end for',
            'end procedure'
        ]
    },
    {
        name: 'Quick Sort',
        value: 'quickSort',
        complexity: 'O(n log n) average, O(n^2) worst',
        stable: false,
        description: 'An efficient, in-place sorting algorithm that uses a divide-and-conquer strategy. It picks an element as a pivot and partitions the array around the picked pivot.',
        pseudocode: [
            'procedure QuickSort(A, low, high)',
            '  if low < high',
            '    pivotIndex = Partition(A, low, high)',
            '    QuickSort(A, low, pivotIndex - 1)',
            '    QuickSort(A, pivotIndex + 1, high)',
            '  end if',
            'end procedure',
            '', // Blank line for spacing in pseudocode display
            'procedure Partition(A, low, high)',
            '  pivot = A[high]',
            '  i = low - 1',
            '  for j = low to high - 1',
            '    if A[j] < pivot',
            '      i = i + 1',
            '      swap A[i], A[j]',
            '    end if',
            '  end for',
            '  swap A[i+1], A[high]',
            '  return i+1',
            'end procedure'
        ]
    },
    {
        name: 'Merge Sort',
        value: 'mergeSort',
        complexity: 'O(n log n)',
        stable: true,
        description: 'A divide-and-conquer algorithm that divides the array into two halves, recursively sorts them, and then merges the two sorted halves.',
        pseudocode: [
            'procedure MergeSort(A, l, r)',
            '  if l < r',
            '    m = floor((l+r)/2)',
            '    MergeSort(A, l, m)',
            '    MergeSort(A, m+1, r)',
            '    Merge(A, l, m, r)',
            '  end if',
            'end procedure',
            '',
            'procedure Merge(A, l, m, r)',
            '  n1 = m - l + 1',
            '  n2 = r - m',
            '  L = new Array(n1)',
            '  R = new Array(n2)',
            '  // Copy data to temp arrays L[] and R[]',
            '  for i = 0 to n1-1',
            '    L[i] = A[l + i]',
            '  for j = 0 to n2-1',
            '    R[j] = A[m + 1 + j]',
            '  i = 0, j = 0, k = l',
            '  while i < n1 and j < n2',
            '    if L[i] <= R[j]',
            '      A[k] = L[i]',
            '      i++',
            '    else',
            '      A[k] = R[j]',
            '      j++',
            '    k++',
            '  while i < n1',
            '    A[k] = L[i]',
            '    i++',
            '    k++',
            '  while j < n2',
            '    A[k] = R[j]',
            '    j++',
            '    k++',
            'end procedure'
        ]
    },
    {
        name: 'Heap Sort',
        value: 'heapSort',
        complexity: 'O(n log n)',
        stable: false,
        description: 'A comparison-based sorting technique based on binary heap data structure. It is similar to selection sort where we first find the maximum element and place it at the end.',
        pseudocode: [
            'procedure HeapSort(A)',
            '  n = length(A)',
            '  // Build max heap (rearrange array)',
            '  for i = floor(n/2)-1 down to 0',
            '    Heapify(A, n, i)',
            '  end for',
            '  // One by one extract elements from heap',
            '  for i = n-1 down to 1',
            '    swap A[0], A[i]',
            '    Heapify(A, i, 0)',
            '  end for',
            'end procedure',
            '',
            'procedure Heapify(A, n, i)',
            '  largest = i',
            '  l = 2*i + 1',
            '  r = 2*i + 2',
            '  if l < n and A[l] > A[largest]',
            '    largest = l',
            '  end if',
            '  if r < n and A[r] > A[largest]',
            '    largest = r',
            '  end if',
            '  if largest != i',
            '    swap A[i], A[largest]',
            '    Heapify(A, n, largest)',
            '  end if',
            'end procedure'
        ]
    }
];


// SVG Patterns for Color-Blind Mode (ensure these are valid SVG paths/elements)
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
