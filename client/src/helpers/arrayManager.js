// File: /client/src/helpers/arrayManager.js
import { PALETTE, PATTERNS } from '../constants';

const processArrayForVisualization = (arr, isColorBlindMode) => {
    const valueCounts = {};
    const items = arr.map((value, index) => {
        valueCounts[value] = (valueCounts[value] || 0) + 1;
        return { value, id: index, comparisons: 0, swaps: 0 };
    });

    const duplicateValues = Object.keys(valueCounts).filter(v => valueCounts[v] > 1);
    const colorMap = {};
    const patternKeys = Object.keys(PATTERNS);

    duplicateValues.forEach((val, i) => {
        const baseColor = [Math.random() * 255, Math.random() * 255, Math.random() * 255];
        colorMap[val] = { 
            base: `rgb(${baseColor[0]}, ${baseColor[1]}, ${baseColor[2]})`, 
            shades: [],
            patternId: patternKeys[i % patternKeys.length] // Cycle through patterns
        };
    });

    return items.map(item => {
        if (duplicateValues.includes(String(item.value))) {
            const info = colorMap[item.value];
            if (isColorBlindMode) {
                return { ...item, color: PALETTE.cb_base, patternId: info.patternId };
            } else {
                const shadeFactor = 1 - (info.shades.length * 0.2);
                const newShade = `rgba(${info.base.slice(4,-1)}, ${Math.max(0.3, shadeFactor)})`;
                info.shades.push(newShade);
                return { ...item, color: newShade };
            }
        }
        return { ...item, color: PALETTE.default };
    });
};

export const generateRandomArray = (isColorBlindMode, size) => {
    const newArr = [];
    for (let i = 0; i < size; i++) {
        newArr.push(Math.floor(Math.random() * 90) + 10);
    }
    return processArrayForVisualization(newArr, isColorBlindMode);
};

export const parseCustomArray = (inputString, isColorBlindMode, maxSize = null) => {
    if (!inputString) return [];
    let arr = inputString
        .split(',')
        .map(s => s.trim())
        .filter(s => !isNaN(s) && s !== '')
        .map(Number)
        .filter(n => n >= 0 && n <= 100);

    if (maxSize && arr.length > maxSize) {
        arr = arr.slice(0, maxSize);
    }
    return processArrayForVisualization(arr, isColorBlindMode);
};