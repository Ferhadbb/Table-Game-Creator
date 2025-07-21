import React from 'react';
import { Layer, Line } from 'react-konva';

interface GridLayerProps {
  width: number;
  height: number;
  gridSize: number;
}

const GridLayer: React.FC<GridLayerProps> = ({ width, height, gridSize }) => {
  const gridLines = [];
  
  // Vertical lines
  for (let i = 0; i <= width; i += gridSize) {
    gridLines.push(
      <Line
        key={`v${i}`}
        points={[i, 0, i, height]}
        stroke="#ddd"
        strokeWidth={1}
      />
    );
  }
  
  // Horizontal lines
  for (let i = 0; i <= height; i += gridSize) {
    gridLines.push(
      <Line
        key={`h${i}`}
        points={[0, i, width, i]}
        stroke="#ddd"
        strokeWidth={1}
      />
    );
  }

  return <Layer>{gridLines}</Layer>;
};

export default GridLayer; 