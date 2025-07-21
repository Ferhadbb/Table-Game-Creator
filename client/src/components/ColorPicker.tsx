import React, { useState } from 'react';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ color, onChange }) => {
  const [showCustom, setShowCustom] = useState(false);

  const presetColors = [
    '#EF4444', // red
    '#F97316', // orange
    '#F59E0B', // amber
    '#84CC16', // lime
    '#10B981', // emerald
    '#06B6D4', // cyan
    '#3B82F6', // blue
    '#6366F1', // indigo
    '#8B5CF6', // violet
    '#EC4899', // pink
    '#ffffff', // white
    '#000000', // black
  ];

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg">
      <div className="grid grid-cols-6 gap-2 mb-4">
        {presetColors.map((presetColor) => (
          <button
            key={presetColor}
            className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
              color === presetColor ? 'border-primary-500' : 'border-gray-200'
            }`}
            style={{ backgroundColor: presetColor }}
            onClick={() => onChange(presetColor)}
          />
        ))}
      </div>

      <button
        className="text-sm text-gray-600 hover:text-primary-600 flex items-center"
        onClick={() => setShowCustom(!showCustom)}
      >
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        {showCustom ? 'Hide Custom Color' : 'Custom Color'}
      </button>

      {showCustom && (
        <div className="mt-2">
          <input
            type="color"
            value={color}
            onChange={(e) => onChange(e.target.value)}
            className="w-full h-10 rounded cursor-pointer"
          />
        </div>
      )}
    </div>
  );
};

export default ColorPicker; 