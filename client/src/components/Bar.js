import React from 'react';
import { PALETTE } from '../constants';

const Bar = React.memo(({ value, color, height, width, isComparing, isSwapping, isPivot }) => {
  let currentBgColor = color;
  let border = '1px solid rgba(0, 0, 0, 0.1)';

  if (isComparing) currentBgColor = PALETTE.comparing;
  if (isSwapping) currentBgColor = PALETTE.swapping;
  if (isPivot) border = `3px solid ${PALETTE.pivot}`;

  const barStyle = {
    height: `${height}%`,
    width: `${width}%`,
    backgroundColor: currentBgColor,
    border: border,
    transition: 'all 0.3s ease',
  };

  return (
    <div className="flex flex-col items-center justify-end h-full">
      <div className="w-full rounded-t-md shadow-md" style={barStyle}></div>
      <span className="text-xs mt-1 font-semibold text-gray-700">{value}</span>
    </div>
  );
});

export default Bar;