import React, { useState } from 'react';
import { IconDefinition, StrokeConfig } from '../types';
import { getRawSvgString } from '../utils/svgHelpers';
import GridOverlay from './GridOverlay';
import { Copy, Check, Download, ExternalLink, Code, Eye, EyeOff } from 'lucide-react';

interface InspectorPanelProps {
  icon: IconDefinition;
  config: StrokeConfig;
  onDownloadSingle: (id: string, format: 'svg' | 'png' | 'eps') => void;
}

export default function InspectorPanel({ icon, config, onDownloadSingle }: InspectorPanelProps) {
  const [copied, setCopied] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const rawSvgCode = getRawSvgString(icon, config);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(rawSvgCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code', err);
    }
  };

  // List of responsive scale tests to render inside the tester row
  const sizeScales = [
    { pSize: 24, label: '24px' },
    { pSize: 48, label: '48px' },
    { pSize: 128, label: '128px' },
    { pSize: 256, label: '256px' }
  ];

  return (
    <div id={`inspector-panel-${icon.id}`} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col gap-6 h-full select-none">
      
      {/* Icon Details Section */}
      <div className="flex flex-col gap-1 border-b border-slate-50 pb-4">
        <span className="text-[10px] uppercase font-bold tracking-widest text-[#1a73e8] bg-blue-50 px-2.5 py-1 rounded-full w-fit">
          {icon.concept}
        </span>
        <h2 className="text-xl font-bold text-slate-800 tracking-tight mt-2">{icon.title}</h2>
        <p className="text-xs text-slate-500 leading-relaxed mt-1">{icon.description}</p>
      </div>

      {/* Focus Canvas & Scale Testing */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        
        {/* Core Big Preview Canvas */}
        <div className="md:col-span-7 flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-100 relative min-h-[280px]">
          {/* Subtle canvas visual grid coordinate background */}
          <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px] opacity-30" />
          
          <div 
            className={`w-44 h-44 rounded-xl shadow-xs transition-colors relative flex items-center justify-center overflow-hidden border border-slate-200 z-10 ${
              config.backgroundColor === 'white' ? 'bg-white' : config.backgroundColor === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-transparent border-dashed'
            }`}
            id="inspector-focus-frame"
          >
            {/* Real SVG rendering */}
            <svg 
              viewBox="0 0 100 100" 
              className="w-32 h-32 relative z-10 select-none pointer-events-none"
            >
              {icon.render(config)}
            </svg>
            
            {/* Guidelines visual overlay */}
            {config.showGuidelines && (
              <GridOverlay color={config.backgroundColor === 'dark' ? '#38bdf8' : '#1a73e8'} />
            )}
          </div>
          
          <span className="text-[10px] text-slate-400 font-mono mt-3 select-none">
            Skala: Kotak Kanvas 1024 × 1024
          </span>
        </div>

        {/* Small Scale Testing Rows (legibility confirmation) */}
        <div className="md:col-span-5 flex flex-col justify-between py-1 gap-4">
          <div className="flex flex-col gap-2">
            <h3 className="text-xs font-semibold text-slate-700 tracking-wider uppercase">Verifikasi Skala</h3>
            <p className="text-[11px] text-slate-500 leading-normal">
              Uji konsistensi ketebalan garis & ketajaman keterbacaan pada ukuran mikro hingga ukuran 24px standar.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3" id="scale-verification-matrix">
            {sizeScales.map((scale) => (
              <div 
                key={scale.pSize} 
                className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex flex-col items-center justify-center gap-2"
                id={`scale-preview-${scale.pSize}`}
              >
                <div 
                  style={{ width: `${scale.pSize}px`, height: `${scale.pSize}px` }}
                  className={`rounded border flex items-center justify-center overflow-hidden transition-colors ${
                    config.backgroundColor === 'white' ? 'bg-white border-slate-200' : config.backgroundColor === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-transparent border-slate-200 border-dashed'
                  }`}
                >
                  <svg 
                    viewBox="0 0 100 100" 
                    className="w-[85%] h-[85%] select-none pointer-events-none"
                  >
                    {icon.render(config)}
                  </svg>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[11px] font-semibold text-slate-700">{scale.label}</span>
                  <span className="text-[9px] text-slate-400 font-mono">Cek garis</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Code & Export Action Drawer */}
      <div className="flex flex-col gap-3.5 border-t border-slate-100 pt-5 mt-auto">
        
        {/* Toggle Code and Export */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowCode(!showCode)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
            id={`btn-toggle-code-${icon.id}`}
          >
            <Code size={14} />
            {showCode ? 'Sembunyikan XML SVG' : 'Inspeksi XML SVG'}
          </button>

          <div className="flex gap-2">
            <button
              onClick={handleCopyCode}
              className={`flex items-center justify-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                copied 
                  ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' 
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
              id={`btn-copy-${icon.id}`}
            >
              {copied ? <Check size={13} /> : <Copy size={13} />}
              {copied ? 'Tersalin' : 'Salin Kode'}
            </button>
          </div>
        </div>

        {/* Expandable Code panel */}
        {showCode && (
          <div className="relative mt-1" id={`svg-code-panel-${icon.id}`}>
            <pre className="max-h-40 overflow-y-auto text-[10px] font-mono bg-slate-900 text-slate-300 p-3.5 rounded-xl border border-slate-800 leading-normal scrollbar-thin select-all">
              {rawSvgCode}
            </pre>
            <div className="absolute top-2 right-2 flex gap-1 bg-slate-900/80 backdrop-blur-xs rounded-md p-1 border border-slate-700">
              <button 
                onClick={handleCopyCode} 
                title="Copy code" 
                className="p-1 hover:text-white text-slate-400 transition-colors cursor-pointer"
                id={`btn-code-copy-inner-${icon.id}`}
              >
                {copied ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
              </button>
            </div>
          </div>
        )}

        {/* Individual File Download */}
        <div className="grid grid-cols-3 gap-2.5 mt-1">
          <button
            onClick={() => onDownloadSingle(icon.id, 'svg')}
            className="flex items-center justify-center gap-1.5 px-2.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-xl transition-colors cursor-pointer border border-transparent"
            id={`btn-dl-single-svg-${icon.id}`}
          >
            <Download size={13} />
            SVG
          </button>

          <button
            onClick={() => onDownloadSingle(icon.id, 'eps')}
            className="flex items-center justify-center gap-1.5 px-2.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl transition-colors cursor-pointer shadow-xs"
            id={`btn-dl-single-eps-${icon.id}`}
          >
            <Download size={13} />
            EPS
          </button>
          
          <button
            onClick={() => onDownloadSingle(icon.id, 'png')}
            className="flex items-center justify-center gap-1.5 px-2.5 py-2.5 bg-[#1a73e8] hover:bg-[#155fc0] text-white font-semibold text-xs rounded-xl transition-colors cursor-pointer shadow-xs"
            id={`btn-dl-single-png-${icon.id}`}
          >
            <Download size={13} />
            PNG
          </button>
        </div>
      </div>
    </div>
  );
}
