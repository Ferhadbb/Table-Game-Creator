import React from 'react';
import { useNavigate } from 'react-router-dom';

interface GameCardProps {
  id: string;
  title: string;
  createdAt: string;
  pieces: any[];
  onDelete: (id: string) => void;
}

const GameCard: React.FC<GameCardProps> = ({ id, title, createdAt, pieces, onDelete }) => {
  const navigate = useNavigate();

  const getPreviewColor = () => {
    if (pieces.length === 0) return '#e5e7eb';
    return pieces[0].color || '#e5e7eb';
  };

  return (
    <div className="group relative bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
      {/* Preview Area */}
      <div 
        className="h-48 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center cursor-pointer"
        onClick={() => navigate(`/editor/${id}`)}
      >
        <div className="relative w-32 h-32">
          <div 
            className="absolute inset-0 rounded-lg transform -rotate-6 transition-transform group-hover:rotate-0"
            style={{ backgroundColor: getPreviewColor() }}
          />
          {pieces.length > 0 && (
            <div className="absolute inset-0 rounded-lg transform rotate-3 transition-transform group-hover:rotate-0 opacity-75"
              style={{ backgroundColor: pieces[pieces.length - 1].color }}
            />
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
          {title}
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Created: {new Date(createdAt).toLocaleDateString()}
        </p>
        
        {/* Stats */}
        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <span>{pieces.length} pieces</span>
          </div>
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span>Last viewed today</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => navigate(`/editor/${id}`)}
            className="text-primary-600 hover:text-primary-800 font-medium flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </button>
          <button
            onClick={() => onDelete(id)}
            className="text-red-600 hover:text-red-800 font-medium flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameCard; 