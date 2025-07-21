import React, { useState } from 'react';
import ColorPicker from './ColorPicker';

interface PiecePropertiesProps {
  piece: any;
  onUpdate: (updates: any) => void;
  onDelete: () => void;
}

const PieceProperties: React.FC<PiecePropertiesProps> = ({
  piece,
  onUpdate,
  onDelete,
}) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleDiceRoll = () => {
    onUpdate({ value: Math.floor(Math.random() * 6) + 1 });
  };

  const handleCounterChange = (increment: number) => {
    onUpdate({ value: (piece.value || 0) + increment });
  };

  const handleShapeChange = (sides: number) => {
    onUpdate({ sides });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          {piece.type.charAt(0).toUpperCase() + piece.type.slice(1)} Properties
        </h3>
        <button
          onClick={onDelete}
          className="text-red-600 hover:text-red-800"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      <div className="space-y-6">
        {/* Color */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Color
          </label>
          <div className="relative">
            <button
              className="w-full h-10 rounded border flex items-center px-3 hover:border-primary-500"
              onClick={() => setShowColorPicker(!showColorPicker)}
            >
              <div
                className="w-6 h-6 rounded mr-2"
                style={{ backgroundColor: piece.color }}
              />
              <span className="text-gray-600">{piece.color}</span>
            </button>
            {showColorPicker && (
              <div className="absolute z-10 mt-2">
                <ColorPicker
                  color={piece.color}
                  onChange={(color) => {
                    onUpdate({ color });
                    setShowColorPicker(false);
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Dice Controls */}
        {piece.type === 'dice' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dice Value
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="number"
                min="1"
                max="6"
                value={piece.value || 1}
                onChange={(e) => onUpdate({ value: Number(e.target.value) })}
                className="w-20 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
              <button
                onClick={handleDiceRoll}
                className="bg-primary-100 text-primary-700 px-4 py-2 rounded-md hover:bg-primary-200 flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
                Roll
              </button>
            </div>
          </div>
        )}

        {/* Counter Controls */}
        {piece.type === 'counter' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Counter Value
            </label>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleCounterChange(-5)}
                className="bg-gray-100 text-gray-700 px-3 py-2 rounded hover:bg-gray-200"
              >
                -5
              </button>
              <button
                onClick={() => handleCounterChange(-1)}
                className="bg-gray-100 text-gray-700 px-3 py-2 rounded hover:bg-gray-200"
              >
                -1
              </button>
              <input
                type="number"
                value={piece.value || 0}
                onChange={(e) => onUpdate({ value: Number(e.target.value) })}
                className="w-20 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-center"
              />
              <button
                onClick={() => handleCounterChange(1)}
                className="bg-gray-100 text-gray-700 px-3 py-2 rounded hover:bg-gray-200"
              >
                +1
              </button>
              <button
                onClick={() => handleCounterChange(5)}
                className="bg-gray-100 text-gray-700 px-3 py-2 rounded hover:bg-gray-200"
              >
                +5
              </button>
            </div>
          </div>
        )}

        {/* Shape Controls */}
        {piece.type === 'shape' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Shape Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[3, 4, 5, 6, 8].map((sides) => (
                <button
                  key={sides}
                  onClick={() => handleShapeChange(sides)}
                  className={`p-2 rounded ${
                    piece.sides === sides
                      ? 'bg-primary-100 text-primary-700 border-2 border-primary-500'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {sides === 3 ? 'Triangle' :
                   sides === 4 ? 'Square' :
                   sides === 5 ? 'Star' :
                   sides === 6 ? 'Hexagon' :
                   'Octagon'}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Text Content */}
        {(piece.type === 'text' || piece.type === 'card') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Text Content
            </label>
            <textarea
              value={piece.text || ''}
              onChange={(e) => onUpdate({ text: e.target.value })}
              rows={3}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
            <div className="mt-2 space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Font Size
              </label>
              <input
                type="range"
                min="12"
                max="48"
                value={piece.fontSize || 16}
                onChange={(e) => onUpdate({ fontSize: Number(e.target.value) })}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>12px</span>
                <span>{piece.fontSize || 16}px</span>
                <span>48px</span>
              </div>
            </div>
          </div>
        )}

        {/* Size Controls */}
        {(piece.type === 'tile' || piece.type === 'card') && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Width
              </label>
              <input
                type="number"
                value={piece.width}
                onChange={(e) => onUpdate({ width: Number(e.target.value) })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Height
              </label>
              <input
                type="number"
                value={piece.height}
                onChange={(e) => onUpdate({ height: Number(e.target.value) })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>
          </>
        )}

        {/* Radius for circular pieces */}
        {(piece.type === 'token' || piece.type === 'dice' || piece.type === 'counter' || piece.type === 'shape') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Size
            </label>
            <input
              type="range"
              min="10"
              max="100"
              value={piece.radius || 20}
              onChange={(e) => onUpdate({ radius: Number(e.target.value) })}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>Small</span>
              <span>{piece.radius || 20}px</span>
              <span>Large</span>
            </div>
          </div>
        )}

        {/* Layer Controls */}
        <div className="flex space-x-2">
          <button
            onClick={() => onUpdate({ zIndex: (piece.zIndex || 0) + 1 })}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
            Bring Forward
          </button>
          <button
            onClick={() => onUpdate({ zIndex: (piece.zIndex || 0) - 1 })}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            Send Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default PieceProperties; 