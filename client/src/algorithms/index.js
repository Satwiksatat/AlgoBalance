// File: client/src/algorithms/index.js

/**
 * Each sorting function is instrumented to emit a 'call' event
 * with a locals snapshot capturing all parameters and key variables
 * at the moment of entry.
 */

// ——— Bubble Sort ———
export function* bubbleSort(arr) {
  // local variables at entry
  let n = arr.length;
  let comparisons = 0;
  let swaps = 0;
  yield {
    type: 'call',
    name: 'bubbleSort',
    args: [],
    locals: { n, comparisons, swaps }
  };

  for (let i = 0; i < n - 1; i++) {
    let hasSwapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      comparisons++;
      yield { array: arr, comparing: [j, j + 1], line: 2, comparisons, swaps };
      if (arr[j].value > arr[j + 1].value) {
        hasSwapped = true;
        swaps++;
        yield { array: arr, swapping: [j, j + 1], line: 3, comparisons, swaps };
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        yield { array: arr, swapping: [j, j + 1], line: 4, comparisons, swaps };
      }
    }
    if (!hasSwapped) break;
  }

  yield { type: 'return', name: 'bubbleSort' };
  return arr;
}

// ——— Quick Sort + Partition ———
export function* quickSort(arr) {
  // parameters and initial stack
  let comparisons = 0;
  let swaps = 0;
  let callDepth = 0;
  const stack = [{ low: 0, high: arr.length - 1 }];
  yield {
    type: 'call',
    name: 'quickSort',
    args: [],
    locals: { comparisons, swaps, stack: [...stack] }
  };

  while (stack.length > 0) {
    const { low, high } = stack.pop();
    callDepth++;
    yield { array: arr, line: 2, comparisons, swaps, locals: { low, high, callDepth } };

    if (low < high) {
      // partition subroutine
      const partitionGen = partition(arr, low, high, comparisons, swaps);
      let step = partitionGen.next();
      while (!step.done) {
        const e = step.value;
        comparisons = e.comparisons;
        swaps       = e.swaps;
        yield { ...e };
        step = partitionGen.next();
      }
      const pivotIndex = step.value;
      yield { array: arr, line: 4, comparisons, swaps, locals: { low, high, pivotIndex } };

      // push sub-ranges
      stack.push({ low: 0, high: pivotIndex - 1 });
      stack.push({ low: pivotIndex + 1, high });
    }
  }

  yield { type: 'return', name: 'quickSort' };
  return arr;
}

export function* partition(arr, low, high, prevComp = 0, prevSwaps = 0) {
  // parameters and locals
  let comparisons = prevComp;
  let swaps = prevSwaps;
  let i = low - 1;
  const pivotValue = arr[high].value;
  yield {
    type: 'call',
    name: 'partition',
    args: [low, high],
    locals: { low, high, i, pivotValue, comparisons, swaps }
  };

  for (let j = low; j < high; j++) {
    comparisons++;
    yield { array: arr, comparing: [j, high], line: 11, comparisons, swaps };
    if (arr[j].value < pivotValue) {
      i++;
      swaps++;
      yield { array: arr, swapping: [i, j], line: 12, comparisons, swaps };
      [arr[i], arr[j]] = [arr[j], arr[i]];
      yield { array: arr, swapping: [i, j], line: 13, comparisons, swaps };
    }
  }
  // final pivot swap
  swaps++;
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  yield { array: arr, swapping: [i + 1, high], line: 15, comparisons, swaps, locals: { low, high, i, pivotValue } };

  yield { type: 'return', name: 'partition', locals: { low, high, i, pivotValue, comparisons, swaps } };
  return i + 1;
}

// ——— Merge Sort + Merge ———
export function* mergeSort(arr) {
  let comparisons = 0;
  let swaps = 0;
  let size = 1;
  const n = arr.length;
  yield { type: 'call', name: 'mergeSort', args: [], locals: { size, n, comparisons, swaps } };

  while (size < n) {
    for (let leftStart = 0; leftStart < n; leftStart += 2 * size) {
      const mid      = Math.min(leftStart + size - 1, n - 1);
      const rightEnd = Math.min(leftStart + 2 * size - 1, n - 1);
      yield { array: arr, line: 4, comparisons, swaps, locals: { leftStart, mid, rightEnd, size } };

      // merge subroutine
      const mergeGen = merge(arr, leftStart, mid, rightEnd, [], comparisons, swaps);
      let step = mergeGen.next();
      while (!step.done) {
        const e = step.value;
        comparisons = e.comparisons;
        swaps       = e.swaps;
        yield { ...e };
        step = mergeGen.next();
      }

      size *= 2;
    }
  }

  yield { type: 'return', name: 'mergeSort', locals: { comparisons, swaps } };
  return arr;
}

export function* merge(arr, left, mid, right, buffer = [], prevComp = 0, prevSwaps = 0) {
  let comparisons = prevComp;
  let swaps = prevSwaps;
  let i = left;
  let j = mid + 1;
  let k = left;
  yield {
    type: 'call',
    name: 'merge',
    args: [left, mid, right],
    locals: { left, mid, right, i, j, k, comparisons, swaps }
  };

  while (i <= mid && j <= right) {
    comparisons++;
    yield { array: arr, comparing: [i, j], line: 9, comparisons, swaps };
    if (arr[i].value <= arr[j].value) {
      buffer[k++] = arr[i++];
      swaps++;
      yield { array: arr, line: 10, comparisons, swaps };
    } else {
      buffer[k++] = arr[j++];
      swaps++;
      yield { array: arr, line: 12, comparisons, swaps };
    }
  }

  while (i <= mid) {
    buffer[k++] = arr[i++];
    swaps++;
    yield { array: arr, line: 16, comparisons, swaps };
  }
  while (j <= right) {
    buffer[k++] = arr[j++];
    swaps++;
    yield { array: arr, line: 19, comparisons, swaps };
  }

  // copy back
  for (let idx = left; idx <= right; idx++) arr[idx] = buffer[idx];
  yield { array: [...arr], line: 20, comparisons, swaps, locals: { left, mid, right } };

  yield { type: 'return', name: 'merge', locals: { left, mid, right, comparisons, swaps } };
}

// ——— Heap Sort + Heapify ———
export function* heapSort(arr) {
  const n = arr.length;
  let comparisons = 0;
  let swaps = 0;
  yield { type: 'call', name: 'heapSort', args: [], locals: { n, comparisons, swaps } };

  // build heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    const heapGen = heapify(arr, n, i, comparisons, swaps);
    let step = heapGen.next();
    while (!step.done) {
      const e = step.value;
      comparisons = e.comparisons;
      swaps       = e.swaps;
      yield { ...e };
      step = heapGen.next();
    }
  }

  // extract
  for (let i = n - 1; i > 0; i--) {
    swaps++;
    [arr[0], arr[i]] = [arr[i], arr[0]];
    yield { array: arr, swapping: [0, i], line: 6, comparisons, swaps, locals: { i } };
    const heapGen2 = heapify(arr, i, 0, comparisons, swaps);
    let step2 = heapGen2.next();
    while (!step2.done) {
      const e = step2.value;
      comparisons = e.comparisons;
      swaps       = e.swaps;
      yield { ...e };
      step2 = heapGen2.next();
    }
  }

  yield { type: 'return', name: 'heapSort', locals: { comparisons, swaps } };
  return arr;
}

export function* heapify(arr, n, i, prevComp = 0, prevSwaps = 0) {
  let comparisons = prevComp;
  let swaps = prevSwaps;
  let largest = i;
  const l = 2 * i + 1;
  const r = 2 * i + 2;
  yield {
    type: 'call',
    name: 'heapify',
    args: [n, i],
    locals: { n, i, comparisons, swaps }
  };

  if (l < n) {
    comparisons++;
    yield { array: arr, comparing: [l, largest], line: 12, comparisons, swaps };
    if (arr[l].value > arr[largest].value) largest = l;
  }
  if (r < n) {
    comparisons++;
    yield { array: arr, comparing: [r, largest], line: 14, comparisons, swaps };
    if (arr[r].value > arr[largest].value) largest = r;
  }

  if (largest !== i) {
    swaps++;
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    yield { array: arr, swapping: [i, largest], line: 17, comparisons, swaps };
    // recurse
    const gen = heapify(arr, n, largest, comparisons, swaps);
    let s = gen.next();
    while (!s.done) {
      yield s.value;
      s = gen.next();
    }
  }

  yield { type: 'return', name: 'heapify', locals: { n, i, comparisons, swaps } };
}

// Export mapping
export const ALGO_FUNCTIONS = {
  bubbleSort,
  quickSort,
  mergeSort,
  heapSort,
};



export const ALGO_DETAILS = {
  bubbleSort: {
    name: 'Bubble Sort',
    complexity: 'Time: O(n²) | Space: O(1)',
    stable: true,
    description: 'Compares adjacent elements and swaps them if they are in the wrong order. This process repeats until the list is sorted.',
    pseudocode: [
      'procedure BubbleSort(A)',
      '  for i from 0 to n-2',
      '    for j from 0 to n-i-2',
      '      if A[j] > A[j+1]',
      '        swap(A[j], A[j+1])',
      '      end if',
      '    if no swaps in inner loop, break',
      '  end for',
      'end procedure'
    ]
  },
  quickSort: {
    name: 'Quick Sort',
    complexity: 'Time: O(n log n) avg | Space: O(log n)',
    stable: false,
    description: 'A divide-and-conquer algorithm. It picks a \'pivot\' element and partitions the other elements into two sub-arrays.',
    pseudocode: [
      'procedure QuickSort(A, low, high)',
      '  if low < high',
      '    pi = partition(A, low, high)',
      '    QuickSort(A, low, pi - 1)',
      '    QuickSort(A, pi + 1, high)',
      '  end if',
      'end procedure',
      '',
      'procedure partition(A, low, high)',
      '  pivot = A[high]',
      '  i = low - 1',
      '  for j from low to high - 1',
      '    if A[j] < pivot',
      '      i++',
      '      swap(A[i], A[j])',
      '    end if',
      '  end for',
      '  swap(A[i + 1], A[high])',
      '  return (i + 1)',
      'end procedure'
    ]
  },
  mergeSort: {
    name: 'Merge Sort',
    complexity: 'Time: O(n log n) | Space: O(n)',
    stable: true,
    description: 'A divide-and-conquer algorithm that divides the array into halves, sorts them recursively, and then merges them.',
    pseudocode: [
      'procedure MergeSort(A)',
      '  for size from 1 to n-1 by size*2',
      '    for leftStart from 0 to n-1 by size*2',
      '      mid = ...; rightEnd = ...',
      '      merge(A, leftStart, mid, rightEnd)',
      '    end for',
      '  end for',
      'end procedure',
      '',
      'procedure merge(A, left, mid, right)',
      '  while leftPart and rightPart have elements',
      '    if A[leftPart.head] <= A[rightPart.head]',
      '      append A[leftPart.head] to result',
      '    else',
      '      append A[rightPart.head] to result',
      '    end if',
      '  end while',
      '  append remaining from leftPart',
      '  ...',
      '  append remaining from rightPart',
      '  ...',
      'end procedure'
    ]
  },
  heapSort: {
    name: 'Heap Sort',
    complexity: 'Time: O(n log n) | Space: O(1)',
    stable: false,
    description: 'Uses a binary heap data structure. It first builds a max heap from the data, then repeatedly extracts the maximum element.',
    pseudocode: [
        'procedure HeapSort(A)',
        '  n = A.length',
        '  buildMaxHeap(A)',
        '  for i from n-1 down to 1',
        '    swap(A[0], A[i])',
        '    n = n - 1',
        '    heapify(A, 0, n)',
        '  end for',
        'end procedure',
        '',
        'procedure heapify(A, i, n)',
        '  left = 2*i + 1, right = 2*i + 2',
        '  if left < n and A[left] > A[i]',
        '    largest = left',
        '  if right < n and A[right] > A[largest]',
        '    largest = right',
        '  if largest != i',
        '    swap(A[i], A[largest])',
        '    heapify(A, largest, n)',
        '  end if',
        'end procedure'
    ]
  }
};
