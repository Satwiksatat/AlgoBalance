// File: /client/src/helpers/arrayManager.js
import { PALETTE } from '../constants';

export const generateVisualizerArray = () => {
  const newArr = [];
  const size = 20;
  const valueCounts = {};

  for (let i = 0; i < size; i++) {
      const value = Math.floor(Math.random() * 90) + 10;
      newArr.push({ value, id: i });
      valueCounts[value] = (valueCounts[value] || 0) + 1;
  }
  
  const duplicateValues = Object.keys(valueCounts).filter(v => valueCounts[v] > 1);
  const colorMap = {};
  duplicateValues.forEach(val => {
      const baseColor = [Math.random() * 255, Math.random() * 255, Math.random() * 255];
      colorMap[val] = { base: `rgb(${baseColor[0]}, ${baseColor[1]}, ${baseColor[2]})`, shades: [] };
  });

  const finalArray = newArr.map(item => {
      if (duplicateValues.includes(String(item.value))) {
          const colorInfo = colorMap[item.value];
          const shadeFactor = 1 - (colorInfo.shades.length * 0.2);
          const newShade = `rgba(${colorInfo.base.slice(4,-1)}, ${Math.max(0.3, shadeFactor)})`;
          colorInfo.shades.push(newShade);
          return { ...item, color: newShade };
      }
      return { ...item, color: PALETTE.default };
  });

  return finalArray;
};