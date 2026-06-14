import React from 'react';
import { StrokeConfig, LineCapType, LineJoinType } from '../types';
import { Sliders, RefreshCw, Layers, Eye, Download, ShieldCheck, Palette } from 'lucide-react';

interface ControlPanelProps {
  config: StrokeConfig;
  onChange: (newConfig: StrokeConfig) => void;
  onReset: () => void;
  onDownloadFullSet: (format: 'svg' | 'png' | 'eps') => void;
}

const PRESET_COLORS = [
  { name: 'Google Blue', value: '#1a73e8' },
  { name: 'Primary Royal', value: '#2563eb' },
  { name: 'Electric Cobalt', value: '#4f46e5' },
  { name: 'Ocean Cyan', value: '#0284c7' },
  { name: 'Forest Teal', value: '#0d9488' },
  { name: 'Charcoal Dark', value: '#334155' },
];

export default function ControlPanel({
  config,
  onChange,
  onReset,
  onDownloadFullSet
}: ControlPanelProps) {
  
  const updateProp = (key: keyof StrokeConfig, value: any) => {
    onChange({
      ...config,
      [key]: value
    });
  };

  return (
    <div id="control-panel" className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col gap-6 select-none h-fit">
      
      {/* Title */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-blue-50 text-[#1a73e8] rounded-lg">
            <Sliders size={18} />
          </div>
          <div>
            <h2 className="font-semibold text-slate-800 text-sm tracking-wide uppercase">Kontrol Lembar Kerja</h2>
            <p className="text-xs text-slate-500">Atur ketebalan garis & presisi vektor</p>
          </div>
        </div>
        <button 
          onClick={onReset}
          className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
          title="Atur ulang elemen ke setelan awal standar"
          id="btn-reset-workspace"
        >
          <RefreshCw size={15} />
        </button>
      </div>

      {/* Primary Color Palette */}
      <div className="flex flex-col gap-3">
        <label className="text-xs font-medium text-slate-600 flex items-center gap-2">
          <Palette size={14} className="text-slate-500" />
          Warna Urutan Utama
        </label>
        
        {/* Preset list */}
        <div className="grid grid-cols-6 gap-2">
          {PRESET_COLORS.map((preset) => (
            <button
              key={preset.value}
              onClick={() => {
                onChange({
                  ...config,
                  primaryColor: preset.value,
                  // Auto-align secondary color to a lighter variant or same primary
                  secondaryColor: preset.value,
                });
              }}
              style={{ backgroundColor: preset.value }}
              className={`h-7 rounded-md transition-all relative ${
                config.primaryColor.toLowerCase() === preset.value.toLowerCase()
                  ? 'ring-2 ring-offset-2 ring-slate-800 scale-105'
                  : 'hover:scale-105 hover:opacity-90'
              }`}
              title={preset.name}
              id={`color-preset-${preset.name.toLowerCase().replace(/ /g, '-')}`}
            />
          ))}
        </div>

        {/* Manual Custom Picker */}
        <div className="flex gap-2.5 mt-1">
          <div className="relative flex-1 flex items-center bg-slate-50 rounded-lg border border-slate-200 px-3 py-1.5 focus-within:ring-1 focus-within:ring-[#1a73e8] focus-within:bg-white transition-all">
            <span className="text-slate-400 text-xs font-mono select-none mr-1.5">#</span>
            <input 
              type="text" 
              maxLength={7}
              value={config.primaryColor.replace('#', '')}
              onChange={(e) => {
                const pureHex = e.target.value.trim();
                const matchedHex = pureHex.match(/[0-9a-fA-F]{0,6}/);
                if (matchedHex) {
                  const finalHex = `#${matchedHex[0]}`;
                  onChange({
                    ...config,
                    primaryColor: finalHex,
                    secondaryColor: finalHex
                  });
                }
              }}
              className="w-full bg-transparent text-slate-800 text-xs font-mono outline-none"
              placeholder="1a73e8"
              id="raw-hex-input"
            />
            <div className="w-5 h-5 rounded overflow-hidden relative shadow-inner flex-shrink-0 border border-slate-300">
              <input 
                type="color" 
                value={config.primaryColor.startsWith('#') && config.primaryColor.length === 7 ? config.primaryColor : '#1a73e8'}
                onChange={(e) => {
                  onChange({
                    ...config,
                    primaryColor: e.target.value,
                    secondaryColor: e.target.value
                  });
                }}
                className="absolute inset-0 w-[200%] h-[200%] -translate-x-[25%] -translate-y-[25%] cursor-pointer"
                id="color-wheel-picker"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Vector Geometry Parameters */}
      <div className="flex flex-col gap-4 border-t border-slate-50 pt-4">
        
        {/* Stroke Weight */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center text-xs text-slate-600 font-medium">
            <span className="flex items-center gap-1.5">
              <Layers size={13} className="text-slate-500" />
              Ketebalan Garis (Stroke)
            </span>
            <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-[10px] text-slate-600">
              {config.strokeWidth.toFixed(1)}px
            </span>
          </div>
          <input 
            type="range" 
            min="1.5" 
            max="4.5" 
            step="0.1"
            value={config.strokeWidth}
            onChange={(e) => updateProp('strokeWidth', parseFloat(e.target.value))}
            className="w-full accent-[#1a73e8] h-1.5 bg-slate-100 rounded-lg cursor-pointer"
            id="stroke-weight-range"
          />
        </div>

        {/* Fill Opacity */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center text-xs text-slate-600 font-medium">
            <span>Opasitas Isi Sekunder</span>
            <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-[10px] text-slate-600">
              {Math.round(config.secondaryOpacity * 100)}%
            </span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="0.4" 
            step="0.02"
            value={config.secondaryOpacity}
            onChange={(e) => updateProp('secondaryOpacity', parseFloat(e.target.value))}
            className="w-full accent-[#1a73e8] h-1.5 bg-slate-100 rounded-lg cursor-pointer"
            id="fill-opacity-range"
          />
        </div>
        
        {/* Stroke Terminals (Cap & Join) */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <span className="text-[11px] font-medium text-slate-500">Ujung Garis (Cap)</span>
            <div className="flex bg-slate-50 rounded-lg p-0.5 border border-slate-200">
              {(['round', 'butt', 'square'] as LineCapType[]).map((cap) => (
                <button
                  key={cap}
                  onClick={() => updateProp('lineCap', cap)}
                  className={`flex-1 text-[10px] py-1 font-medium rounded-md capitalize transition-colors ${
                    config.lineCap === cap 
                      ? 'bg-white text-slate-800 shadow-sm' 
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                  id={`linecap-${cap}`}
                >
                  {cap}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-[11px] font-medium text-slate-500">Sambungan Garis (Join)</span>
            <div className="flex bg-slate-50 rounded-lg p-0.5 border border-slate-200">
              {(['round', 'bevel', 'miter'] as LineJoinType[]).map((join) => (
                <button
                  key={join}
                  onClick={() => updateProp('lineJoin', join)}
                  className={`flex-1 text-[10px] py-1 font-medium rounded-md capitalize transition-colors ${
                    config.lineJoin === join 
                      ? 'bg-white text-slate-800 shadow-sm' 
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                  id={`linejoin-${join}`}
                >
                  {join}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* View Options */}
      <div className="flex flex-col gap-3.5 border-t border-slate-50 pt-4">
        <h3 className="text-xs font-semibold text-slate-700 tracking-wider uppercase">Uji Visual</h3>
        
        {/* Guidelines toggle */}
        <label className="flex items-center justify-between cursor-pointer group" id="toggle-guidelines-label">
          <div className="flex items-center gap-2">
            <Eye size={14} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
            <span className="text-xs text-slate-600">Garis Panduan Presisi</span>
          </div>
          <input 
            type="checkbox" 
            checked={config.showGuidelines} 
            onChange={(e) => updateProp('showGuidelines', e.target.checked)}
            className="sr-only peer"
            id="checkbox-guidelines"
          />
          <div className="relative w-9 h-5 bg-slate-250 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#1a73e8] peer-checked:after:border-[#1a73e8]"></div>
        </label>

        {/* Canvas background background buttons */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] font-medium text-slate-500">Latar Belakang Kisi Kanvas</span>
          <div className="grid grid-cols-3 gap-1.5 p-0.5 bg-slate-50 border border-slate-200 rounded-lg">
            {(['transparent', 'white', 'dark'] as const).map((bg) => (
              <button
                key={bg}
                onClick={() => updateProp('backgroundColor', bg)}
                className={`py-1 text-[10px] font-medium rounded-md capitalize transition-colors ${
                  config.backgroundColor === bg
                    ? 'bg-white text-slate-800 shadow-xs'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
                id={`bg-option-${bg}`}
              >
                {bg === 'transparent' ? 'Transparan' : bg === 'white' ? 'Putih' : 'Gelap'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Production Exporter Block */}
      <div className="flex flex-col gap-2.5 border-t border-slate-100 pt-5 mt-auto">
        <div>
          <h3 className="text-xs font-semibold text-slate-700 tracking-wider uppercase flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-emerald-500" />
            Eksportir & Validator
          </h3>
          <p className="text-[11px] text-slate-500 leading-snug mt-1">
            Ekspor set resolusi tinggi 1024×1024, transparan atau putih bersih, garis vektor murni, tanpa watermark.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-1.5 mt-1">
          <button
            onClick={() => onDownloadFullSet('svg')}
            className="flex items-center justify-center gap-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-[10px] rounded-xl transition-all cursor-pointer"
            title="Unduh seluruh set 3x2 dalam format grafis SVG"
            id="btn-download-set-svg"
          >
            <Download size={11} />
            SVG
          </button>

          <button
            onClick={() => onDownloadFullSet('eps')}
            className="flex items-center justify-center gap-1 py-2 bg-slate-900 hover:bg-slate-850 text-white font-semibold text-[10px] rounded-xl transition-all cursor-pointer shadow-sm"
            title="Unduh seluruh set 3x2 dalam format vektor EPS"
            id="btn-download-set-eps"
          >
            <Download size={11} />
            EPS
          </button>
          
          <button
            onClick={() => onDownloadFullSet('png')}
            className="flex items-center justify-center gap-1 py-2 bg-[#1a73e8] hover:bg-[#155fc0] text-white font-semibold text-[10px] rounded-xl transition-all cursor-pointer shadow-sm"
            title="Unduh seluruh set 3x2 dalam resolusi PNG 1024x1024"
            id="btn-download-set-png"
          >
            <Download size={11} />
            PNG
          </button>
        </div>
      </div>
    </div>
  );
}
