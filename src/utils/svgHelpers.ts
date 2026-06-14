import { StrokeConfig } from '../types';

/**
 * Generates the raw, clean SVG string for a given icon based on standard geometric vectors.
 */
export function getRawSvgString(iconOrId: string | any, config: StrokeConfig): string {
  const pCol = config.primaryColor;
  const sCol = config.secondaryColor;
  const op = config.secondaryOpacity;
  const sw = config.strokeWidth;
  const cap = config.lineCap;
  const join = config.lineJoin;

  // Render SVG attributes matching standard vector style properties
  const strokeLine = `stroke="${pCol}" stroke-width="${sw}" stroke-linecap="${cap}" stroke-linejoin="${join}" fill="none"`;
  const fillRect = `stroke="${pCol}" stroke-width="${sw}" stroke-linecap="${cap}" stroke-linejoin="${join}" fill="${sCol}" fill-opacity="${op}"`;

  let innerContent = '';
  const id = typeof iconOrId === 'string' ? iconOrId : iconOrId.id;

  if (typeof iconOrId !== 'string' && iconOrId.elements) {
    innerContent = iconOrId.elements.map((el: any) => {
      const currentSw = el.strokeWidthMultiplier ? sw * el.strokeWidthMultiplier : sw;
      const strokeAttr = el.useStroke ? `stroke="${pCol}" stroke-width="${currentSw}" stroke-linecap="${cap}" stroke-linejoin="${join}"` : '';
      const fillAttr = el.useSecondaryFill ? `fill="${sCol}" fill-opacity="${op}"` : `fill="${el.fill || 'none'}"`;
      const attrs = `${strokeAttr} ${fillAttr}`.trim();

      if (el.type === 'path') {
        return `  <path d="${el.d}" ${attrs} />`;
      }
      if (el.type === 'rect') {
        return `  <rect x="${el.x}" y="${el.y}" width="${el.width}" height="${el.height}" rx="${el.rx || 0}" ${attrs} />`;
      }
      if (el.type === 'circle') {
        return `  <circle cx="${el.cx}" cy="${el.cy}" r="${el.r}" ${attrs} />`;
      }
      if (el.type === 'ellipse') {
        return `  <ellipse cx="${el.cx}" cy="${el.cy}" rx="${el.rx}" ry="${el.ry}" ${attrs} />`;
      }
      if (el.type === 'line') {
        return `  <line x1="${el.x1}" y1="${el.y1}" x2="${el.x2}" y2="${el.y2}" ${attrs} />`;
      }
      return '';
    }).filter(Boolean).join('\n');
  } else {
    switch (id) {
    case 'trend-growth':
      innerContent = `  <!-- Axis Baseline -->
  <path d="M 14 84 L 86 84" ${strokeLine} />
  
  <!-- Bar 1 (Subtle rounded top) -->
  <rect x="20" y="54" width="12" height="30" rx="2" ${fillRect} />
  
  <!-- Bar 2 -->
  <rect x="38" y="38" width="12" height="46" rx="2" ${fillRect} />
  
  <!-- Bar 3 -->
  <rect x="56" y="20" width="12" height="64" rx="2" ${fillRect} />
  
  <!-- Sweeping Trend Line -->
  <path d="M 14 70 L 36 48 L 78 18" ${strokeLine} stroke-width="${(sw * 1.25).toFixed(2)}" />
  
  <!-- Clean Arrow head -->
  <path d="M 58 18 L 78 18 L 78 38" ${strokeLine} stroke-width="${(sw * 1.25).toFixed(2)}" />`;
      break;

    case 'security-vault':
      innerContent = `  <!-- Main vault door circle -->
  <circle cx="50" cy="50" r="36" ${fillRect} />
  
  <!-- Lock spoke pins radiating outside -->
  <path d="M 50 14 L 50 8 M 50 86 L 50 92 M 14 50 L 8 50 M 86 50 L 92 50" ${strokeLine} />
  <path d="M 24 24 L 20 20 M 76 76 L 80 80 M 24 76 L 20 80 M 76 24 L 80 20" ${strokeLine} />

  <!-- Inner lock circle -->
  <circle cx="50" cy="50" r="16" ${fillRect} />
  
  <!-- Inner security dial notch marks -->
  <path d="M 50 24 L 50 28 M 50 72 L 50 76 M 24 50 L 28 50 M 72 50 L 76 50" ${strokeLine} />

  <!-- Solid central axle lock pin -->
  <circle cx="50" cy="50" r="5" fill="${pCol}" />`;
      break;

    case 'global-network':
      innerContent = `  <!-- Main Globe Sphere Outline -->
  <circle cx="50" cy="50" r="34" ${fillRect} />
  
  <!-- Grid Meridians (Concentric ellipses) -->
  <ellipse cx="50" cy="50" rx="12" ry="34" ${strokeLine} />
  <ellipse cx="50" cy="50" rx="24" ry="34" ${strokeLine} />
  
  <!-- Equator -->
  <path d="M 16 50 L 84 50" ${strokeLine} />

  <!-- Outward Capital Flow Arrow - Top Curve -->
  <path d="M 18 32 A 40 40 0 0 1 82 32" ${strokeLine} stroke-width="${(sw * 1.1).toFixed(2)}" />
  <path d="M 70 34 L 82 32 L 78 20" ${strokeLine} stroke-width="${(sw * 1.1).toFixed(2)}" />

  <!-- Return Capital Flow Arrow - Bottom Curve -->
  <path d="M 82 68 A 40 40 0 0 1 18 68" ${strokeLine} stroke-width="${(sw * 1.1).toFixed(2)}" />
  <path d="M 30 66 L 18 68 L 22 80" ${strokeLine} stroke-width="${(sw * 1.1).toFixed(2)}" />`;
      break;

    case 'piggy-bank':
      innerContent = `  <!-- Tail loop -->
  <path d="M 22 52 C 14 52 14 44 18 40" ${strokeLine} />

  {/* Sturdy legs */}
  <rect x="34" y="74" width="10" height="12" rx="2" ${fillRect} />
  <rect x="52" y="74" width="10" height="12" rx="2" ${fillRect} />
  
  <!-- Pig Core Body -->
  <circle cx="48" cy="52" r="26" ${fillRect} />

  <!-- Pig Snout -->
  <rect x="72" y="45" width="8" height="14" rx="2" ${fillRect} />
  
  <!-- Pig Ear -->
  <path d="M 44 26 L 52 14 L 60 26 Z" ${fillRect} />

  <!-- Coin Slot -->
  <path d="M 40 32 L 56 32" ${strokeLine} />

  <!-- Eye spot -->
  <circle cx="64" cy="41" r="2.5" fill="${pCol}" />

  <!-- Accumulating Coin dropping in -->
  <circle cx="48" cy="16" r="6" ${fillRect} />
  
  <!-- Coin motion glide streak -->
  <path d="M 48 4 L 48 7" ${strokeLine} />`;
      break;

    case 'valuation-briefcase':
      innerContent = `  <!-- Sturdy handle arch -->
  <path d="M 38 32 L 38 20 A 4 4 0 0 1 42 16 L 58 16 A 4 4 0 0 1 62 20 L 62 32" ${strokeLine} />

  <!-- Main briefcase rectangular base shell -->
  <rect x="18" y="32" width="64" height="46" rx="6" ${fillRect} />

  <!-- Dual safety straps representing structure -->
  <path d="M 30 32 L 30 78 M 70 32 L 70 78" ${strokeLine} />

  <!-- Horizontal designer separation boundary seam -->
  <path d="M 18 46 L 82 46" ${strokeLine} />

  <!-- Central locking vault latch buckle -->
  <rect x="44" y="46" width="12" height="12" rx="2" ${strokeLine} fill="${config.backgroundColor === 'white' ? '#ffffff' : sCol}" />
  
  <!-- Micro keyhole -->
  <circle cx="50" cy="51" r="1.5" fill="${pCol}" />
  <path d="M 50 52.5 L 50 55" ${strokeLine} stroke-width="1.5" />`;
      break;

    case 'business-deal':
      innerContent = `  <!-- Main Page Fold Shape -->
  <path d="M 22 22 C 22 18 25 16 28 16 L 62 16 L 78 32 L 78 78 C 78 82 74 84 70 84 L 28 84 C 24 84 22 82 22 78 Z" ${fillRect} />

  <!-- Page fold corner indicator overlay -->
  <path d="M 62 16 L 62 32 L 78 32" ${strokeLine} />

  <!-- Structured document clause mockup lines -->
  <path d="M 30 28 L 52 28 M 30 40 L 70 40 M 30 48 L 70 48 M 30 56 L 56 56" ${strokeLine} />
  
  <!-- Dual signing block placeholders -->
  <path d="M 30 70 L 44 70" ${strokeLine} />
  
  <!-- Verified Transaction Check Badge -->
  <circle cx="64" cy="68" r="10" stroke="${pCol}" stroke-width="${sw}" fill="${pCol}" />
  
  <!-- Clean checkmark in contrast white inside the solid badge -->
  <path d="M 59 68 L 62 71 L 69 64" stroke="#ffffff" stroke-width="${(sw * 1.15).toFixed(2)}" stroke-linecap="round" stroke-linejoin="round" fill="none" />`;
      break;
  }
  }

  // Complete SVG Wrap using standard XML tags, perfect size coordinates bounding (1024x1024 visual target box)
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="1024" height="1024">
${innerContent}
</svg>`;
}

/**
 * Generates the clean consolidated multi-grid SVG string containing all 6 icons inside a perfect 3x2 matrix
 */
export function getConsolidatedSetSvgString(icons: any[], config: StrokeConfig): string {
  const pCol = config.primaryColor;
  let innerElementsXml = '';

  icons.forEach((icon, index) => {
    // Determine positioning in a 3x2 matrix
    // Matrix boundaries: cols: 3, rows: 2
    // Each cell has a width = 100, height = 100
    // Total matrix is 360 wide, 240 tall (including padding)
    const col = index % 3;
    const row = Math.floor(index / 3);

    // Grid coordinates: we place them into individual cells with clean margins
    // Horizontal cell center: gap of 20, width 100
    const xOffset = 20 + col * 120;
    const yOffset = 20 + row * 120;

    // Retrieve raw body content for the specific icon
    // Strip parent SVG wrap if present, just fetch internal contents
    const rawSingle = getRawSvgString(icon, config);
    const bodyMatch = rawSingle.match(/<svg[^>]*>([\s\S]*?)<\/svg>/);
    const contents = bodyMatch ? bodyMatch[1] : '';

    // Wrap elements inside a positional translated <g> block
    innerElementsXml += `  <!-- Grid Cell Row ${row + 1}, Col ${col + 1} (${icon.id}) -->
  <g id="cell-${icon.id}" transform="translate(${xOffset}, ${yOffset})">
    <!-- Grid Outer Border Box (hidden or very subtle for reference) -->
    <rect x="0" y="0" width="100" height="100" rx="6" stroke="${pCol}2a" stroke-width="0.5" fill="none" />
${contents}
  </g>\n\n`;
  });

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 380 260" width="1024" height="1024" style="background-color: ${
    config.backgroundColor === 'white' ? '#ffffff' : config.backgroundColor === 'dark' ? '#0f172a' : 'transparent'
  };">
  <!-- Dynamic grid background or board -->
${innerElementsXml}</svg>`;
}
