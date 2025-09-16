import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import HighlightOverlay from './HighlightOverlay';

const PDFViewer = () => {
  const { uuid } = useParams();
  const navigate = useNavigate();
  const { api } = useAuth();
  const [highlights, setHighlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [selectedText, setSelectedText] = useState('');
  const [showHighlightPanel, setShowHighlightPanel] = useState(false);
  const [highlightMode, setHighlightMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const iframeRef = useRef(null);

  const token = localStorage.getItem('accessToken');

  console.log('PDFViewer - UUID:', uuid);
  console.log('PDFViewer - Token:', token ? 'Present' : 'Missing');

  useEffect(() => {
    fetchHighlights();
    loadPDFAsBlob();
  }, [uuid]);

  const loadPDFAsBlob = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/v1/api/pdfs/${uuid}/view`, { responseType: 'blob' });
      console.log('PDF loaded successfully:', response.data.size, 'bytes');
      
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const blobUrl = URL.createObjectURL(blob);
      setPdfUrl(blobUrl);
      setLoading(false);
      
    } catch (error) {
      console.error('Failed to load PDF:', error);
      setError(`Failed to load PDF: ${error.response?.status || error.message}`);
      setLoading(false);
    }
  };



  const fetchHighlights = async () => {
    try {
      const response = await api.get(`/v1/api/highlights/${uuid}`);
      setHighlights(response.data.data);
      console.log('Highlights loaded:', response.data.data.length);
    } catch (error) {
      console.error('Error fetching highlights:', error);
    }
  };

  const createHighlight = async (highlightData) => {
    try {
      const response = await api.post('/v1/api/highlights', {
        pdfUuid: uuid,
        page: highlightData.page || currentPage,
        text: highlightData.text,
        position: highlightData.position
      });
      
      // Refresh highlights
      await fetchHighlights();
      
      // Show success message
      setSelectedText('');
      
      return response.data.data;
    } catch (error) {
      console.error('Error creating highlight:', error);
      alert('Failed to create highlight. Please try again.');
      throw error;
    }
  };

  const deleteHighlight = async (highlightId) => {
    try {
      await api.delete(`/v1/api/highlights/${highlightId}`);
      fetchHighlights();
    } catch (error) {
      console.error('Error deleting highlight:', error);
    }
  };

  const updateHighlight = async (highlightId, updateData) => {
    try {
      await api.put(`/v1/api/highlights/${highlightId}`, updateData);
      fetchHighlights();
    } catch (error) {
      console.error('Error updating highlight:', error);
    }
  };

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0 && selection.toString().trim()) {
      const selectedText = selection.toString().trim();
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      
      setSelectedText(selectedText);
      
      // Show highlight creation dialog
      if (highlightMode) {
        const highlightData = {
          text: selectedText,
          position: {
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height
          }
        };
        
        createHighlight(highlightData);
        selection.removeAllRanges();
        setSelectedText('');
      }
    }
  };

  const toggleHighlightMode = () => {
    setHighlightMode(!highlightMode);
    if (!highlightMode) {
      document.addEventListener('mouseup', handleTextSelection);
    } else {
      document.removeEventListener('mouseup', handleTextSelection);
    }
  };

  useEffect(() => {
    return () => {
      document.removeEventListener('mouseup', handleTextSelection);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      <header className="relative bg-white/80 backdrop-blur-lg shadow-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center space-x-2 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-6 py-3 rounded-lg font-medium transform transition-all duration-200 hover:scale-105 shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back to Library</span>
            </button>
            
            <div className="flex items-center space-x-4">
              {/* Highlight Mode Toggle */}
              <button
                onClick={toggleHighlightMode}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transform transition-all duration-200 hover:scale-105 ${
                  highlightMode 
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg' 
                    : 'bg-white/60 backdrop-blur-sm border border-white/30 text-gray-700 hover:bg-white/80'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                <span>{highlightMode ? 'Exit Highlight Mode' : 'Highlight Mode'}</span>
              </button>

              {/* Highlights Panel Toggle */}
              <button
                onClick={() => setShowHighlightPanel(!showHighlightPanel)}
                className="flex items-center space-x-2 bg-white/60 backdrop-blur-sm border border-white/30 text-gray-700 px-4 py-2 rounded-lg font-medium transform transition-all duration-200 hover:scale-105 hover:bg-white/80"
              >
                <svg className="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a1.994 1.994 0 01-1.414.586H7a4 4 0 01-4-4V7a4 4 0 014-4z" />
                </svg>
                <span>{highlights.length} Highlights</span>
              </button>

              {/* Status Indicator */}
              <div className="bg-white/60 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/30">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>PDF Ready</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="relative max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="flex gap-6">
          {/* PDF Viewer */}
          <div className={`bg-white/80 backdrop-blur-lg shadow-2xl rounded-2xl border border-white/20 overflow-hidden animate-fade-in-up transition-all duration-300 ${
            showHighlightPanel ? 'flex-1' : 'w-full'
          }`}>
            {/* Highlight Mode Banner */}
            {highlightMode && (
              <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-3 text-center font-medium">
                <div className="flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  <span>Highlight Mode Active - Draw rectangles over text to highlight</span>
                </div>
              </div>
            )}

            {/* Instructions */}
            {!highlightMode && highlights.length === 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 m-6">
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h4 className="text-sm font-medium text-blue-900 mb-1">How to highlight text</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Click "Highlight Mode" to enable highlighting</li>
                      <li>• Draw rectangles over text you want to highlight</li>
                      <li>• Use "Add Manual Highlight" to add text-based highlights</li>
                      <li>• View all highlights in the side panel</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {loading && (
              <div className="flex flex-col justify-center items-center py-16">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-4"></div>
                <div className="text-xl font-medium text-gray-700">Loading PDF...</div>
                <div className="text-sm text-gray-500 mt-2">Please wait while we prepare your document</div>
              </div>
            )}
            
            {error && (
              <div className="flex flex-col justify-center items-center py-16">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-xl font-medium text-red-600 mb-2">Failed to Load PDF</div>
                <div className="text-sm text-gray-500">{error}</div>
              </div>
            )}

            {pdfUrl && !loading && !error && (
              <div className="relative" style={{ height: '800px' }}>
                {highlightMode ? (
                  <HighlightOverlay
                    highlights={highlights}
                    pdfUrl={pdfUrl}
                    onCreateHighlight={createHighlight}
                    onDeleteHighlight={deleteHighlight}
                  />
                ) : (
                  <iframe
                    ref={iframeRef}
                    src={pdfUrl}
                    width="100%"
                    height="100%"
                    title="PDF Viewer"
                    className="border-0 rounded-b-2xl"
                  />
                )}
              </div>
            )}
          </div>

          {/* Highlights Panel */}
          {showHighlightPanel && (
            <div className="w-80 bg-white/80 backdrop-blur-lg shadow-2xl rounded-2xl border border-white/20 animate-fade-in-up">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a1.994 1.994 0 01-1.414.586H7a4 4 0 01-4-4V7a4 4 0 014-4z" />
                    </svg>
                    Highlights
                  </h3>
                  <button
                    onClick={() => setShowHighlightPanel(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {highlights.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a1.994 1.994 0 01-1.414.586H7a4 4 0 01-4-4V7a4 4 0 014-4z" />
                        </svg>
                      </div>
                      <p className="text-gray-500 text-sm">No highlights yet</p>
                      <p className="text-gray-400 text-xs mt-1">Enable highlight mode to start highlighting</p>
                    </div>
                  ) : (
                    highlights.map((highlight, index) => (
                      <div 
                        key={highlight._id} 
                        className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 animate-fade-in-up"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            Page {highlight.page}
                          </span>
                          <button
                            onClick={() => deleteHighlight(highlight._id)}
                            className="text-red-400 hover:text-red-600 transition-colors duration-200"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                        <p className="text-sm text-gray-800 leading-relaxed">"{highlight.text}"</p>
                        <p className="text-xs text-gray-400 mt-2">
                          {new Date(highlight.timestamp).toLocaleDateString()} at {new Date(highlight.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    ))
                  )}
                </div>

                {/* Add Highlight Manually */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      const text = prompt('Enter text to highlight:');
                      if (text && text.trim()) {
                        createHighlight({
                          text: text.trim(),
                          page: 1,
                          position: {
                            top: Math.random() * 100,
                            left: Math.random() * 100,
                            width: 200,
                            height: 20
                          }
                        });
                      }
                    }}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-2 px-4 rounded-lg font-medium transform transition-all duration-200 hover:scale-105 text-sm"
                  >
                    + Add Manual Highlight
                  </button>
                  
                  {highlights.length > 0 && (
                    <div className="text-center text-sm text-gray-500 mt-4">
                      {highlights.length} highlight{highlights.length !== 1 ? 's' : ''} total
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Selected Text Popup */}
        {selectedText && !highlightMode && (
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-lg shadow-2xl rounded-2xl border border-white/20 p-4 animate-fade-in-up z-50">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1">Selected text:</p>
                <p className="text-sm font-medium text-gray-900 max-w-xs truncate">"{selectedText}"</p>
              </div>
              <button
                onClick={() => {
                  setHighlightMode(true);
                  handleTextSelection();
                }}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transform transition-all duration-200 hover:scale-105"
              >
                Highlight
              </button>
              <button
                onClick={() => setSelectedText('')}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default PDFViewer;
