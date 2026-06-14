import React from 'react';
import { IconDefinition, StrokeConfig } from '../types';
import GridOverlay from './GridOverlay';
import { Sparkles, ArrowRight } from 'lucide-react';

interface IconGridProps {
  icons: IconDefinition[];
  config: StrokeConfig;
  activeId: string;
  onSelectIcon: (id: string) => void;
}

export default function IconGrid({ icons, config, activeId, onSelectIcon }: IconGridProps) {
  return (
    <div className="flex flex-col gap-4">
      
      {/* Set Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h3 className="text-sm font-semibold text-slate-700 tracking-wider uppercase flex items-center gap-2">
            Set Ikon Seragam ({icons.length} Aset)
          </h3>
          <p className="text-[11px] text-slate-500">
            Klik pada kartu ikon di bawah untuk memuatnya ke dalam Inspektur dan menguji detail ukuran responsif.
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] bg-slate-50 border border-slate-100 rounded-full px-3 py-1 font-medium text-slate-500">
          <Sparkles size={11} className="text-amber-500" />
          Tata Letak Terpadu
        </div>
      </div>

      {/* Grid of Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4" id="visual-icon-grid">
        {icons.map((icon) => {
          const isActive = icon.id === activeId;
          
          return (
            <div
              key={icon.id}
              onClick={() => onSelectIcon(icon.id)}
              className={`rounded-2xl border p-5 flex flex-col items-center justify-between gap-4 cursor-pointer transition-all relative group select-none ${
                isActive
                  ? 'bg-blue-50/40 border-[#1a73e8] shadow-sm ring-1 ring-[#1a73e8]'
                  : 'bg-white border-slate-100 shadow-xs hover:border-slate-300 hover:shadow-xs'
              }`}
              id={`icon-card-${icon.id}`}
            >
              
              {/* Outer icon container inside card */}
              <div 
                className={`w-32 h-32 rounded-xl transition-colors relative flex items-center justify-center border ${
                  config.backgroundColor === 'white' ? 'bg-white border-slate-100' : config.backgroundColor === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-transparent border-dashed'
                }`}
              >
                {/* Visual guidelines when globally enabled */}
                {config.showGuidelines && (
                  <GridOverlay color={config.backgroundColor === 'dark' ? '#38bdf8' : config.primaryColor} />
                )}

                {/* Actual vector representation */}
                <svg
                  viewBox="0 0 100 100"
                  className="w-24 h-24 relative z-10 transition-transform group-hover:scale-105"
                >
                  {icon.render(config)}
                </svg>
              </div>

              {/* Title & subtitle metadata */}
              <div className="w-full text-center flex flex-col items-center">
                <span className="text-xs font-semibold text-slate-800 line-clamp-1 group-hover:text-[#1a73e8] transition-colors">
                  {icon.title}
                </span>
                <span className="text-[10px] text-slate-400 font-mono mt-0.5 mt-0.5 capitalize tracking-wide">
                  {icon.id.replace('-', ' ')}
                </span>
              </div>

              {/* Active check indicator inside card corner */}
              {isActive && (
                <div className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#1a73e8]" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
