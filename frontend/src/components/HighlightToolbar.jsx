import React, { useState } from 'react';

const HighlightToolbar = ({ selectedText, position, onCreateHighlight, onCancel }) => {
  const [note, setNote] = useState('');
  const [color, setColor] = useState('yellow');

  const colors = [
    { name: 'yellow', bg: 'bg-yellow-200', border: 'border-yellow-400' },
    { name: 'green', bg: 'bg-green-200', border: 'border-green-400' },
    { name: 'blue', bg: 'bg-blue-200', border: 'border-blue-400' },
    { name: 'pink', bg: 'bg-pink-200', border: 'border-pink-400' },
    { name: 'purple', bg: 'bg-purple-200', border: 'border-purple-400' },
  ];

  const handleCreate = () => {
    onCreateHighlight({
      text: selectedText,
      note,
      color,
      position
    });
    setNote('');
    setColor('yellow');
  };

  return (
    <div 
      className="fixed bg-white/95 backdrop-blur-lg shadow-2xl rounded-2xl border border-white/20 p-6 z-50 animate-fade-in-up max-w-sm"
      style={{
        top: Math.min(position.top + position.height + 10, window.innerHeight - 300),
        left: Math.min(position.left, window.innerWidth - 400),
      }}
    >
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
          <svg className="w-5 h-5 mr-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
          Create Highlight
        </h3>
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <p className="text-sm text-gray-600 mb-1">Selected text:</p>
          <p className="text-sm font-medium text-gray-900 italic">"{selectedText}"</p>
        </div>
      </div>

      {/* Color Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Highlight Color</label>
        <div className="flex space-x-2">
          {colors.map((colorOption) => (
            <button
              key={colorOption.name}
              onClick={() => setColor(colorOption.name)}
              className={`w-8 h-8 rounded-full ${colorOption.bg} ${colorOption.border} border-2 transform transition-all duration-200 hover:scale-110 ${
                color === colorOption.name ? 'ring-2 ring-gray-400 ring-offset-2' : ''
              }`}
            />
          ))}
        </div>
      </div>

      {/* Note Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Add Note (Optional)</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Add a note to this highlight..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none"
          rows={3}
        />
      </div>

      {/* Actions */}
      <div className="flex space-x-3">
        <button
          onClick={handleCreate}
          className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white py-2 px-4 rounded-lg font-medium transform transition-all duration-200 hover:scale-105"
        >
          Create Highlight
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default HighlightToolbar;