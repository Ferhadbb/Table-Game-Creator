import React, { useState } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange }) => {
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [fontSize, setFontSize] = useState('16px');
  const [textColor, setTextColor] = useState('#000000');

  const handleStyleClick = (style: string) => {
    const textarea = document.querySelector('.rich-text-editor textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);

    let newText = value;
    let newStart = start;
    let newEnd = end;

    switch (style) {
      case 'bold':
        if (!isBold) {
          newText = value.slice(0, start) + `**${selectedText}**` + value.slice(end);
          newEnd = end + 4;
        } else {
          newText = value.slice(0, start - 2) + selectedText + value.slice(end + 2);
          newEnd = end - 4;
        }
        setIsBold(!isBold);
        break;
      case 'italic':
        if (!isItalic) {
          newText = value.slice(0, start) + `_${selectedText}_` + value.slice(end);
          newEnd = end + 2;
        } else {
          newText = value.slice(0, start - 1) + selectedText + value.slice(end + 1);
          newEnd = end - 2;
        }
        setIsItalic(!isItalic);
        break;
      case 'underline':
        if (!isUnderline) {
          newText = value.slice(0, start) + `__${selectedText}__` + value.slice(end);
          newEnd = end + 4;
        } else {
          newText = value.slice(0, start - 2) + selectedText + value.slice(end + 2);
          newEnd = end - 4;
        }
        setIsUnderline(!isUnderline);
        break;
    }

    onChange(newText);
    
    // Restore selection after state update
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newStart, newEnd);
    }, 0);
  };

  return (
    <div className="rich-text-editor border rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="bg-gray-50 border-b p-2 flex flex-wrap gap-2">
        <div className="flex space-x-1 items-center">
          <button
            onClick={() => handleStyleClick('bold')}
            className={`p-2 rounded hover:bg-gray-200 ${isBold ? 'bg-gray-200' : ''}`}
            title="Bold"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M12.6 10.9c.9-.6 1.4-1.5 1.4-2.6 0-2.4-1.9-3.3-4.3-3.3H5v13h5.2c2.5 0 4.8-1.1 4.8-3.8 0-1.6-.9-2.7-2.4-3.3zM7.2 7h2.5c1.2 0 1.9.6 1.9 1.6s-.7 1.6-1.9 1.6H7.2V7zm2.7 9H7.2v-3.8h2.7c1.4 0 2.2.7 2.2 1.9s-.8 1.9-2.2 1.9z" />
            </svg>
          </button>
          <button
            onClick={() => handleStyleClick('italic')}
            className={`p-2 rounded hover:bg-gray-200 ${isItalic ? 'bg-gray-200' : ''}`}
            title="Italic"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M14.5 5h-9L6 7h2.9l-2.1 6H4l-.5 2h9l.5-2h-2.9l2.1-6H15z" />
            </svg>
          </button>
          <button
            onClick={() => handleStyleClick('underline')}
            className={`p-2 rounded hover:bg-gray-200 ${isUnderline ? 'bg-gray-200' : ''}`}
            title="Underline"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 17c3.3 0 6-2.7 6-6V3.5h-2.5v7.5c0 1.9-1.6 3.5-3.5 3.5S6.5 12.9 6.5 11V3.5H4V11c0 3.3 2.7 6 6 6zm-7.5 1v1h15v-1h-15z" />
            </svg>
          </button>
        </div>

        <div className="h-6 w-px bg-gray-300" />

        <div className="flex space-x-2 items-center">
          <select
            value={fontSize}
            onChange={(e) => setFontSize(e.target.value)}
            className="rounded border-gray-300 text-sm"
            title="Font Size"
          >
            <option value="12px">Small</option>
            <option value="16px">Normal</option>
            <option value="20px">Large</option>
            <option value="24px">Huge</option>
          </select>

          <input
            type="color"
            value={textColor}
            onChange={(e) => setTextColor(e.target.value)}
            className="w-8 h-8 rounded cursor-pointer"
            title="Text Color"
          />
        </div>

        <div className="h-6 w-px bg-gray-300" />

        <div className="flex space-x-1 items-center">
          <button
            onClick={() => onChange(value + '\n• ')}
            className="p-2 rounded hover:bg-gray-200"
            title="Bullet List"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4 5h12v2H4zm0 4h12v2H4zm0 4h12v2H4z" />
            </svg>
          </button>
          <button
            onClick={() => onChange(value + '\n1. ')}
            className="p-2 rounded hover:bg-gray-200"
            title="Number List"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 5h12v2H3zm0 4h12v2H3zm0 4h12v2H3z M2 4h1v1H2zm0 4h1v1H2zm0 4h1v1H2z" />
            </svg>
          </button>
        </div>

        <div className="h-6 w-px bg-gray-300" />

        <div className="flex space-x-1 items-center">
          <button
            onClick={() => onChange(value + '\n---\n')}
            className="p-2 rounded hover:bg-gray-200"
            title="Add Divider"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 10h14v1H3z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full min-h-[200px] p-4 focus:outline-none resize-y"
          placeholder="Write your game rules here..."
          dir="ltr"
          style={{ 
            fontSize,
            color: textColor,
            lineHeight: '1.5',
          }}
        />
        <div className="absolute bottom-2 right-2 text-xs text-gray-400">
          {value.length} characters
        </div>
      </div>

      {/* Preview */}
      {value && (
        <div className="border-t p-4 bg-gray-50">
          <div className="text-sm font-medium text-gray-500 mb-2">Preview:</div>
          <div 
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ 
              __html: value
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/_(.*?)_/g, '<em>$1</em>')
                .replace(/__(.*?)__/g, '<u>$1</u>')
                .replace(/\n/g, '<br>')
                .replace(/• (.*?)(\n|$)/g, '<li>$1</li>')
                .replace(/\d\. (.*?)(\n|$)/g, '<li>$1</li>')
                .replace(/---/g, '<hr>')
            }} 
          />
        </div>
      )}
    </div>
  );
};

export default RichTextEditor; 