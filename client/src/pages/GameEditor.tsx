import React, { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Rect, Circle, Text, RegularPolygon, Star, Group } from 'react-konva';
import { useParams, useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import GridLayer from '../components/GridLayer';
import PathConnector from '../components/PathConnector';
import RichTextEditor from '../components/RichTextEditor';
import ToolPanel from '../components/ToolPanel';
import PieceProperties from '../components/PieceProperties';
import axios from 'axios';

interface GamePiece {
  id: string;
  type: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  radius?: number;
  color: string;
  text?: string;
  points?: number[];
  value?: number;
  sides?: number;
  zIndex?: number;
  fontSize?: number;
}

const GRID_SIZE = 20;

export default function GameEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('Untitled Game');
  const [pieces, setPieces] = useState<GamePiece[]>([]);
  const [selectedPiece, setSelectedPiece] = useState<string | null>(null);
  const [selectedTool, setSelectedTool] = useState<string>('tile');
  const [rules, setRules] = useState('');
  const [saving, setSaving] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');
  const stageRef = useRef<any>(null);
  const autoSaveTimerRef = useRef<any>(null);
  const [dragTool, setDragTool] = useState<string | null>(null);
  const stageContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (id) {
      loadGame();
    }
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [id]);

  useEffect(() => {
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }
    if (id) {
      setAutoSaveStatus('saving');
      autoSaveTimerRef.current = setTimeout(() => {
        handleSave(true);
      }, 2000);
    }
  }, [title, pieces, rules]);

  const loadGame = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/games/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const game = response.data;
      setTitle(game.title);
      setPieces(game.pieces);
      setRules(game.rules);
    } catch (error) {
      console.error('Error loading game:', error);
    }
  };

  const snapToGrid = (value: number) => {
    return Math.round(value / GRID_SIZE) * GRID_SIZE;
  };

  const handleAddPiece = () => {
    const baseProps = {
      id: Date.now().toString(),
      type: selectedTool,
      x: snapToGrid(400),
      y: snapToGrid(300),
      color: '#' + Math.floor(Math.random()*16777215).toString(16),
      zIndex: pieces.length,
    };

    let newPiece: GamePiece;

    switch (selectedTool) {
      case 'tile':
        newPiece = {
          ...baseProps,
          width: 40,
          height: 40,
        };
        break;
      case 'token':
        newPiece = {
          ...baseProps,
          radius: 20,
        };
        break;
      case 'card':
        newPiece = {
          ...baseProps,
          width: 100,
          height: 150,
          text: 'New Card',
        };
        break;
      case 'dice':
        newPiece = {
          ...baseProps,
          radius: 25,
          value: Math.floor(Math.random() * 6) + 1,
          color: '#4A5568',
        };
        break;
      case 'text':
        newPiece = {
          ...baseProps,
          text: 'Double click to edit',
          color: '#000000',
        };
        break;
      case 'shape':
        newPiece = {
          ...baseProps,
          sides: 3,
          radius: 30,
        };
        break;
      case 'counter':
        newPiece = {
          ...baseProps,
          radius: 25,
          value: 0,
          color: '#3B82F6',
        };
        break;
      case 'path':
        newPiece = {
          ...baseProps,
          points: [100, 100, 200, 200],
        };
        break;
      default:
        newPiece = baseProps;
    }

    setPieces([...pieces, newPiece]);
    setSelectedPiece(newPiece.id);
  };

  const handleUpdatePiece = (pieceId: string, updates: Partial<GamePiece>) => {
    setPieces(pieces.map(piece =>
      piece.id === pieceId ? { ...piece, ...updates } : piece
    ));
  };

  const handleDeletePiece = (pieceId: string) => {
    setPieces(pieces.filter(piece => piece.id !== pieceId));
    setSelectedPiece(null);
  };

  const handleSave = async (isAutoSave = false) => {
    try {
      if (!isAutoSave) setSaving(true);
      const token = localStorage.getItem('token');
      const data = {
        title,
        pieces,
        rules
      };

      if (id) {
        await axios.put(`${process.env.REACT_APP_API_URL}/api/games/${id}`, data, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/games`, data, {
          headers: { Authorization: `Bearer ${token}` }
        });
        navigate(`/editor/${response.data.id}`);
      }
      if (isAutoSave) {
        setAutoSaveStatus('saved');
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Error saving game:', error);
      if (isAutoSave) {
        setAutoSaveStatus('error');
      } else {
        alert('Failed to save game');
      }
    } finally {
      if (!isAutoSave) setSaving(false);
    }
  };

  const handleExportPDF = async () => {
    const pdf = new jsPDF();
    
    // Add game board screenshot
    const canvas = stageRef.current.getStage().toCanvas();
    const imgData = canvas.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', 10, 10, 190, 100);
    
    // Add rules
    pdf.setFontSize(12);
    pdf.text('Game Rules:', 10, 120);
    pdf.setFontSize(10);
    const splitRules = pdf.splitTextToSize(rules, 180);
    pdf.text(splitRules, 10, 130);
    
    pdf.save(`${title}.pdf`);
  };

  const renderDice = (piece: GamePiece, props: any) => {
    const size = piece.radius! * 2;
    return (
      <Group {...props} x={piece.x - piece.radius!} y={piece.y - piece.radius!}>
        <Rect
          width={size}
          height={size}
          fill={piece.color}
          cornerRadius={5}
        />
        <Text
          text={piece.value?.toString() || '1'}
          fontSize={size * 0.6}
          fill="#ffffff"
          width={size}
          height={size}
          align="center"
          verticalAlign="middle"
        />
      </Group>
    );
  };

  const renderShape = (piece: GamePiece, props: any) => {
    if (piece.sides === 5) {
      return (
        <Star
          {...props}
          numPoints={5}
          innerRadius={piece.radius! * 0.5}
          outerRadius={piece.radius!}
          fill={piece.color}
        />
      );
    }
    return (
      <RegularPolygon
        {...props}
        sides={piece.sides || 3}
        radius={piece.radius!}
        fill={piece.color}
      />
    );
  };

  const renderCounter = (piece: GamePiece, props: any) => {
    return (
      <Group {...props}>
        <Circle
          radius={piece.radius!}
          fill={piece.color}
        />
        <Text
          text={piece.value?.toString() || '0'}
          fontSize={piece.radius! * 0.8}
          fill="#ffffff"
          width={piece.radius! * 2}
          height={piece.radius! * 2}
          offsetX={piece.radius!}
          offsetY={piece.radius!}
          align="center"
          verticalAlign="middle"
        />
      </Group>
    );
  };

  const handlePieceClick = (piece: GamePiece) => {
    if (selectedPiece === piece.id) {
      // If piece is already selected
      if (piece.type === 'dice') {
        // Roll dice on click when selected
        handleUpdatePiece(piece.id, { value: Math.floor(Math.random() * 6) + 1 });
      } else if (piece.type === 'counter') {
        // Increment counter on click when selected
        handleUpdatePiece(piece.id, { value: (piece.value || 0) + 1 });
      }
    } else {
      setSelectedPiece(piece.id);
    }
  };

  const handlePieceDoubleClick = (piece: GamePiece) => {
    // Show properties panel
    setSelectedPiece(piece.id);

    // For text pieces, enable direct editing
    if (piece.type === 'text' || piece.type === 'card') {
      const newText = window.prompt('Enter new text:', piece.text);
      if (newText !== null) {
        handleUpdatePiece(piece.id, { text: newText });
      }
    }
  };

  const renderPiece = (piece: GamePiece) => {
    const commonProps = {
      key: piece.id,
      x: piece.x,
      y: piece.y,
      onClick: () => handlePieceClick(piece),
      onTap: () => handlePieceClick(piece),
      onDblClick: () => handlePieceDoubleClick(piece),
      onDblTap: () => handlePieceDoubleClick(piece),
      draggable: true,
      onDragEnd: (e: any) => {
        handleUpdatePiece(piece.id, {
          x: snapToGrid(e.target.x()),
          y: snapToGrid(e.target.y()),
        });
      },
      stroke: selectedPiece === piece.id ? '#00ff00' : undefined,
      strokeWidth: 2,
    };

    switch (piece.type) {
      case 'path':
        if (!piece.points) return null;
        return (
          <PathConnector
            {...commonProps}
            points={piece.points}
            isSelected={selectedPiece === piece.id}
            onSelect={() => setSelectedPiece(piece.id)}
            onDragMove={(newPoints) => {
              handleUpdatePiece(piece.id, { points: newPoints });
            }}
          />
        );

      case 'token':
        return (
          <Circle
            {...commonProps}
            radius={piece.radius || 20}
            fill={piece.color}
          />
        );

      case 'dice':
        return (
          <Group {...commonProps}>
            <Rect
              width={piece.radius! * 2}
              height={piece.radius! * 2}
              fill={piece.color}
              cornerRadius={5}
            />
            <Text
              text={piece.value?.toString() || '1'}
              fontSize={piece.radius! * 1.2}
              fill="#ffffff"
              width={piece.radius! * 2}
              height={piece.radius! * 2}
              align="center"
              verticalAlign="middle"
            />
          </Group>
        );

      case 'shape':
        if (piece.sides === 5) {
          return (
            <Star
              {...commonProps}
              numPoints={5}
              innerRadius={piece.radius! * 0.5}
              outerRadius={piece.radius!}
              fill={piece.color}
            />
          );
        }
        return (
          <RegularPolygon
            {...commonProps}
            sides={piece.sides || 3}
            radius={piece.radius!}
            fill={piece.color}
          />
        );

      case 'text':
        return (
          <Text
            {...commonProps}
            text={piece.text || ''}
            fontSize={piece.fontSize || 24}
            fill={piece.color}
            padding={5}
          />
        );

      case 'counter':
        return (
          <Group {...commonProps}>
            <Circle
              radius={piece.radius!}
              fill={piece.color}
            />
            <Text
              text={piece.value?.toString() || '0'}
              fontSize={piece.radius! * 0.8}
              fill="#ffffff"
              width={piece.radius! * 2}
              height={piece.radius! * 2}
              offsetX={piece.radius!}
              offsetY={piece.radius!}
              align="center"
              verticalAlign="middle"
            />
          </Group>
        );

      case 'card':
        return (
          <Group {...commonProps}>
            <Rect
              width={piece.width || 100}
              height={piece.height || 150}
              fill={piece.color}
            />
            <Text
              text={piece.text || ''}
              fontSize={piece.fontSize || 16}
              fill="#ffffff"
              width={(piece.width || 100) - 20}
              padding={10}
              align="center"
              verticalAlign="middle"
            />
          </Group>
        );

      default:
        return (
          <Rect
            {...commonProps}
            width={piece.width || 40}
            height={piece.height || 40}
            fill={piece.color}
          />
        );
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const tool = e.dataTransfer.getData('tool');
    if (!tool || !stageContainerRef.current) return;

    const stageContainer = stageContainerRef.current;
    const stage = stageRef.current;
    const containerRect = stageContainer.getBoundingClientRect();
    
    // Calculate position relative to stage
    const x = snapToGrid(e.clientX - containerRect.left);
    const y = snapToGrid(e.clientY - containerRect.top);

    // Create new piece at drop position
    const baseProps = {
      id: Date.now().toString(),
      type: tool,
      x,
      y,
      color: '#' + Math.floor(Math.random()*16777215).toString(16),
      zIndex: pieces.length,
    };

    let newPiece: GamePiece;

    switch (tool) {
      case 'tile':
        newPiece = {
          ...baseProps,
          width: 40,
          height: 40,
        };
        break;
      case 'token':
        newPiece = {
          ...baseProps,
          radius: 20,
        };
        break;
      case 'card':
        newPiece = {
          ...baseProps,
          width: 100,
          height: 150,
          text: 'New Card',
        };
        break;
      case 'dice':
        newPiece = {
          ...baseProps,
          radius: 25,
          value: Math.floor(Math.random() * 6) + 1,
          color: '#4A5568',
        };
        break;
      case 'text':
        newPiece = {
          ...baseProps,
          text: 'Double click to edit',
          color: '#000000',
        };
        break;
      case 'shape':
        newPiece = {
          ...baseProps,
          sides: 3,
          radius: 30,
        };
        break;
      case 'counter':
        newPiece = {
          ...baseProps,
          radius: 25,
          value: 0,
          color: '#3B82F6',
        };
        break;
      case 'path':
        newPiece = {
          ...baseProps,
          points: [x, y, x + 100, y + 100],
        };
        break;
      default:
        newPiece = baseProps;
    }

    setPieces([...pieces, newPiece]);
    setSelectedPiece(newPiece.id);
    setDragTool(null);
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white border-b px-4 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-3xl font-bold text-gray-900 bg-transparent border-b-2 border-transparent focus:border-primary-500 focus:outline-none"
            />
            <div className="text-sm text-gray-500">
              {autoSaveStatus === 'saving' && 'Saving...'}
              {autoSaveStatus === 'saved' && 'All changes saved'}
              {autoSaveStatus === 'error' && 'Error saving changes'}
            </div>
          </div>
          <div className="space-x-4">
            <button
              onClick={() => handleSave()}
              disabled={saving}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Game'}
            </button>
            <button
              onClick={handleExportPDF}
              className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
            >
              Export PDF
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Tools */}
        <div className="w-72 flex-shrink-0 border-r bg-gray-50 overflow-y-auto">
          <div className="p-4">
            <ToolPanel
              selectedTool={selectedTool}
              onToolSelect={setSelectedTool}
              onDragStart={(tool) => setDragTool(tool)}
            />
          </div>
        </div>

        {/* Center - Game Board */}
        <div className="flex-1 flex flex-col items-center justify-center bg-gray-100 p-4">
          <div 
            ref={stageContainerRef}
            className={`bg-white rounded-lg shadow-lg ${dragTool ? 'ring-2 ring-primary-500 ring-opacity-50' : ''}`}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <Stage
              width={800}
              height={600}
              ref={stageRef}
              className="border border-gray-200 rounded-lg"
            >
              <GridLayer width={800} height={600} gridSize={GRID_SIZE} />
              <Layer>
                {pieces
                  .sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0))
                  .map(renderPiece)}
              </Layer>
            </Stage>
          </div>

          {/* Rules Section */}
          <div className="w-full max-w-3xl mt-4 bg-white rounded-lg shadow-lg p-4">
            <h2 className="text-lg font-semibold mb-4">Game Rules</h2>
            <RichTextEditor value={rules} onChange={setRules} />
          </div>
        </div>

        {/* Right Sidebar - Properties */}
        <div className="w-80 flex-shrink-0 border-l bg-gray-50">
          {selectedPiece ? (
            <div className="p-4">
              <PieceProperties
                piece={pieces.find(p => p.id === selectedPiece)!}
                onUpdate={(updates) => handleUpdatePiece(selectedPiece, updates)}
                onDelete={() => handleDeletePiece(selectedPiece)}
              />
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <p className="font-medium">No Piece Selected</p>
              <p className="text-sm mt-1">Click on a piece to view and edit its properties</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 