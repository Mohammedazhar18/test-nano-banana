
import React from 'react';
import { Loader2, AlertCircle } from 'lucide-react';

interface EditorCanvasProps {
  image: string;
  isProcessing: boolean;
  error: string | null;
}

const EditorCanvas: React.FC<EditorCanvasProps> = ({ image, isProcessing, error }) => {
  return (
    <div className="relative w-full h-full flex items-center justify-center p-4">
      <div className="relative group max-w-full max-h-full">
        {/* Background Glow */}
        <div className="absolute -inset-4 bg-yellow-500/5 blur-3xl rounded-full opacity-50 pointer-events-none" />
        
        {/* Main Image */}
        <img
          src={image}
          alt="Current Edit"
          className={`max-w-full max-h-[70vh] rounded-2xl shadow-2xl border border-slate-800 object-contain transition-all duration-700 ${
            isProcessing ? 'brightness-50 grayscale blur-sm scale-[0.98]' : 'brightness-100 grayscale-0 blur-0 scale-100'
          }`}
        />

        {/* Loading Overlay */}
        {isProcessing && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
            <div className="w-16 h-16 bg-slate-900/80 backdrop-blur rounded-full flex items-center justify-center mb-4 border border-yellow-500/50">
              <Loader2 className="animate-spin text-yellow-400" size={32} />
            </div>
            <p className="font-medium text-lg text-yellow-500 drop-shadow-md animate-pulse">
              Nano Banana is working...
            </p>
          </div>
        )}

        {/* Error Notification */}
        {error && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-lg shadow-xl flex items-center gap-2 animate-in slide-in-from-top duration-300">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditorCanvas;
