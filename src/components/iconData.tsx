import React from 'react';
import { IconDefinition, StrokeConfig } from '../types';

export const BUSINESS_ICONS: IconDefinition[] = [
  {
    id: 'trend-growth',
    title: 'Pertumbuhan & Analisis Pasar',
    concept: 'Tren Kinerja',
    description: 'Grafik batang menaik yang tajam dengan lekukan geometris presisi tinggi, melambangkan pertumbuhan, metrik data, dan peningkatan valuasi bisnis.',
    render: (config: StrokeConfig) => {
      const strokeProps = {
        stroke: config.primaryColor,
        strokeWidth: config.strokeWidth,
        strokeLinecap: config.lineCap,
        strokeLinejoin: config.lineJoin,
        fill: 'none',
      };
      
      const secondaryFillProps = {
        fill: config.secondaryColor,
        fillOpacity: config.secondaryOpacity,
      };

      return (
        <g id="trend-growth-layers">
          {/* Axis Baseline */}
          <path d="M 14 84 L 86 84" {...strokeProps} />
          
          {/* Bar 1 (Subtle rounded top) */}
          <rect 
            x="20" 
            y="54" 
            width="12" 
            height="30" 
            rx="2" 
            {...strokeProps} 
            {...secondaryFillProps} 
          />
          
          {/* Bar 2 */}
          <rect 
            x="38" 
            y="38" 
            width="12" 
            height="46" 
            rx="2" 
            {...strokeProps} 
            {...secondaryFillProps} 
          />
          
          {/* Bar 3 */}
          <rect 
            x="56" 
            y="20" 
            width="12" 
            height="64" 
            rx="2" 
            {...strokeProps} 
            {...secondaryFillProps} 
          />
          
          {/* Sweeping Trend Line */}
          <path 
            d="M 14 70 L 36 48 L 78 18" 
            {...strokeProps} 
            strokeWidth={config.strokeWidth * 1.25} // Stronger focus arrow
          />
          
          {/* Clean Arrow head */}
          <path 
            d="M 58 18 L 78 18 L 78 38" 
            {...strokeProps} 
            strokeWidth={config.strokeWidth * 1.25}
          />
        </g>
      );
    }
  },
  {
    id: 'security-vault',
    title: 'Brankas & Keamanan Finansial',
    concept: 'Penyimpanan Aman',
    description: 'Sistem pengunci melingkar konsentris dengan roda gigi eksternal yang kokoh, melambangkan perlindungan aset dan cadangan modal berharga.',
    render: (config: StrokeConfig) => {
      const strokeProps = {
        stroke: config.primaryColor,
        strokeWidth: config.strokeWidth,
        strokeLinecap: config.lineCap,
        strokeLinejoin: config.lineJoin,
        fill: 'none',
      };

      const secondaryFillProps = {
        fill: config.secondaryColor,
        fillOpacity: config.secondaryOpacity,
      };

      return (
        <g id="security-vault-layers">
          {/* Main vault door circle */}
          <circle 
            cx="50" 
            cy="50" 
            r="36" 
            {...strokeProps} 
            {...secondaryFillProps} 
          />
          
          {/* Lock spoke pins radiating outside */}
          <path d="M 50 14 L 50 8" {...strokeProps} />
          <path d="M 50 86 L 50 92" {...strokeProps} />
          <path d="M 14 50 L 8 50" {...strokeProps} />
          <path d="M 86 50 L 92 50" {...strokeProps} />
          
          <path d="M 24 24 L 20 20" {...strokeProps} />
          <path d="M 76 76 L 80 80" {...strokeProps} />
          <path d="M 24 76 L 20 80" {...strokeProps} />
          <path d="M 76 24 L 80 20" {...strokeProps} />

          {/* Inner lock circle */}
          <circle 
            cx="50" 
            cy="50" 
            r="16" 
            {...strokeProps} 
            {...secondaryFillProps} 
          />
          
          {/* Inner security dial notch marks */}
          <path d="M 50 24 L 50 28" {...strokeProps} />
          <path d="M 50 72 L 50 76" {...strokeProps} />
          <path d="M 24 50 L 28 50" {...strokeProps} />
          <path d="M 72 50 L 76 50" {...strokeProps} />

          {/* Solid central axle lock pin */}
          <circle 
            cx="50" 
            cy="50" 
            r="5" 
            fill={config.primaryColor} 
          />
        </g>
      );
    }
  },
  {
    id: 'global-network',
    title: 'Jaringan Transaksi Global',
    concept: 'Aliran Modal & Remitansi',
    description: 'Bola dunia garis lintang dan bujur yang diselimuti oleh panah aliran berulang, menggambarkan jaringan perbankan transnasional dan perdagangan digital.',
    render: (config: StrokeConfig) => {
      const strokeProps = {
        stroke: config.primaryColor,
        strokeWidth: config.strokeWidth,
        strokeLinecap: config.lineCap,
        strokeLinejoin: config.lineJoin,
        fill: 'none',
      };

      const secondaryFillProps = {
        fill: config.secondaryColor,
        fillOpacity: config.secondaryOpacity,
      };

      return (
        <g id="global-network-layers">
          {/* Main Globe Sphere Outline */}
          <circle 
            cx="50" 
            cy="50" 
            r="34" 
            {...strokeProps} 
            {...secondaryFillProps} 
          />
          
          {/* Grid Meridians (Concentric ellipses) */}
          <ellipse 
            cx="50" 
            cy="50" 
            rx="12" 
            ry="34" 
            {...strokeProps} 
          />
          <ellipse 
            cx="50" 
            cy="50" 
            rx="24" 
            ry="34" 
            {...strokeProps} 
          />
          
          {/* Equator */}
          <path d="M 16 50 L 84 50" {...strokeProps} />

          {/* Outward Capital Flow Arrow - Top Curve */}
          <path 
            d="M 18 32 A 40 40 0 0 1 82 32" 
            {...strokeProps} 
            strokeWidth={config.strokeWidth * 1.1}
          />
          <path 
            d="M 70 34 L 82 32 L 78 20" 
            {...strokeProps} 
            strokeWidth={config.strokeWidth * 1.1}
          />

          {/* Return Capital Flow Arrow - Bottom Curve */}
          <path 
            d="M 82 68 A 40 40 0 0 1 18 68" 
            {...strokeProps} 
            strokeWidth={config.strokeWidth * 1.1}
          />
          <path 
            d="M 30 66 L 18 68 L 22 80" 
            {...strokeProps} 
            strokeWidth={config.strokeWidth * 1.1}
          />
        </g>
      );
    }
  },
  {
    id: 'piggy-bank',
    title: 'Akumulasi Aset Tabungan',
    concept: 'Tabungan & Imbal Hasil',
    description: 'Desain celengan modern bersudut geometris yang menangkap konsep mikro-tabungan, akumulasi modal, suku bunga majemuk, dan investasi masa depan.',
    render: (config: StrokeConfig) => {
      const strokeProps = {
        stroke: config.primaryColor,
        strokeWidth: config.strokeWidth,
        strokeLinecap: config.lineCap,
        strokeLinejoin: config.lineJoin,
        fill: 'none',
      };

      const secondaryFillProps = {
        fill: config.secondaryColor,
        fillOpacity: config.secondaryOpacity,
      };

      return (
        <g id="piggy-bank-layers">
          {/* Tail loop */}
          <path d="M 22 52 C 14 52 14 44 18 40" {...strokeProps} />

          {/* Sturdy legs */}
          <rect x="34" y="74" width="10" height="12" rx="2" {...strokeProps} {...secondaryFillProps} />
          <rect x="52" y="74" width="10" height="12" rx="2" {...strokeProps} {...secondaryFillProps} />
          
          {/* Pig Core Body (offset right a bit) */}
          <circle 
            cx="48" 
            cy="52" 
            r="26" 
            {...strokeProps} 
            {...secondaryFillProps} 
          />

          {/* Pig Snout */}
          <rect 
            x="72" 
            y="45" 
            width="8" 
            height="14" 
            rx="2" 
            {...strokeProps} 
            {...secondaryFillProps} 
          />
          
          {/* Pig Ear */}
          <path 
            d="M 44 26 L 52 14 L 60 26 Z" 
            {...strokeProps} 
            {...secondaryFillProps} 
          />

          {/* Coin Slot */}
          <path d="M 40 32 L 56 32" {...strokeProps} />

          {/* Eye spot */}
          <circle 
            cx="64" 
            cy="41" 
            r="2.5" 
            fill={config.primaryColor} 
          />

          {/* Accumulating Coin dropping in */}
          <circle 
            cx="48" 
            cy="16" 
            r="6" 
            {...strokeProps} 
            {...secondaryFillProps} 
          />
          
          {/* Coin motion glide streak */}
          <path d="M 48 4 L 48 7" {...strokeProps} />
        </g>
      );
    }
  },
  {
    id: 'valuation-briefcase',
    title: 'Portofolio Solusi Aset',
    concept: 'Investasi & Valuasi',
    description: 'Tas kulit profesional berbalut geometri tegas berpresisi tinggi yang mencerminkan pengelolaan modal portofolio komersial dan kesepakatan eksekutif.',
    render: (config: StrokeConfig) => {
      const strokeProps = {
        stroke: config.primaryColor,
        strokeWidth: config.strokeWidth,
        strokeLinecap: config.lineCap,
        strokeLinejoin: config.lineJoin,
        fill: 'none',
      };

      const secondaryFillProps = {
        fill: config.secondaryColor,
        fillOpacity: config.secondaryOpacity,
      };

      return (
        <g id="valuation-briefcase-layers">
          {/* Sturdy handle arch */}
          <path 
            d="M 38 32 L 38 20 A 4 4 0 0 1 42 16 L 58 16 A 4 4 0 0 1 62 20 L 62 32" 
            {...strokeProps} 
          />

          {/* Main briefcase rectangular base shell */}
          <rect 
            x="18" 
            y="32" 
            width="64" 
            height="46" 
            rx="6" 
            {...strokeProps} 
            {...secondaryFillProps} 
          />

          {/* Dual safety straps representing structure */}
          <path d="M 30 32 L 30 78" {...strokeProps} />
          <path d="M 70 32 L 70 78" {...strokeProps} />

          {/* Horizontal designer separation boundary seam */}
          <path d="M 18 46 L 82 46" {...strokeProps} />

          {/* Central locking vault latch buckle */}
          <rect 
            x="44" 
            y="46" 
            width="12" 
            height="12" 
            rx="2" 
            {...strokeProps} 
            fill={config.backgroundColor === 'white' ? '#ffffff' : config.secondaryColor}
          />
          
          {/* Micro keyhole */}
          <circle 
            cx="50" 
            cy="51" 
            r="1.5" 
            fill={config.primaryColor} 
          />
          <path 
            d="M 50 52.5 L 50 55" 
            {...strokeProps} 
            strokeWidth={1.5}
          />
        </g>
      );
    }
  },
  {
    id: 'business-deal',
    title: 'Kontrak Modal Terjamin',
    concept: 'Perjanjian & Kepatuhan',
    description: 'Lembar dokumen lipat elegan yang memamerkan klausul bisnis rinci lengkap dengan lencana centang verifikasi kuat untuk penyelesaian transaksi sah.',
    render: (config: StrokeConfig) => {
      const strokeProps = {
        stroke: config.primaryColor,
        strokeWidth: config.strokeWidth,
        strokeLinecap: config.lineCap,
        strokeLinejoin: config.lineJoin,
        fill: 'none',
      };

      const secondaryFillProps = {
        fill: config.secondaryColor,
        fillOpacity: config.secondaryOpacity,
      };

      return (
        <g id="business-deal-layers">
          {/* Main Page Fold Shape */}
          <path 
            d="M 22 22 C 22 18 25 16 28 16 L 62 16 L 78 32 L 78 78 C 78 82 74 84 70 84 L 28 84 C 24 84 22 82 22 78 Z" 
            {...strokeProps} 
            {...secondaryFillProps} 
          />

          {/* Page fold corner indicator overlay */}
          <path 
            d="M 62 16 L 62 32 L 78 32" 
            {...strokeProps} 
          />

          {/* Structured document clause mockup lines */}
          <path d="M 30 28 L 52 28" {...strokeProps} />
          <path d="M 30 40 L 70 40" {...strokeProps} />
          <path d="M 30 48 L 70 48" {...strokeProps} />
          <path d="M 30 56 L 56 56" {...strokeProps} />
          
          {/* Dual signing block placeholders */}
          <path d="M 30 70 L 44 70" {...strokeProps} />
          
          {/* Verified Transaction Check Badge */}
          <circle 
            cx="64" 
            cy="68" 
            r="10" 
            stroke={config.primaryColor}
            strokeWidth={config.strokeWidth}
            fill={config.primaryColor} // Solid vibrant badge
          />
          
          {/* Clean checkmark in contrast white inside the solid badge */}
          <path 
            d="M 59 68 L 62 71 L 69 64" 
            stroke="#ffffff"
            strokeWidth={config.strokeWidth * 1.15}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </g>
      );
    }
  }
];
