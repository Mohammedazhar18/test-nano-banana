
import React, { useState, useCallback, useRef } from 'react';
import { geminiService } from './geminiService';
import { ImageHistoryItem } from './types';
import EditorCanvas from './components/EditorCanvas';
import PromptBar from './components/PromptBar';
import HistorySidebar from './components/HistorySidebar';
import { Camera, Image as ImageIcon, Sparkles, Undo2, Download, Trash2 } from 'lucide-react';

const App: React.FC = () => {
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [history, setHistory] = useState<ImageHistoryItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setCurrentImage(result);
        const newItem: ImageHistoryItem = {
          id: crypto.randomUUID(),
          url: result,
          prompt: 'Original Upload',
          timestamp: Date.now(),
        };
        setHistory([newItem]);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = async (prompt: string) => {
    if (!currentImage) return;

    setIsProcessing(true);
    setError(null);
    try {
      const newImageUrl = await geminiService.editImage(currentImage, prompt);
      const newItem: ImageHistoryItem = {
        id: crypto.randomUUID(),
        url: newImageUrl,
        prompt: prompt,
        timestamp: Date.now(),
      };
      setCurrentImage(newImageUrl);
      setHistory((prev) => [newItem, ...prev]);
    } catch (err) {
      setError('Failed to edit image. Please try again.');
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUndo = () => {
    if (history.length > 1) {
      const newHistory = [...history];
      newHistory.shift(); // Remove current
      setHistory(newHistory);
      setCurrentImage(newHistory[0].url);
    }
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to clear the editor?')) {
      setCurrentImage(null);
      setHistory([]);
      setError(null);
    }
  };

  const downloadImage = () => {
    if (!currentImage) return;
    const link = document.createElement('a');
    link.href = currentImage;
    link.download = `nano-banana-edit-${Date.now()}.png`;
    link.click();
  };

  const selectHistoryItem = (item: ImageHistoryItem) => {
    setCurrentImage(item.url);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-950 overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 banana-gradient rounded-xl flex items-center justify-center shadow-lg shadow-yellow-500/20">
            <Sparkles className="text-slate-900" size={24} />
          </div>
          <h1 className="text-xl font-bold tracking-tight">
            Nano <span className="banana-text-gradient">Banana</span> Editor
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {currentImage && (
            <>
              <button
                onClick={handleUndo}
                disabled={history.length <= 1 || isProcessing}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-30"
                title="Undo"
              >
                <Undo2 size={20} />
              </button>
              <button
                onClick={downloadImage}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                title="Download"
              >
                <Download size={20} />
              </button>
              <button
                onClick={handleReset}
                className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                title="Reset"
              >
                <Trash2 size={20} />
              </button>
            </>
          )}
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 flex overflow-hidden relative">
        <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950">
          {!currentImage ? (
            <div className="flex flex-col items-center text-center max-w-md animate-in fade-in zoom-in duration-500">
              <div className="w-24 h-24 banana-gradient rounded-3xl flex items-center justify-center mb-8 shadow-2xl shadow-yellow-500/20 rotate-3">
                <ImageIcon className="text-slate-900" size={48} />
              </div>
              <h2 className="text-3xl font-bold mb-4">Start Creating</h2>
              <p className="text-slate-400 mb-8 leading-relaxed">
                Upload a photo and use the power of Nano Banana (Gemini 2.5 Flash Image) to edit it using just your words.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-6 py-3 bg-white text-slate-900 font-semibold rounded-xl hover:bg-slate-100 transition-all active:scale-95 flex items-center gap-2"
                >
                  <ImageIcon size={20} />
                  Upload Photo
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            </div>
          ) : (
            <EditorCanvas 
              image={currentImage} 
              isProcessing={isProcessing} 
              error={error}
            />
          )}
        </div>

        {/* History Sidebar */}
        <HistorySidebar 
          history={history} 
          currentId={history[0]?.id} 
          onSelect={selectHistoryItem} 
        />
      </main>

      {/* Prompt Bar - Sticky Bottom */}
      {currentImage && (
        <PromptBar 
          onSend={handleEdit} 
          isProcessing={isProcessing} 
        />
      )}
    </div>
  );
};

export default App;
