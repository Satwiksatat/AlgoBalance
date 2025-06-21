// File: /client/src/algorithms/index.js

function* bubbleSort(arr) {
  let n = arr.length;
  let isSorted = false;
  for (let i = 0; i < n - 1; i++) {
    isSorted = true;
    yield { array: arr, line: 1 };
    for (let j = 0; j < n - i - 1; j++) {
      yield { array: arr, comparing: [j, j + 1], line: 2 };
      if (arr[j].value > arr[j + 1].value) {
        isSorted = false;
        yield { array: arr, swapping: [j, j + 1], line: 3 };
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        yield { array: arr, swapping: [j, j + 1], line: 4 };
      }
    }
    if(isSorted) {
        yield { array: arr, line: 6 };
        break;
    };
  }
  return arr;
}

function* quickSort(arr) {
    const stack = [{ low: 0, high: arr.length - 1, line: 1 }];
    yield { array: arr, line: 1 };
    
    while (stack.length > 0) {
        const { low, high } = stack.pop();
        yield { array: arr, line: 2 };

        if (low < high) {
            yield { array: arr, line: 3 };
            const pivotIndex = yield* partition(arr, low, high);
            yield { array: arr, line: 4 };
            stack.push({ low, high: pivotIndex - 1 });
            yield { array: arr, line: 5 };
            stack.push({ low: pivotIndex + 1, high });
        }
    }
    yield { array: arr, line: 7 };
    return arr;
}

function* partition(arr, low, high) {
    const pivot = arr[high];
    let i = low - 1;
    yield { array: arr, pivot: high, line: 10 };

    for (let j = low; j < high; j++) {
        yield { array: arr, comparing: [j, high], line: 11 };
        if (arr[j].value < pivot.value) {
            i++;
            yield { array: arr, swapping: [i, j], line: 12 };
            [arr[i], arr[j]] = [arr[j], arr[i]];
            yield { array: arr, swapping: [i, j], line: 13 };
        }
    }
    
    yield { array: arr, swapping: [i + 1, high], line: 15 };
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    yield { array: arr, swapping: [i + 1, high], line: 16 };
    
    return i + 1;
}

function* mergeSort(arr) {
    let n = arr.length;
    yield { array: arr, line: 1 };
  
    for (let size = 1; size < n; size *= 2) {
        yield { array: arr, line: 2 };
        for (let leftStart = 0; leftStart < n; leftStart += 2 * size) {
            let mid = leftStart + size - 1;
            if (mid >= n - 1) continue;
            let rightEnd = Math.min(leftStart + 2 * size - 1, n - 1);
            
            yield { array: arr, line: 4 };

            const leftArr = arr.slice(leftStart, mid + 1);
            const rightArr = arr.slice(mid + 1, rightEnd + 1);

            let i = 0, j = 0, k = leftStart;

            while (i < leftArr.length && j < rightArr.length) {
                yield { array: arr, comparing: [leftStart + i, mid + 1 + j], line: 9 };
                if (leftArr[i].value <= rightArr[j].value) {
                    arr[k] = leftArr[i];
                    i++;
                } else {
                    arr[k] = rightArr[j];
                    j++;
                }
                yield { array: [...arr], swapping: [k, k], line: 5 }; 
                k++;
            }

            while (i < leftArr.length) {
                arr[k] = leftArr[i];
                yield { array: [...arr], swapping: [k, k], line: 16 };
                i++;
                k++;
            }

            while (j < rightArr.length) {
                arr[k] = rightArr[j];
                yield { array: [...arr], swapping: [k, k], line: 19 };
                j++;
                k++;
            }
        }
    }
    return arr;
}

function* heapSort(arr) {
    let n = arr.length;
    yield { array: arr, line: 1 };
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        yield* heapify(arr, n, i);
    }
    yield { array: arr, line: 4 };
    for (let i = n - 1; i > 0; i--) {
        yield { array: arr, line: 5 };
        yield { array: arr, swapping: [0, i], line: 6 };
        [arr[0], arr[i]] = [arr[i], arr[0]];
        yield { array: arr, swapping: [0, i] };
        yield { array: arr, line: 7 };
        yield* heapify(arr, i, 0);
    }
    return arr;
}

function* heapify(arr, n, i) {
    let largest = i;
    let l = 2 * i + 1;
    let r = 2 * i + 2;
    yield { array: arr, pivot: i, line: 11 };
    if (l < n) {
        yield { array: arr, comparing: [l, largest], line: 12 };
        if(arr[l].value > arr[largest].value) largest = l;
    }
    if (r < n) {
        yield { array: arr, comparing: [r, largest], line: 14 };
        if (arr[r].value > arr[largest].value) largest = r;
    }
    if (largest !== i) {
        yield { array: arr, swapping: [i, largest], line: 17 };
        [arr[i], arr[largest]] = [arr[largest], arr[i]];
        yield { array: arr, swapping: [i, largest] };
        yield { array: arr, line: 18 };
        yield* heapify(arr, n, largest);
    }
}


export const ALGO_DETAILS = {
  bubbleSort: {
    name: 'Bubble Sort',
    complexity: 'Time: O(n²) | Space: O(1)',
    stable: true,
    description: 'Compares adjacent elements and swaps them if they are in the wrong order. This process repeats until the list is sorted.',
    pseudocode: [
      'procedure bubbleSort(A)',
      '  for i from 0 to n–2',
      '    for j from 0 to n-i-2',
      '      if A[j] > A[j+1]',
      '        swap(A[j], A[j+1])',
      '      end if',
      '    if no swaps, break',
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
      'procedure quickSort(A, low, high)',
      '  if low < high',
      '    pi = partition(A, low, high)',
      '    quickSort(A, low, pi - 1)',
      '    quickSort(A, pi + 1, high)',
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
      'procedure mergeSort(A)',
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
        'procedure heapSort(A)',
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

export const ALGO_FUNCTIONS = {
    bubbleSort,
    quickSort,
    mergeSort,
    heapSort
}
