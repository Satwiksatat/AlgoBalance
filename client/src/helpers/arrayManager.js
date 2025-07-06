// client/src/helpers/arrayManager.js
import { PALETTE, PATTERNS } from '../constants';

/**
 * Processes a raw array of numbers into an array of objects suitable for visualization.
 * Each item will have a value, a unique ID, and initial comparison/swap counts.
 * It also handles assigning colors/patterns for duplicate values, considering colorblind mode.
 * @param {number[]} arr - The raw array of numbers.
 * @param {boolean} isColorBlindMode - Flag to determine if colorblind-friendly colors/patterns should be used.
 * @returns {Array<Object>} An array of processed items for visualization.
 */
const processArrayForVisualization = (arr, isColorBlindMode) => {
    const valueCounts = {};
    // Create initial items with value and unique ID
    const items = arr.map((value, index) => {
        valueCounts[value] = (valueCounts[value] || 0) + 1; // Count occurrences of each value
        return { value, id: index, comparisons: 0, swaps: 0 };
    });

    // Identify values that appear more than once
    const duplicateValues = Object.keys(valueCounts).filter(v => valueCounts[v] > 1);
    const colorMap = {}; // Map to store color/pattern info for duplicate values
    const patternKeys = Object.keys(PATTERNS); // Get available pattern keys

    // Assign a base color and pattern for each unique duplicate value
    duplicateValues.forEach((val, i) => {
        // Generate a random base color for non-colorblind mode
        const baseColor = [Math.random() * 255, Math.random() * 255, Math.random() * 255];
        colorMap[val] = {
            base: `rgb(${baseColor[0]}, ${baseColor[1]}, ${baseColor[2]})`,
            shades: [], // To store shades for individual duplicate bars
            patternId: patternKeys[i % patternKeys.length] // Cycle through available patterns
        };
    });

    // Map items to their final visualization format with colors/patterns
    return items.map(item => {
        if (duplicateValues.includes(String(item.value))) {
            const info = colorMap[item.value];
            if (isColorBlindMode) {
                // In colorblind mode, use a standard base color and a unique pattern
                return { ...item, color: PALETTE.cb_base, patternId: info.patternId };
            } else {
                // In non-colorblind mode, generate shades of the base color for duplicates
                const shadeFactor = 1 - (info.shades.length * 0.2); // Gradually darker shades
                const newShade = `rgba(${info.base.slice(4,-1)}, ${Math.max(0.3, shadeFactor)})`;
                info.shades.push(newShade);
                return { ...item, color: newShade };
            }
        }
        // For unique values, use the default color
        return { ...item, color: PALETTE.default };
    });
};

/**
 * Generates an array with random numbers.
 * @param {number} size - The desired size of the array.
 * @param {boolean} isColorBlindMode - Flag for colorblind mode processing.
 * @returns {Array<Object>} The processed array for visualization.
 */
export const generateRandomArray = (size, isColorBlindMode = false) => {
    const newArr = [];
    for (let i = 0; i < size; i++) {
        newArr.push(Math.floor(Math.random() * 90) + 10); // Numbers between 10 and 99
    }
    return processArrayForVisualization(newArr, isColorBlindMode);
};

/**
 * Generates a nearly sorted array.
 * @param {number} size - The desired size of the array.
 * @param {boolean} isColorBlindMode - Flag for colorblind mode processing.
 * @returns {Array<Object>} The processed array for visualization.
 */
export const generateNearlySortedArray = (size, isColorBlindMode = false) => {
    const newArr = [];
    for (let i = 0; i < size; i++) {
        newArr.push(i + 1); // Start with a sorted array
    }
    // Perform a few random swaps to make it nearly sorted
    const numSwaps = Math.floor(size * 0.05); // 5% of elements swapped
    for (let i = 0; i < numSwaps; i++) {
        const idx1 = Math.floor(Math.random() * size);
        const idx2 = Math.floor(Math.random() * size);
        [newArr[idx1], newArr[idx2]] = [newArr[idx2], newArr[idx1]];
    }
    return processArrayForVisualization(newArr, isColorBlindMode);
};

/**
 * Generates a reversed sorted array.
 * @param {number} size - The desired size of the array.
 * @param {boolean} isColorBlindMode - Flag for colorblind mode processing.
 * @returns {Array<Object>} The processed array for visualization.
 */
export const generateReversedArray = (size, isColorBlindMode = false) => {
    const newArr = [];
    for (let i = 0; i < size; i++) {
        newArr.push(size - i); // Numbers in descending order
    }
    return processArrayForVisualization(newArr, isColorBlindMode);
};

/**
 * Generates an array with a few unique values (many duplicates).
 * @param {number} size - The desired size of the array.
 * @param {boolean} isColorBlindMode - Flag for colorblind mode processing.
 * @returns {Array<Object>} The processed array for visualization.
 */
export const generateFewUniqueArray = (size, isColorBlindMode = false) => {
    const newArr = [];
    const uniqueValues = [10, 30, 50, 70, 90]; // A small set of unique values
    for (let i = 0; i < size; i++) {
        const randomIndex = Math.floor(Math.random() * uniqueValues.length);
        newArr.push(uniqueValues[randomIndex]);
    }
    return processArrayForVisualization(newArr, isColorBlindMode);
};

/**
 * Parses a comma-separated string into an array of numbers.
 * @param {string} inputString - The string to parse (e.g., "10, 5, 20").
 * @param {boolean} isColorBlindMode - Flag for colorblind mode processing.
 * @returns {Array<Object>} The processed array for visualization.
 */
export const parseCustomArray = (inputString, isColorBlindMode = false) => {
    if (!inputString) return [];
    const arr = inputString
        .split(',')
        .map(s => s.trim()) // Remove whitespace
        .filter(s => !isNaN(s) && s !== '') // Filter out non-numeric or empty strings
        .map(Number) // Convert to numbers
        .filter(n => n >= 0 && n <= 100); // Ensure numbers are within a reasonable range
    return processArrayForVisualization(arr, isColorBlindMode);
};
