import React, { useState, useEffect, useRef } from 'react';

const HighlightOverlay = ({ highlights, pdfUrl, onCreateHighlight, onDeleteHighlight }) => {
  const [isSelecting, setIsSelecting] = useState(false);
  const [selection, setSelection] = useState(null);
  const [showTooltip, setShowTooltip] = useState(null);
  const overlayRef = useRef(null);

  const handleMouseDown = (e) => {
    setIsSelecting(true);
    setSelection({
      startX: e.clientX,
      startY: e.clientY,
      endX: e.clientX,
      endY: e.clientY
    });
  };

  const handleMouseMove = (e) => {
    if (isSelecting && selection) {
      setSelection(prev => ({
        ...prev,
        endX: e.clientX,
        endY: e.clientY
      }));
    }
  };

  const handleMouseUp = (e) => {
    if (isSelecting && selection) {
      const rect = overlayRef.current.getBoundingClientRect();
      const highlightData = {
        position: {
          top: Math.min(selection.startY, selection.endY) - rect.top,
          left: Math.min(selection.startX, selection.endX) - rect.left,
          width: Math.abs(selection.endX - selection.startX),
          height: Math.abs(selection.endY - selection.startY)
        },
        text: `Highlighted area at (${Math.round((Math.min(selection.startX, selection.endX) - rect.left) / rect.width * 100)}%, ${Math.round((Math.min(selection.startY, selection.endY) - rect.top) / rect.height * 100)}%)`,
        page: 1 // For now, assume single page
      };

      if (highlightData.position.width > 10 && highlightData.position.height > 10) {
        onCreateHighlight(highlightData);
      }
    }
    setIsSelecting(false);
    setSelection(null);
  };

  const getSelectionBox = () => {
    if (!selection) return null;
    
    const rect = overlayRef.current?.getBoundingClientRect();
    if (!rect) return null;

    return {
      left: Math.min(selection.startX, selection.endX) - rect.left,
      top: Math.min(selection.startY, selection.endY) - rect.top,
      width: Math.abs(selection.endX - selection.startX),
      height: Math.abs(selection.endY - selection.startY)
    };
  };

  const selectionBox = getSelectionBox();

  return (
    <div className="relative w-full h-full">
      {/* PDF Iframe */}
      <iframe
        src={pdfUrl}
        width="100%"
        height="100%"
        title="PDF Viewer"
        className="border-0 rounded-b-2xl"
      />
      
      {/* Highlight Overlay */}
      <div
        ref={overlayRef}
        className="absolute inset-0 pointer-events-auto cursor-crosshair"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {/* Existing Highlights */}
        {highlights.map((highlight, index) => (
          <div
            key={highlight._id}
            className="absolute bg-yellow-300 bg-opacity-30 border border-yellow-400 cursor-pointer hover:bg-opacity-50 transition-all duration-200"
            style={{
              top: `${highlight.position.top}px`,
              left: `${highlight.position.left}px`,
              width: `${highlight.position.width}px`,
              height: `${highlight.position.height}px`,
            }}
            onMouseEnter={() => setShowTooltip({ highlight, index })}
            onMouseLeave={() => setShowTooltip(null)}
            onClick={() => onDeleteHighlight(highlight._id)}
          />
        ))}

        {/* Current Selection */}
        {isSelecting && selectionBox && selectionBox.width > 0 && selectionBox.height > 0 && (
          <div
            className="absolute bg-blue-300 bg-opacity-30 border-2 border-blue-500 border-dashed"
            style={{
              left: `${selectionBox.left}px`,
              top: `${selectionBox.top}px`,
              width: `${selectionBox.width}px`,
              height: `${selectionBox.height}px`,
            }}
          />
        )}

        {/* Highlight Tooltip */}
        {showTooltip && (
          <div
            className="absolute bg-black text-white text-xs px-2 py-1 rounded shadow-lg pointer-events-none z-10"
            style={{
              top: `${showTooltip.highlight.position.top - 30}px`,
              left: `${showTooltip.highlight.position.left}px`,
            }}
          >
            <div className="max-w-xs">
              <p className="font-medium">"{showTooltip.highlight.text}"</p>
              <p className="text-gray-300 text-xs mt-1">
                {new Date(showTooltip.highlight.timestamp).toLocaleDateString()}
              </p>
              <p className="text-gray-300 text-xs">Click to delete</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HighlightOverlay;