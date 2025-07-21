import React from 'react';

interface ToolPanelProps {
  selectedTool: string;
  onToolSelect: (tool: string) => void;
  onDragStart: (tool: string) => void;
}

const ToolPanel: React.FC<ToolPanelProps> = ({
  selectedTool,
  onToolSelect,
  onDragStart,
}) => {
  const tools = [
    {
      id: 'tile',
      name: 'Tile',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      description: 'Add square or hex tiles to create the game board',
    },
    {
      id: 'token',
      name: 'Token',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="8" strokeWidth={2} />
        </svg>
      ),
      description: 'Add game pieces, tokens, or markers',
    },
    {
      id: 'card',
      name: 'Card',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
      description: 'Add cards with custom text and colors',
    },
    {
      id: 'dice',
      name: 'Dice',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <rect x="4" y="4" width="16" height="16" rx="2" strokeWidth={2} />
          <circle cx="9" cy="9" r="1.5" fill="currentColor" />
          <circle cx="15" cy="9" r="1.5" fill="currentColor" />
          <circle cx="9" cy="15" r="1.5" fill="currentColor" />
          <circle cx="15" cy="15" r="1.5" fill="currentColor" />
        </svg>
      ),
      description: 'Add dice with custom faces and values',
    },
    {
      id: 'path',
      name: 'Path',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      description: 'Create paths or connections between pieces',
    },
    {
      id: 'text',
      name: 'Text',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 2h-4v4h4v-4z" />
        </svg>
      ),
      description: 'Add text labels and descriptions',
    },
    {
      id: 'shape',
      name: 'Shape',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16M4 12h16" />
        </svg>
      ),
      description: 'Add custom shapes like triangles, stars, etc.',
    },
    {
      id: 'counter',
      name: 'Counter',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" strokeWidth={2} />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h8M12 8v8" />
        </svg>
      ),
      description: 'Add counters for tracking scores, resources, etc.',
    },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4 flex items-center">
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
        Tools
      </h2>
      
      <div className="space-y-4">
        {tools.map((tool) => (
          <div
            key={tool.id}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData('tool', tool.id);
              onDragStart(tool.id);
            }}
            onClick={() => onToolSelect(tool.id)}
            className={`p-4 rounded-lg cursor-move transition-all ${
              selectedTool === tool.id
                ? 'bg-primary-50 border-2 border-primary-500'
                : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
            }`}
          >
            <div className="flex items-center">
              <div className={`${
                selectedTool === tool.id ? 'text-primary-600' : 'text-gray-500'
              }`}>
                {tool.icon}
              </div>
              <div className="ml-3">
                <h3 className={`font-medium ${
                  selectedTool === tool.id ? 'text-primary-900' : 'text-gray-900'
                }`}>
                  {tool.name}
                </h3>
                <p className="text-sm text-gray-500">{tool.description}</p>
              </div>
            </div>
          </div>
        ))}

        <div className="mt-6 p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <p className="text-center text-gray-500 text-sm">
            Drag and drop tools onto the board to add pieces
          </p>
        </div>
      </div>
    </div>
  );
};

export default ToolPanel; 