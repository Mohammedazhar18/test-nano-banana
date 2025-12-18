
import React, { useState } from 'react';
import { Send, Wand2 } from 'lucide-react';

interface PromptBarProps {
  onSend: (prompt: string) => void;
  isProcessing: boolean;
}

const SUGGESTIONS = [
  "Add a retro film filter",
  "Convert into a watercolor painting",
  "Make it look like a rainy cyberpunk night",
  "Change the background to a tropical beach",
  "Add a fluffy cat sitting in the corner",
  "Turn this into a 3D pixel art"
];

const PromptBar: React.FC<PromptBarProps> = ({ onSend, isProcessing }) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isProcessing) {
      onSend(prompt.trim());
      setPrompt('');
    }
  };

  const useSuggestion = (text: string) => {
    setPrompt(text);
  };

  return (
    <div className="w-full bg-slate-900/80 backdrop-blur-xl border-t border-slate-800 p-6 z-20">
      <div className="max-w-4xl mx-auto flex flex-col gap-4">
        {/* Suggestions chips */}
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mr-2 shrink-0">
            <Wand2 size={12} /> Suggestions
          </div>
          {SUGGESTIONS.map((s, idx) => (
            <button
              key={idx}
              onClick={() => useSuggestion(s)}
              disabled={isProcessing}
              className="shrink-0 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm rounded-full transition-colors whitespace-nowrap border border-slate-700/50"
            >
              {s}
            </button>
          ))}
        </div>

        {/* Main Input Form */}
        <form onSubmit={handleSubmit} className="relative group">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isProcessing}
            placeholder="Tell Nano Banana what to do... (e.g. 'Add a sunset')"
            className="w-full h-14 pl-6 pr-16 bg-slate-800/50 border border-slate-700 rounded-2xl text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/40 focus:border-yellow-500/50 transition-all"
          />
          <button
            type="submit"
            disabled={!prompt.trim() || isProcessing}
            className="absolute right-2 top-2 bottom-2 px-6 banana-gradient text-slate-900 font-bold rounded-xl transition-all hover:shadow-[0_0_15px_rgba(234,179,8,0.3)] active:scale-95 disabled:opacity-30 disabled:hover:shadow-none flex items-center gap-2"
          >
            <span className="hidden sm:inline">Apply</span>
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default PromptBar;
