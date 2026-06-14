import React, { useState } from 'react';
import { StrokeConfig, IconDefinition } from '../types';
import { Sparkles, Loader2, ArrowRight, Lightbulb, Check } from 'lucide-react';

interface AiGeneratorPanelProps {
  config: StrokeConfig;
  onIconCreated: (newIcon: IconDefinition) => void;
}

const INDONESIAN_SUGGESTIONS = [
  'Grafik Keuntungan Melambung',
  'Gedung Bank Indonesia',
  'Bitcoin & Dompet Kripto',
  'Tas Dokumen Bisnis',
  'Kartu Kredit Terlindungi',
  'Koin Emas Jatuh',
];

export default function AiGeneratorPanel({ config, onIconCreated }: AiGeneratorPanelProps) {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorString, setErrorString] = useState<string | null>(null);
  const [activeSuggestion, setActiveSuggestion] = useState<string | null>(null);

  const handleGenerate = async (targetPrompt: string) => {
    if (!targetPrompt.trim() || loading) return;
    setLoading(true);
    setErrorString(null);

    try {
      const response = await fetch('/api/generate-icon', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: targetPrompt.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Terjadi kesalahan sistem.');
      }

      const iconData = await response.json();
      
      // Compile physical IconDefinition dynamically
      const dynamicIcon: IconDefinition = {
        id: iconData.id || `ai-${Date.now()}`,
        title: iconData.title || 'Ikon AI Tanpa Judul',
        concept: iconData.concept || 'AI Generated',
        description: iconData.description || 'Desain geometri otomatis oleh model AI Gemini.',
        isAiGenerated: true,
        elements: iconData.elements || [],
        render: (currentConfig: StrokeConfig) => {
          const strokeProps = {
            stroke: currentConfig.primaryColor,
            strokeWidth: currentConfig.strokeWidth,
            strokeLinecap: currentConfig.lineCap,
            strokeLinejoin: currentConfig.lineJoin,
            fill: 'none',
          };
          
          const secondaryFillProps = {
            fill: currentConfig.secondaryColor,
            fillOpacity: currentConfig.secondaryOpacity,
          };

          return (
            <g id={`${iconData.id || 'ai-gen'}-layer-group`}>
              {(iconData.elements || []).map((el: any, idx: number) => {
                const sw = el.strokeWidthMultiplier ? currentConfig.strokeWidth * el.strokeWidthMultiplier : currentConfig.strokeWidth;
                const elStrokeProps = el.useStroke ? { ...strokeProps, strokeWidth: sw } : { fill: 'none' };
                const elFillProps = el.useSecondaryFill ? { ...secondaryFillProps } : { fill: el.fill || 'none' };
                const combinedProps = { ...elStrokeProps, ...elFillProps };

                if (el.type === 'path') {
                  return <path key={idx} d={el.d} {...combinedProps} />;
                }
                if (el.type === 'rect') {
                  return (
                    <rect
                      key={idx}
                      x={el.x}
                      y={el.y}
                      width={el.width}
                      height={el.height}
                      rx={el.rx || '0'}
                      {...combinedProps}
                    />
                  );
                }
                if (el.type === 'circle') {
                  return (
                    <circle
                      key={idx}
                      cx={el.cx}
                      cy={el.cy}
                      r={el.r}
                      {...combinedProps}
                    />
                  );
                }
                if (el.type === 'ellipse') {
                  return (
                    <ellipse
                      key={idx}
                      cx={el.cx}
                      cy={el.cy}
                      rx={el.rx}
                      ry={el.ry}
                      {...combinedProps}
                    />
                  );
                }
                if (el.type === 'line') {
                  return (
                    <line
                      key={idx}
                      x1={el.x1}
                      y1={el.y1}
                      x2={el.x2}
                      y2={el.y2}
                      {...combinedProps}
                    />
                  );
                }
                return null;
              })}
            </g>
          );
        }
      };

      onIconCreated(dynamicIcon);
      setPrompt('');
      setActiveSuggestion(null);
    } catch (err: any) {
      console.error(err);
      setErrorString(err.message || 'Gagal tersambung ke server Gemini.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="ai-generator-panel" className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col gap-4 select-none">
      
      {/* Header */}
      <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
        <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
          <Sparkles size={18} />
        </div>
        <div>
          <h2 className="font-semibold text-slate-800 text-sm tracking-wide uppercase">Generator Ikon AI</h2>
          <p className="text-xs text-slate-500">Buat tak terbatas ikon dengan prompt Bahasa Indonesia</p>
        </div>
      </div>

      {/* Suggestion tags */}
      <div className="flex flex-col gap-2">
        <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
          <Lightbulb size={12} className="text-amber-500" />
          Ide Inspirasi Instan:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {INDONESIAN_SUGGESTIONS.map((sug) => {
            const isChosen = activeSuggestion === sug;
            return (
              <button
                key={sug}
                onClick={() => {
                  setPrompt(sug);
                  setActiveSuggestion(sug);
                }}
                className={`text-[10px] px-2 py-1 rounded-md border transition-all cursor-pointer ${
                  isChosen 
                    ? 'bg-amber-50 border-amber-200 text-amber-800 font-semibold scale-102'
                    : 'bg-slate-50 border-slate-100 hover:border-slate-300 text-slate-600'
                }`}
                disabled={loading}
              >
                {sug}
              </button>
            );
          })}
        </div>
      </div>

      {/* Input Form */}
      <div className="flex flex-col gap-2 mt-1">
        <textarea
          rows={2}
          value={prompt}
          onChange={(e) => {
            setPrompt(e.target.value);
            setActiveSuggestion(null);
          }}
          disabled={loading}
          placeholder="Tulis instruksi desain ikon di sini... (Contoh: sekeranjang belanjaan dengan tanda panah ke kanan atas)"
          className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50/50 outline-none focus:ring-1 focus:ring-[#1a73e8] focus:border-[#1a73e8] focus:bg-white text-slate-800 placeholder-slate-400 font-sans resize-none transition-all"
        />

        {errorString && (
          <span className="text-[10px] font-medium text-rose-500 bg-rose-50 px-2.5 py-1.5 rounded-lg border border-rose-100 leading-normal">
            {errorString}
          </span>
        )}

        <button
          onClick={() => handleGenerate(prompt)}
          disabled={loading || !prompt.trim()}
          className={`w-full flex items-center justify-center gap-2 py-3 text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer ${
            loading || !prompt.trim()
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white hover:scale-[1.01]'
          }`}
        >
          {loading ? (
            <>
              <Loader2 size={14} className="animate-spin text-emerald-100" />
              <span>Membuat Struktur Geometri...</span>
            </>
          ) : (
            <>
              <Sparkles size={13} className="text-amber-300" />
              <span>Buat Ikon Baru</span>
              <ArrowRight size={12} className="text-emerald-200" />
            </>
          )}
        </button>
      </div>

      {/* Process feedback indicators */}
      {loading && (
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-center gap-3 animate-pulse">
          <div className="w-1.5 h-10 rounded-full bg-emerald-500 flex-shrink-0" />
          <div className="flex flex-col">
            <span className="text-[10px] font-mono text-slate-400 select-none uppercase">Proses Kreatif Gemini AI</span>
            <p className="text-[11px] text-slate-600 leading-normal font-medium">
              Merancang bentuk kurva simetris & menyelaraskan bobot ke garis grid 100x100...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
