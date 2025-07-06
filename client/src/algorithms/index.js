// File: /client/src/algorithms/index.js

function* bubbleSort(arr) {
  let n = arr.length;
  let comparisons = 0;
  let swaps = 0;
  
  for (let i = 0; i < n - 1; i++) {
    let hasSwapped = false;
    yield { array: arr, line: 1, comparisons, swaps };
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
    if(!hasSwapped) {
        yield { array: arr, line: 6, comparisons, swaps };
        break;
    };
  }
  return arr;
}

function* quickSort(arr) {
    let comparisons = 0;
    let swaps = 0;
    const stack = [{ low: 0, high: arr.length - 1 }];
    yield { array: arr, line: 1, comparisons, swaps };
    
    while (stack.length > 0) {
        const { low, high } = stack.pop();
        yield { array: arr, line: 2, comparisons, swaps };

        if (low < high) {
            yield { array: arr, line: 3, comparisons, swaps };
            const partitionGenerator = partition(arr, low, high);
            let partitionResult = partitionGenerator.next();
            while(!partitionResult.done) {
                comparisons += partitionResult.value.newComparisons || 0;
                swaps += partitionResult.value.newSwaps || 0;
                yield { ...partitionResult.value, comparisons, swaps };
                partitionResult = partitionGenerator.next();
            }
            const pivotIndex = partitionResult.value;

            yield { array: arr, line: 4, comparisons, swaps };
            stack.push({ low, high: pivotIndex - 1 });
            yield { array: arr, line: 5, comparisons, swaps };
            stack.push({ low: pivotIndex + 1, high });
        }
    }
    yield { array: arr, line: 7, comparisons, swaps };
    return arr;
}

function* partition(arr, low, high) {
    const pivot = arr[high];
    let i = low - 1;
    yield { array: arr, pivot: high, line: 10, newComparisons: 0, newSwaps: 0 };

    for (let j = low; j < high; j++) {
        yield { array: arr, comparing: [j, high], line: 11, newComparisons: 1, newSwaps: 0 };
        if (arr[j].value < pivot.value) {
            i++;
            yield { array: arr, swapping: [i, j], line: 12, newComparisons: 0, newSwaps: 1 };
            [arr[i], arr[j]] = [arr[j], arr[i]];
            yield { array: arr, swapping: [i, j], line: 13 };
        }
    }
    
    yield { array: arr, swapping: [i + 1, high], line: 15, newComparisons: 0, newSwaps: 1 };
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    yield { array: arr, swapping: [i + 1, high], line: 16 };
    
    return i + 1;
}

function* mergeSort(arr) {
    let comparisons = 0;
    let swaps = 0; // Represents data writes in this context
    let n = arr.length;
    let workArray = [...arr]; // Use a working array to merge into
    yield { array: arr, line: 1, comparisons, swaps };
  
    for (let size = 1; size < n; size *= 2) {
        yield { array: arr, line: 2, comparisons, swaps };
        for (let leftStart = 0; leftStart < n; leftStart += 2 * size) {
            let mid = Math.min(leftStart + size - 1, n - 1);
            let rightEnd = Math.min(leftStart + 2 * size - 1, n - 1);
            
            yield { array: arr, line: 4, comparisons, swaps };
            const mergeGenerator = merge(arr, leftStart, mid, rightEnd, workArray);
            let mergeResult = mergeGenerator.next();
            while(!mergeResult.done){
                comparisons += mergeResult.value.newComparisons || 0;
                swaps += mergeResult.value.newSwaps || 0;
                yield { ...mergeResult.value, comparisons, swaps};
                mergeResult = mergeGenerator.next();
            }
            // Copy merged data back to main array for visualization
            for(let i = leftStart; i <= rightEnd; i++){
                arr[i] = workArray[i];
            }
            yield { array: [...arr], line: 5, comparisons, swaps };
        }
    }
    return arr;
}

function* merge(arr, left, mid, right, resultArr) {
    let k = left, i = left, j = mid + 1;
    yield { array: arr, line: 8, newComparisons: 0, newSwaps: 0 };
    while (i <= mid && j <= right) {
        yield { array: arr, comparing: [i, j], line: 9, newComparisons: 1, newSwaps: 0 };
        if (arr[i].value <= arr[j].value) {
            resultArr[k] = arr[i];
            i++;
            yield { array: arr, line: 10, newComparisons: 0, newSwaps: 1};
        } else {
            resultArr[k] = arr[j];
            j++;
            yield { array: arr, line: 12, newComparisons: 0, newSwaps: 1};
        }
        k++;
    }
    while (i <= mid) {
        resultArr[k] = arr[i];
        i++;
        k++;
        yield { array: arr, line: 16, newComparisons: 0, newSwaps: 1};
    }
    while (j <= right) {
        resultArr[k] = arr[j];
        j++;
        k++;
        yield { array: arr, line: 19, newComparisons: 0, newSwaps: 1};
    }
}

function* heapSort(arr) {
    let n = arr.length;
    let comparisons = 0;
    let swaps = 0;
    yield { array: arr, line: 1, comparisons, swaps };

    // Build heap (rearrange array)
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        yield { array: arr, line: 3, comparisons, swaps };
        const heapifyGen = heapify(arr, n, i);
        let heapifyResult = heapifyGen.next();
        while(!heapifyResult.done){
            comparisons += heapifyResult.value.newComparisons || 0;
            swaps += heapifyResult.value.newSwaps || 0;
            yield { ...heapifyResult.value, comparisons, swaps };
            heapifyResult = heapifyGen.next();
        }
    }
    yield { array: arr, line: 4, comparisons, swaps };

    // One by one extract an element from heap
    for (let i = n - 1; i > 0; i--) {
        yield { array: arr, line: 5, comparisons, swaps };
        swaps++;
        yield { array: arr, swapping: [0, i], line: 6, comparisons, swaps };
        [arr[0], arr[i]] = [arr[i], arr[0]];
        yield { array: arr, swapping: [0, i] }; // Show the swap
        
        yield { array: arr, line: 7, comparisons, swaps };
        const heapifyGen = heapify(arr, i, 0);
        let heapifyResult = heapifyGen.next();
        while(!heapifyResult.done){
            comparisons += heapifyResult.value.newComparisons || 0;
            swaps += heapifyResult.value.newSwaps || 0;
            yield { ...heapifyResult.value, comparisons, swaps };
            heapifyResult = heapifyGen.next();
        }
    }
    return arr;
}

function* heapify(arr, n, i) {
    let largest = i;
    let l = 2 * i + 1;
    let r = 2 * i + 2;
    yield { array: arr, pivot: i, line: 11, newComparisons: 0, newSwaps: 0 };
    
    if (l < n) {
        yield { array: arr, comparing: [l, largest], line: 12, newComparisons: 1, newSwaps: 0 };
        if(arr[l].value > arr[largest].value) largest = l;
    }
    
    if (r < n) {
        yield { array: arr, comparing: [r, largest], line: 14, newComparisons: 1, newSwaps: 0 };
        if (arr[r].value > arr[largest].value) largest = r;
    }
    
    if (largest !== i) {
        yield { array: arr, swapping: [i, largest], line: 17, newComparisons: 0, newSwaps: 1 };
        [arr[i], arr[largest]] = [arr[largest], arr[i]];
        yield { array: arr, swapping: [i, largest] };
        
        const heapifyGen = heapify(arr, n, largest);
        let heapifyResult = heapifyGen.next();
        while(!heapifyResult.done){
            yield { ...heapifyResult.value };
            heapifyResult = heapifyGen.next();
        }
    }
}

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
