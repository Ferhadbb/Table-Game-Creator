import React from 'react';
import { Line, Circle } from 'react-konva';

interface PathConnectorProps {
  points: number[];
  isSelected: boolean;
  onSelect: () => void;
  onDragMove: (newPoints: number[]) => void;
}

const PathConnector: React.FC<PathConnectorProps> = ({
  points,
  isSelected,
  onSelect,
  onDragMove,
}) => {
  const handleDragMove = (index: number) => (e: any) => {
    const newPoints = [...points];
    newPoints[index * 2] = e.target.x();
    newPoints[index * 2 + 1] = e.target.y();
    onDragMove(newPoints);
  };

  return (
    <>
      <Line
        points={points}
        stroke={isSelected ? "#00ff00" : "#666"}
        strokeWidth={2}
        tension={0.5}
        onClick={onSelect}
      />
      {isSelected &&
        Array.from({ length: points.length / 2 }, (_, i) => (
          <Circle
            key={i}
            x={points[i * 2]}
            y={points[i * 2 + 1]}
            radius={4}
            fill="#00ff00"
            draggable
            onDragMove={handleDragMove(i)}
          />
        ))}
    </>
  );
};

export default PathConnector; 