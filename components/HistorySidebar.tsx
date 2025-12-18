
import React from 'react';
import { ImageHistoryItem } from '../types';
import { Clock } from 'lucide-react';

interface HistorySidebarProps {
  history: ImageHistoryItem[];
  currentId?: string;
  onSelect: (item: ImageHistoryItem) => void;
}

const HistorySidebar: React.FC<HistorySidebarProps> = ({ history, currentId, onSelect }) => {
  if (history.length === 0) return null;

  return (
    <aside className="w-72 bg-slate-900/50 border-l border-slate-800 flex flex-col overflow-hidden hidden lg:flex">
      <div className="p-4 border-b border-slate-800 flex items-center gap-2 font-semibold text-slate-400">
        <Clock size={18} />
        <span>Edit History</span>
        <span className="ml-auto bg-slate-800 px-2 py-0.5 rounded text-xs text-slate-500">
          {history.length}
        </span>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {history.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item)}
            className={`w-full group text-left rounded-xl overflow-hidden border transition-all ${
              currentId === item.id 
                ? 'border-yellow-500/50 bg-slate-800' 
                : 'border-slate-800 hover:border-slate-700 bg-slate-900/40'
            }`}
          >
            <div className="aspect-square w-full relative">
              <img
                src={item.url}
                alt={item.prompt}
                className="w-full h-full object-cover"
              />
              {currentId === item.id && (
                <div className="absolute inset-0 bg-yellow-500/10 ring-2 ring-yellow-500/50 ring-inset" />
              )}
            </div>
            <div className="p-3">
              <p className="text-xs text-slate-400 font-medium line-clamp-2 leading-relaxed italic">
                "{item.prompt}"
              </p>
              <p className="text-[10px] text-slate-600 mt-2 uppercase tracking-widest font-bold">
                {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </button>
        ))}
      </div>
    </aside>
  );
};

export default HistorySidebar;
