/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { StrokeConfig, IconDefinition } from './types';
import { BUSINESS_ICONS } from './components/iconData';
import ControlPanel from './components/ControlPanel';
import InspectorPanel from './components/InspectorPanel';
import IconGrid from './components/IconGrid';
import AiGeneratorPanel from './components/AiGeneratorPanel';
import { getRawSvgString, getConsolidatedSetSvgString } from './utils/svgHelpers';
import { getRawEpsString, getConsolidatedEpsSetString } from './utils/epsHelpers';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, CheckCircle2, Sliders, Layout, Anchor, BookOpen, Clock } from 'lucide-react';

const DEFAULT_CONFIG: StrokeConfig = {
  primaryColor: '#1a73e8', // Vibrant Blue
  secondaryColor: '#1a73e8', 
  secondaryOpacity: 0.08, // Very subtle soft fill tint
  strokeWidth: 2.2, // Clean, highly scalable stroke
  lineCap: 'round',
  lineJoin: 'round',
  showGuidelines: true, // Guides on by default to show precision grid alignment
  guideColor: '#1a73e8',
  backgroundColor: 'white'
};

export default function App() {
  const [config, setConfig] = useState<StrokeConfig>(DEFAULT_CONFIG);
  const [icons, setIcons] = useState<IconDefinition[]>(BUSINESS_ICONS);
  const [activeIconId, setActiveIconId] = useState<string>('trend-growth');
  const [currentTime, setCurrentTime] = useState<string>('');

  // Set up real-time metadata display for the design team file header
  useEffect(() => {
    // Standard ISO/UTC time for vector asset file logs
    const now = new Date();
    const utcFormatted = now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
    setCurrentTime(utcFormatted);
  }, []);

  const activeIcon = icons.find(icon => icon.id === activeIconId) || icons[0];

  const handleReset = () => {
    setConfig(DEFAULT_CONFIG);
  };

  const handleDownloadSingle = (id: string, format: 'svg' | 'png' | 'eps') => {
    const icon = icons.find(i => i.id === id);
    if (!icon) return;

    if (format === 'svg') {
      const svgString = getRawSvgString(icon, config);
      const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${id}_geometry_vector.svg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else if (format === 'eps') {
      const epsString = getRawEpsString(icon, config);
      const blob = new Blob([epsString], { type: 'application/postscript;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${id}_geometry_vector.eps`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      const svgString = getRawSvgString(icon, config);
      // Create Image from SVG representation
      const img = new Image();
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 1024;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          // Process canvas backgrounds
          if (config.backgroundColor === 'white') {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, 1024, 1024);
          } else if (config.backgroundColor === 'dark') {
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(0, 0, 1024, 1024);
          } else {
            ctx.clearRect(0, 0, 1024, 1024);
          }
          
          ctx.drawImage(img, 0, 0, 1024, 1024);
          const pngUrl = canvas.toDataURL('image/png');
          const link = document.createElement('a');
          link.href = pngUrl;
          link.download = `${id}_highres_1024.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
        URL.revokeObjectURL(url);
      };
      img.src = url;
    }
  };

  const handleDownloadFullSet = (format: 'svg' | 'png' | 'eps') => {
    if (format === 'svg') {
      const svgString = getConsolidatedSetSvgString(icons, config);
      const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `business_finance_icon_grid_set.svg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else if (format === 'eps') {
      const epsString = getConsolidatedEpsSetString(icons, config);
      const blob = new Blob([epsString], { type: 'application/postscript;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `business_finance_icon_grid_set.eps`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      const svgString = getConsolidatedSetSvgString(icons, config);
      // Multi-asset set image creation
      const img = new Image();
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 1024;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          if (config.backgroundColor === 'white') {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, 1024, 1024);
          } else if (config.backgroundColor === 'dark') {
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(0, 0, 1024, 1024);
          } else {
            ctx.clearRect(0, 0, 1024, 1024);
          }

          // Center the 380x260 grid inside the 1024x1024 final square with optimal proportions
          const srcAspectRatio = 380 / 260;
          let destWidth = 1024;
          let destHeight = 1024 / srcAspectRatio;
          
          if (destHeight > 1024) {
            destHeight = 1024;
            destWidth = 1024 * srcAspectRatio;
          }
          
          const xOffset = (1024 - destWidth) / 2;
          const yOffset = (1024 - destHeight) / 2;
          
          ctx.drawImage(img, xOffset, yOffset, destWidth, destHeight);
          
          const pngUrl = canvas.toDataURL('image/png');
          const link = document.createElement('a');
          link.href = pngUrl;
          link.download = `business_finance_icon_grid_set_1024.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
        URL.revokeObjectURL(url);
      };
      img.src = url;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 flex flex-col font-sans text-slate-800 antialiased selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
      
      {/* Container wrapper targeting desk-first precision */}
      <div className="w-full max-w-7xl mx-auto flex flex-col gap-6">
        
        {/* Top Header Section */}
        <header id="app-header" className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6 relative overflow-hidden">
          {/* Subtle Accent banner on top edge */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-500 to-indigo-500" />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="p-1 bg-blue-50 text-[#1a73e8] rounded-md font-mono text-xs font-bold">
                  v1.3.0
                </span>
                <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 size={12} /> Lolos Kurasi Adobe Stock
                </span>
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1.5">
                Studio Ikon Vektor Finansial
              </h1>
              <p className="text-slate-500 text-xs mt-1 max-w-2xl leading-relaxed">
                Konfigurasi, kustomisasi, dan buat ikon vektor bisnis geometris berkualitas tinggi mandiri maupun instan dengan AI Gemini. Atur ketebalan garis, warna primer, dan opasitas warna sekunder secara presisi yang selaras sempurna pada ukuran mikro 24px.
              </p>
            </div>

            {/* Micro info tag */}
            <div className="flex flex-col md:items-end justify-center text-slate-400 text-[10px] font-mono gap-1 select-none">
              <span className="flex items-center gap-1.5">
                <Clock size={11} /> Terdaftar: {currentTime || 'Memeriksa waktu...'}
              </span>
              <span>Dimensi: Bingkai Kotak 1024×1024</span>
              <span>Preset Warna Utama: #1a73e8</span>
            </div>
          </div>
        </header>

        {/* Workspace Panels Grid */}
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Panel: Workspace Tuning Controls (col-span-4) */}
          <section className="lg:col-span-4 flex flex-col gap-6" aria-label="Tuning Settings">
            <ControlPanel 
              config={config}
              onChange={setConfig}
              onReset={handleReset}
              onDownloadFullSet={handleDownloadFullSet}
            />
            <AiGeneratorPanel 
              config={config}
              onIconCreated={(newIcon) => {
                setIcons(prev => [...prev, newIcon]);
                setActiveIconId(newIcon.id);
              }}
            />
          </section>

          {/* Right Area: Showcase Grid and Active Inspector (col-span-8) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* Active Icon Inspector Area */}
            <section id="focus-inspector" aria-label="Icon Inspector focus area">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIconId}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                >
                  <InspectorPanel 
                    icon={activeIcon}
                    config={config}
                    onDownloadSingle={handleDownloadSingle}
                  />
                </motion.div>
              </AnimatePresence>
            </section>

            {/* Entire 6-Icon Grid block */}
            <section id="full-grid-gallery" aria-label="Grid set collection gallery">
              <IconGrid 
                icons={icons}
                config={config}
                activeId={activeIconId}
                onSelectIcon={setActiveIconId}
              />
            </section>

          </div>

        </main>

        {/* Footer info/quality checklist */}
        <footer className="bg-white border border-slate-100 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-3 gap-6 relative select-none">
          
          <div className="flex items-start gap-3">
            <div className="p-2 bg-slate-50 text-[#1a73e8] rounded-xl flex-shrink-0 mt-0.5">
              <Anchor size={16} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Geometri Presisi Seragam</h4>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                Setiap ikon menggunakan dimensi kanvas dasar 100x100 dengan margin presisi tinggi, memastikan keselarasan bobot visual seragam saat dipasang dalam dasbor bisnis.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 bg-slate-50 text-[#1a73e8] rounded-xl flex-shrink-0 mt-0.5">
              <Sliders size={16} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Skalabilitas Garis Dinamis</h4>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                Sesuaikan ketebalan ujung ekor garis vektor dan opasitas warna pendukung. Kanvas interaktif kami memastikan setiap goresan murni dapat diskalakan tanpa pecah.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 bg-slate-50 text-[#1a73e8] rounded-xl flex-shrink-0 mt-0.5">
              <BookOpen size={16} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Standar Komersial Profesional</h4>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                Set ekspor dilengkapi path tertutup yang rapi, bersih tanpa label atau watermark, menjadikannya siap pakai untuk proyek klien ataupun komersial lisensi resmi.
              </p>
            </div>
          </div>

        </footer>

      </div>
    </div>
  );
}
