import { StrokeConfig } from '../types';

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const cleanHex = hex.replace('#', '');
  if (cleanHex.length === 3) {
    const r = parseInt(cleanHex[0] + cleanHex[0], 16) / 255;
    const g = parseInt(cleanHex[1] + cleanHex[1], 16) / 255;
    const b = parseInt(cleanHex[2] + cleanHex[2], 16) / 255;
    return { r, g, b };
  }
  const bigInt = parseInt(cleanHex, 16) || 0;
  const r = ((bigInt >> 16) & 255) / 255;
  const g = ((bigInt >> 8) & 255) / 255;
  const b = (bigInt & 255) / 255;
  return { r, g, b };
}

export function getRawEpsString(iconOrId: string | any, config: StrokeConfig): string {
  const pr = hexToRgb(config.primaryColor);
  
  // Calculate secondary color mixed with white, simulating opacity fill on white base, 
  // or pure rgb if transparent (PostScript EPS doesn't natively support opacity in standard Level 2 EPS 
  // without advanced transparency groups, so blending the primary flatly is exceptionally robust for vector print!).
  const mix = config.secondaryOpacity;
  const sr = {
    r: pr.r * mix + (1 - mix),
    g: pr.g * mix + (1 - mix),
    b: pr.b * mix + (1 - mix)
  };

  const capMap = { round: 1, butt: 0, square: 2 };
  const joinMap = { round: 1, miter: 0, bevel: 2 };
  const capIndex = capMap[config.lineCap] ?? 1;
  const joinIndex = joinMap[config.lineJoin] ?? 1;

  let pathsCode = '';
  const id = typeof iconOrId === 'string' ? iconOrId : iconOrId.id;

  if (typeof iconOrId !== 'string' && iconOrId.elements) {
    pathsCode = iconOrId.elements.map((el: any) => {
      const currentSw = el.strokeWidthMultiplier ? config.strokeWidth * el.strokeWidthMultiplier : config.strokeWidth;
      let eps = `\n% Element: ${el.type}`;
      
      if (el.type === 'path') {
        const d = el.d || '';
        const commands: string[] = ['newpath'];
        const tokens = d.replace(/,/g, ' ').match(/([MLCZCQTASHVmlczcqtashv])|(-?\d*\.?\d+)/g) || [];
        let i = 0;
        while (i < tokens.length) {
          const t = tokens[i];
          if (t === 'M' || t === 'm') {
            commands.push(`${tokens[i+1]} ${tokens[i+2]} moveto`);
            i += 3;
          } else if (t === 'L' || t === 'l') {
            commands.push(`${tokens[i+1]} ${tokens[i+2]} lineto`);
            i += 3;
          } else if (t === 'C' || t === 'c') {
            commands.push(`${tokens[i+1]} ${tokens[i+2]} ${tokens[i+3]} ${tokens[i+4]} ${tokens[i+5]} ${tokens[i+6]} curveto`);
            i += 7;
          } else if (t === 'Z' || t === 'z') {
            commands.push('closepath');
            i += 1;
          } else {
            // simple recovery path
            i++;
          }
        }
        if (el.useSecondaryFill) {
          commands.push('gsave setscolor fill grestore');
        }
        if (el.useStroke) {
          commands.push(`gsave ${currentSw.toFixed(2)} setlinewidth setpcolor stroke grestore`);
        }
        eps += '\n' + commands.join('\n');
      } else if (el.type === 'circle') {
        eps += `\nnewpath\n${el.cx} ${el.cy} ${el.r} 0 360 arc`;
        if (el.useSecondaryFill) {
          eps += '\ngsave setscolor fill grestore';
        }
        if (el.useStroke) {
          eps += `\ngsave ${currentSw.toFixed(2)} setlinewidth setpcolor stroke grestore`;
        }
      } else if (el.type === 'ellipse') {
        eps += `\ngsave\nnewpath\nmatrix currentmatrix\n${el.cx} ${el.cy} translate\n${el.rx} ${el.ry} scale\n0 0 1 0 360 arc\nsetmatrix`;
        if (el.useSecondaryFill) {
          eps += '\ngsave setscolor fill grestore';
        }
        if (el.useStroke) {
          eps += `\ngsave ${currentSw.toFixed(2)} setlinewidth setpcolor stroke grestore`;
        }
        eps += '\ngrestore';
      } else if (el.type === 'rect') {
        const rx = el.rx || '0';
        eps += `\n${el.x} ${el.y} ${el.width} ${el.height} ${rx} drawrrect`;
        if (el.useSecondaryFill) {
          eps += '\ngsave setscolor fill grestore';
        }
        if (el.useStroke) {
          eps += `\ngsave ${currentSw.toFixed(2)} setlinewidth setpcolor stroke grestore`;
        }
      } else if (el.type === 'line') {
        eps += `\nnewpath\n${el.x1} ${el.y1} moveto\n${el.x2} ${el.y2} lineto`;
        if (el.useStroke) {
          eps += `\ngsave ${currentSw.toFixed(2)} setlinewidth setpcolor stroke grestore`;
        }
      }
      return eps;
    }).join('\n');
  } else {
    switch (id) {
    case 'trend-growth':
      pathsCode = `
% Axis baseline
newpath
14 84 moveto
86 84 lineto
setpcolor stroke

% Bar 1 (rrect helper: x y w h rx)
20 54 12 30 2 drawrrect

% Bar 2
38 38 12 46 2 drawrrect

% Bar 3
56 20 12 64 2 drawrrect

% Sweeping Trend Line
newpath
14 70 moveto
36 48 lineto
78 18 lineto
% Thicker trend
gsave
${(config.strokeWidth * 1.25).toFixed(2)} setlinewidth
setpcolor stroke
grestore

% Arrowhead
newpath
58 18 moveto
78 18 lineto
78 38 lineto
gsave
${(config.strokeWidth * 1.25).toFixed(2)} setlinewidth
setpcolor stroke
grestore
`;
      break;

    case 'security-vault':
      pathsCode = `
% Main vault door circle
50 50 36 drawcircle

% Spoke pins radiating outside
newpath
50 14 moveto 50 8 lineto
50 86 moveto 50 92 lineto
14 50 moveto 8 50 lineto
86 50 moveto 92 50 lineto
24 24 moveto 20 20 lineto
76 76 moveto 80 80 lineto
24 76 moveto 20 80 lineto
76 24 moveto 80 20 lineto
setpcolor stroke

% Inner lock circle
50 50 16 drawcircle

% Inner Security dial notches
newpath
50 24 moveto 50 28 lineto
50 72 moveto 50 76 lineto
24 50 moveto 28 50 lineto
72 50 moveto 76 50 lineto
setpcolor stroke

% Solid core axles locking center pin
newpath
50 50 5 0 360 arc
gsave
setpcolor fill
grestore
`;
      break;

    case 'global-network':
      pathsCode = `
% Main Globe Sphere Outline
50 50 34 drawcircle

% Grid Meridians (using approximate scaled circles or ellipses)
% Draw inner longitude arc 1
newpath
gsave
matrix currentmatrix
50 50 translate
12 34 scale
0 0 1 0 360 arc
setmatrix
setpcolor stroke
grestore

% Draw inner longitude arc 2
newpath
gsave
matrix currentmatrix
50 50 translate
24 34 scale
0 0 1 0 360 arc
setmatrix
setpcolor stroke
grestore

% Equator Line
newpath
16 50 moveto
84 50 lineto
setpcolor stroke

% Outward Capital flow curve - simple bezier fallback for path A
newpath
18 32 moveto
28 20 72 20 82 32 curveto
gsave
${(config.strokeWidth * 1.1).toFixed(2)} setlinewidth
setpcolor stroke
grestore

% Arrowhead A
newpath
70 34 moveto
82 32 lineto
78 20 lineto
gsave
${(config.strokeWidth * 1.1).toFixed(2)} setlinewidth
setpcolor stroke
grestore

% Return capital flow curve - bottom curves
newpath
82 68 moveto
72 80 28 80 18 68 curveto
gsave
${(config.strokeWidth * 1.1).toFixed(2)} setlinewidth
setpcolor stroke
grestore

% Arrowhead B
newpath
30 66 moveto
18 68 lineto
22 80 lineto
gsave
${(config.strokeWidth * 1.1).toFixed(2)} setlinewidth
setpcolor stroke
grestore
`;
      break;

    case 'piggy-bank':
      pathsCode = `
% Pig curly tail loop
newpath
22 52 moveto
14 52 14 44 18 40 curveto
setpcolor stroke

% Sturdy support legs
34 74 10 12 2 drawrrect
52 74 10 12 2 drawrrect

% Pig Core circular body
48 52 26 drawcircle

% Pig Snout
72 45 8 14 2 drawrrect

% Triangular Pig Ear
newpath
44 26 moveto
52 14 lineto
60 26 lineto
closepath
gsave
setscolor fill
grestore
setpcolor stroke

% Coin Slot
newpath
40 32 moveto
56 32 lineto
setpcolor stroke

% Eye spot
newpath
64 41 2.5 0 360 arc
gsave
setpcolor fill
grestore

% Accumulating Coin
48 16 6 drawcircle

% Coin motion glide streak
newpath
48 4 moveto
48 7 lineto
setpcolor stroke
`;
      break;

    case 'valuation-briefcase':
      pathsCode = `
% Sturdy handle arch
newpath
38 32 moveto
38 20 lineto
38 16 42 16 42 16 curveto
42 16 lineto
58 16 lineto
58 16 62 16 62 20 curveto
62 32 lineto
setpcolor stroke

% Main briefcase base shell layout
18 32 64 46 6 drawrrect

% Dual vertical safety leather straps
newpath
30 32 moveto 30 78 lineto
70 32 moveto 70 78 lineto
setpcolor stroke

% Seam division line
newpath
18 46 moveto
82 46 lineto
setpcolor stroke

% Central lock buckle
newpath
44 46 moveto
56 46 lineto
56 58 lineto
44 58 lineto
closepath
gsave
1 1 1 setrgbcolor fill
grestore
setpcolor stroke

% Micro keyhole
newpath
50 51 1.5 0 360 arc
gsave
setpcolor fill
grestore

newpath
50 52.5 moveto
50 55 lineto
gsave
1.5 setlinewidth
setpcolor stroke
grestore
`;
      break;

    case 'business-deal':
      pathsCode = `
% Main signed contract fold page
newpath
28 16 moveto
62 16 lineto
78 32 lineto
78 78 lineto
78 78 78 84 70 84 curveto
28 84 lineto
28 84 22 84 22 78 curveto
22 22 lineto
22 22 22 16 28 16 curveto
closepath
gsave
setscolor fill
grestore
setpcolor stroke

% Page fold accent
newpath
62 16 moveto
62 32 lineto
78 32 lineto
setpcolor stroke

% Mock Clause horizontal layout lines
newpath
30 28 moveto 52 28 lineto
30 40 moveto 70 40 lineto
30 48 moveto 70 48 lineto
30 56 moveto 56 56 lineto
30 70 moveto 44 70 lineto
setpcolor stroke

% Verified Transaction circular badge
newpath
64 68 10 0 360 arc
gsave
setpcolor fill
grestore

% Contrast white checkmark nested inside the badge
newpath
59 68 moveto
62 71 lineto
69 64 lineto
gsave
${(config.strokeWidth * 1.15).toFixed(2)} setlinewidth
1 1 1 setrgbcolor stroke
grestore
`;
      break;
  }
  }

  // Header segment of Encapsulated PostScript output (Standard Level 3.0 vector EPS format)
  return `%!PS-Adobe-3.0 EPSF-3.0
%%BoundingBox: 0 0 1024 1024
%%Title: ${id.toUpperCase()} Vector Asset
%%Creator: Finance Vector Icon Studio
%%CreationDate: 2026-06-12
%%Pages: 1
%%DocumentData: Clean7Bit
%%LanguageLevel: 2
%%EndComments
%%BeginProlog
% Set coordinates and parameters definitions
/setpcolor { ${pr.r.toFixed(4)} ${pr.g.toFixed(4)} ${pr.b.toFixed(4)} setrgbcolor } def
/setscolor { ${sr.r.toFixed(4)} ${sr.g.toFixed(4)} ${sr.b.toFixed(4)} setrgbcolor } def

% Circle wrapper (cx, cy, r)
/drawcircle {
    /r exch def
    /cy exch def
    /cx exch def
    newpath
    cx cy r 0 360 arc
    gsave
    setscolor fill
    grestore
    setpcolor stroke
} def

% Rounded Rectangle wrapper (x, y, w, h, rx)
/drawrrect {
    /rx exch def
    /h exch def
    /w exch def
    /y exch def
    /x exch def
    newpath
    x rx add y moveto
    x w add rx sub y lineto
    x w add y x w add y rx add rx arct
    x w add y h add rx sub lineto
    x w add y h add x w add rx sub y h add rx arct
    x rx add y h add lineto
    x y h add x y h add rx sub rx arct
    x y rx add lineto
    x y x rx add y rx arct
    closepath
    gsave
    setscolor fill
    grestore
    setpcolor stroke
} def
%%EndProlog

gsave
% Translate coordinate origin to match SVG standard and map to 1024x1024 viewport
0 1024 translate
10.24 -10.24 scale

% Configure stroke styling parameters
${config.strokeWidth.toFixed(2)} setlinewidth
${capIndex} setlinecap
${joinIndex} setlinejoin
setpcolor

% Draw optional Background
${
  config.backgroundColor === 'white'
    ? 'newpath 0 0 moveto 100 0 lineto 100 100 lineto 0 100 lineto closepath gsave 1 1 1 setrgbcolor fill grestore'
    : config.backgroundColor === 'dark'
    ? 'newpath 0 0 moveto 100 0 lineto 100 100 lineto 0 100 lineto closepath gsave 0.058 0.090 0.164 setrgbcolor fill grestore'
    : ''
}

% Geometry drawing layers
${pathsCode}

grestore
showpage
%%EOF
`;
}

export function getConsolidatedEpsSetString(icons: any[], config: StrokeConfig): string {
  const pr = hexToRgb(config.primaryColor);
  const mix = config.secondaryOpacity;
  const sr = {
    r: pr.r * mix + (1 - mix),
    g: pr.g * mix + (1 - mix),
    b: pr.b * mix + (1 - mix)
  };

  const capMap = { round: 1, butt: 0, square: 2 };
  const joinMap = { round: 1, miter: 0, bevel: 2 };
  const capIndex = capMap[config.lineCap] ?? 1;
  const joinIndex = joinMap[config.lineJoin] ?? 1;

  let compositeMatrixXml = '';

  icons.forEach((icon, index) => {
    const col = index % 3;
    const row = Math.floor(index / 3);
    const xOffset = 20 + col * 120;
    const yOffset = 20 + row * 120;

    // Isolate icon code
    const rawIndividual = getRawEpsString(icon, config);
    // Extract everything between "% Geometry drawing layers" and "grestore\nshowpage"
    const geomMarker = '% Geometry drawing layers';
    const cleanGeom = rawIndividual.substring(
      rawIndividual.indexOf(geomMarker) + geomMarker.length,
      rawIndividual.indexOf('grestore\nshowpage')
    );

    compositeMatrixXml += `
gsave
% Translate this specific cellular frame in matrix
${xOffset} ${yOffset} translate
% Subtle grid cellular box reference border
newpath
0 0 moveto 100 0 lineto 100 100 lineto 0 100 lineto closepath
gsave
${pr.r.toFixed(4)} ${pr.g.toFixed(4)} ${pr.b.toFixed(4)} setrgbcolor
0.03 setlinewidth
stroke
grestore

% Icon layers
${cleanGeom}
grestore
`;
  });

  return `%!PS-Adobe-3.0 EPSF-3.0
%%BoundingBox: 0 0 1024 1024
%%Title: Finance Uniform Icon Grid Set
%%Creator: Finance Vector Icon Studio
%%CreationDate: 2026-06-12
%%Pages: 1
%%LanguageLevel: 2
%%EndComments
%%BeginProlog
/setpcolor { ${pr.r.toFixed(4)} ${pr.g.toFixed(4)} ${pr.b.toFixed(4)} setrgbcolor } def
/setscolor { ${sr.r.toFixed(4)} ${sr.g.toFixed(4)} ${sr.b.toFixed(4)} setrgbcolor } def

% Circle wrapper (cx, cy, r)
/drawcircle {
    /r exch def
    /cy exch def
    /cx exch def
    newpath
    cx cy r 0 360 arc
    gsave
    setscolor fill
    grestore
    setpcolor stroke
} def

% Rounded Rectangle wrapper (x, y, w, h, rx)
/drawrrect {
    /rx exch def
    /h exch def
    /w exch def
    /y exch def
    /x exch def
    newpath
    x rx add y moveto
    x w add rx sub y lineto
    x w add y x w add y rx add rx arct
    x w add y h add rx sub lineto
    x w add y h add x w add rx sub y h add rx arct
    x rx add y h add lineto
    x y h add x y h add rx sub rx arct
    x y rx add lineto
    x y x rx add y rx arct
    closepath
    gsave
    setscolor fill
    grestore
    setpcolor stroke
} def
%%EndProlog

gsave
% Map 380x260 grid matrix inside 1024x1024 coordinates
% Aspect ratio is 380/260 = 1.46. Let's translate & scale centered
13 162 translate
2.62 -2.62 scale

% Stroke definitions
${config.strokeWidth.toFixed(2)} setlinewidth
${capIndex} setlinecap
${joinIndex} setlinejoin
setpcolor

% Background
${
  config.backgroundColor === 'white'
    ? 'newpath -20 -20 moveto 400 -20 lineto 400 300 lineto -20 300 lineto closepath gsave 1 1 1 setrgbcolor fill grestore'
    : config.backgroundColor === 'dark'
    ? 'newpath -20 -20 moveto 400 -20 lineto 400 300 lineto -20 300 lineto closepath gsave 0.058 0.090 0.164 setrgbcolor fill grestore'
    : ''
}

${compositeMatrixXml}

grestore
showpage
%%EOF
`;
}
