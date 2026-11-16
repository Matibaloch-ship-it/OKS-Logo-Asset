import JSZip from 'jszip';
import {
  BRAND_COLORS,
  buildFullSheetSvgString,
  buildStandaloneSvgString,
  SYMBOL_PATHS,
} from './logoSpec';

export interface BrandKitProgress {
  completed: number;
  total: number;
  label: string;
}

function buildCustomIconSvg(
  orangeColor: string,
  tealColor: string,
  backgroundColor: string | null,
  size: number = 1024
): string {
  const bgRect = backgroundColor
    ? `<rect width="160" height="160" fill="${backgroundColor}" />`
    : '';
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="${size}" height="${size}">`,
    bgRect,
    `<g transform="translate(12.75, 30)">`,
    `<path d="${SYMBOL_PATHS.orangeO}" fill="${orangeColor}" />`,
    `<path d="${SYMBOL_PATHS.tealK}" fill="${tealColor}" />`,
    `</g>`,
    `</svg>`,
  ]
    .filter(Boolean)
    .join('\n');
}

function buildPaletteSwatchesSvg(): string {
  const cardW = 240;
  const totalW = BRAND_COLORS.length * cardW;
  const totalH = 300;
  const cards = BRAND_COLORS.map((c, idx) => {
    const x = idx * cardW;
    const isDark = c.hex === '#0F766E' || c.hex === '#2C2C2C';
    const textFill = isDark ? '#FFFFFF' : '#2C2C2C';
    return [
      `<g transform="translate(${x}, 0)">`,
      `<rect width="${cardW}" height="${totalH}" fill="${c.hex}" />`,
      `<text x="20" y="34" font-family="'JetBrains Mono', monospace" font-size="13" font-weight="500" fill="${textFill}">${c.hex}</text>`,
      `<text x="20" y="54" font-family="'JetBrains Mono', monospace" font-size="11" fill="${textFill}" fill-opacity="0.75">RGB(${c.rgb})</text>`,
      `<text x="20" y="250" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="16" font-weight="600" fill="${textFill}">${c.name}</text>`,
      `<text x="20" y="272" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="11" fill="${textFill}" fill-opacity="0.75">Target Share: ${c.share}</text>`,
      `</g>`,
    ].join('\n');
  }).join('\n');

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalW} ${totalH}" width="${totalW}" height="${totalH}">`,
    cards,
    `</svg>`,
  ].join('\n');
}

async function svgToRasterBlob(
  svgContent: string,
  targetWidth: number,
  mimeType: 'image/png' | 'image/webp' = 'image/png'
): Promise<Blob | null> {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgContent, 'image/svg+xml');
  const svgEl = doc.documentElement;
  const viewBoxAttr = svgEl.getAttribute('viewBox') || '0 0 520 160';
  const parts = viewBoxAttr.split(/\s+/).map(Number);
  const vbWidth = parts[2] || 520;
  const vbHeight = parts[3] || 160;
  const targetHeight = Math.max(1, Math.round((targetWidth * vbHeight) / vbWidth));

  svgEl.setAttribute('width', String(targetWidth));
  svgEl.setAttribute('height', String(targetHeight));
  const serialized = new XMLSerializer().serializeToString(svgEl);

  const svgBlob = new Blob([serialized], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        URL.revokeObjectURL(url);
        reject(new Error('Canvas 2D context unavailable'));
        return;
      }
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
      URL.revokeObjectURL(url);
      canvas.toBlob(
        (blob) => resolve(blob),
        mimeType,
        mimeType === 'image/webp' ? 0.96 : 1.0
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to rasterize SVG asset'));
    };
    img.src = url;
  });
}

function buildColorTokensJson(): string {
  return JSON.stringify(
    {
      brand: 'Orange Kite Studio',
      location: 'Lahore, Pakistan',
      version: '1.0',
      colors: BRAND_COLORS.map((c) => ({
        name: c.name,
        hex: c.hex,
        rgb: `rgb(${c.rgb})`,
        role: c.role,
        recommendedShare: c.share,
      })),
    },
    null,
    2
  );
}

function buildColorCss(): string {
  return [
    '/* Orange Kite Studio — Brand Color Tokens */',
    ':root {',
    '  --oks-orange: #E67E22;',
    '  --oks-deep-teal: #0F766E;',
    '  --oks-sand-beige: #E8DCCB;',
    '  --oks-charcoal: #2C2C2C;',
    '  --oks-white: #FFFFFF;',
    '}',
    '',
  ].join('\n');
}

function buildColorScss(): string {
  return [
    '// Orange Kite Studio — Brand Color Tokens',
    '$oks-orange: #E67E22;',
    '$oks-deep-teal: #0F766E;',
    '$oks-sand-beige: #E8DCCB;',
    '$oks-charcoal: #2C2C2C;',
    '$oks-white: #FFFFFF;',
    '',
  ].join('\n');
}

function buildTypographyCss(): string {
  return [
    '/* Orange Kite Studio — Typography System */',
    "@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Playfair+Display:wght@500;600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');",
    '',
    ':root {',
    "  --oks-font-display: 'Playfair Display', Georgia, serif;",
    "  --oks-font-sans: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;",
    "  --oks-font-mono: 'JetBrains Mono', monospace;",
    '}',
    '',
  ].join('\n');
}

function buildSpecsJson(): string {
  return JSON.stringify(
    {
      brand: 'Orange Kite Studio',
      tagline: 'Rise with intention. Lead with impact.',
      positioning: 'Creative intelligence for market leaders.',
      markGeometry: {
        concept: 'Refined OK Sargodha Orange + Basant Kite Fusion',
        masterViewBox: '0 0 134.5 80',
        strokeWidthUnits: 17,
        strokeParity: '1:1',
        kiteChevronAngleDeg: 45,
        centralSeparationUnits: 4.5,
        minimumClearSpace: '1x stroke width (17 units)',
      },
      typography: {
        displaySerif: 'Playfair Display (500, 600)',
        wordmarkAndBodySans: 'Plus Jakarta Sans (400, 500, 600, 700)',
        technicalMonospace: 'JetBrains Mono (400, 500)',
      },
    },
    null,
    2
  );
}

function buildWebManifest(): string {
  return JSON.stringify(
    {
      name: 'Orange Kite Studio',
      short_name: 'Orange Kite',
      icons: [
        {
          src: 'android-chrome-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: 'android-chrome-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
      ],
      theme_color: '#0F766E',
      background_color: '#E8DCCB',
      display: 'standalone',
    },
    null,
    2
  );
}

function buildReadmeTxt(): string {
  return `ORANGE KITE STUDIO — BRAND IDENTITY KIT (v1.0)
================================================
Positioning: Creative intelligence for market leaders.
Tagline: Rise with intention. Lead with impact.

FOLDER CONTENTS
---------------
01-Presentation-Sheet/
  - Complete 4-quadrant editorial presentation sheets (Horizontal & Stacked) in SVG & 3200px PNG.

02-Logos/
  01-Primary-Full-Color/
    - Vector SVG & Raster PNG (1024px, 2048px, 4096px) + WebP (2048px)
    - Includes Horizontal & Stacked lockups, With/Without Tagline, Transparent & Sand Beige (#E8DCCB) backgrounds.
  02-Standalone-Icon/
    - Vector SVG & Raster PNG (16px to 1024px) in Full Color, Charcoal, and Reversed White.
    - Favicon/ folder containing favicon.svg, 16x16, 32x32, 180x180 Apple Touch, 192x192, 512x512, and site.webmanifest.
  03-Monochrome-Charcoal/
    - Single-ink Charcoal (#2C2C2C) lockups in SVG & PNG (1024px, 2048px, 4096px) for print & stamping.
  04-Inverted-White/
    - Reversed Pure White (#FFFFFF) lockups on solid Deep Teal (#0F766E) and transparent backgrounds (SVG & PNG).

03-Color-Palette/
  - colors.json, colors.css, colors.scss, plus visual swatch sheets (SVG & 2400px PNG).

04-Typography-and-Specs/
  - brand-specifications.json & typography.css (Playfair Display, Plus Jakarta Sans, JetBrains Mono).

USAGE GUARDRAILS
----------------
- Maintain minimum 1x stroke-width clear space around all logo lockups.
- Never apply drop shadows, bevels, 3D effects, or gradients.
- Always preserve the 4.5-unit separation between the Sargodha orange pinch vertex and Deep Teal kite apex.
`;
}

export async function downloadCompleteBrandKitZip(
  onProgress?: (progress: BrandKitProgress) => void
): Promise<void> {
  if (typeof document !== 'undefined' && 'fonts' in document) {
    try {
      await document.fonts.ready;
    } catch {
      // Continue if font check rejects
    }
  }

  const zip = new JSZip();
  const root = zip.folder('Orange-Kite-Studio-Brand-Kit');
  if (!root) {
    throw new Error('Unable to initialize ZIP archive');
  }

  root.file('README.txt', buildReadmeTxt());

  interface RasterTask {
    path: string;
    svg: string;
    width: number;
    mime: 'image/png' | 'image/webp';
    label: string;
  }

  const rasterTasks: RasterTask[] = [];

  // 01 Presentation Sheets
  const sheetFolder = root.folder('01-Presentation-Sheet');
  if (sheetFolder) {
    const hSheetSvg = buildFullSheetSvgString('horizontal', true);
    const sSheetSvg = buildFullSheetSvgString('stacked', true);
    sheetFolder.file('orange-kite-studio-sheet-horizontal.svg', hSheetSvg);
    sheetFolder.file('orange-kite-studio-sheet-stacked.svg', sSheetSvg);
    rasterTasks.push(
      {
        path: '01-Presentation-Sheet/orange-kite-studio-sheet-horizontal-3200px.png',
        svg: hSheetSvg,
        width: 3200,
        mime: 'image/png',
        label: 'Horizontal presentation sheet (3200px)',
      },
      {
        path: '01-Presentation-Sheet/orange-kite-studio-sheet-stacked-3200px.png',
        svg: sSheetSvg,
        width: 3200,
        mime: 'image/png',
        label: 'Stacked presentation sheet (3200px)',
      }
    );
  }

  // 02 Lockup Variations (Primary, Monochrome, Inverted)
  const lockupConfigs: Array<{
    id: 'primary' | 'monochrome' | 'inverted';
    folderName: string;
    bgLabel: string;
  }> = [
    {
      id: 'primary',
      folderName: '02-Logos/01-Primary-Full-Color',
      bgLabel: 'sand-beige',
    },
    {
      id: 'monochrome',
      folderName: '02-Logos/03-Monochrome-Charcoal',
      bgLabel: 'sand-beige',
    },
    {
      id: 'inverted',
      folderName: '02-Logos/04-Inverted-White',
      bgLabel: 'deep-teal',
    },
  ];

  const lockupWidths = [1024, 2048, 4096];

  for (const cfg of lockupConfigs) {
    for (const mode of ['horizontal', 'stacked'] as const) {
      for (const withTagline of [true, false]) {
        const tagSlug = withTagline ? '' : '-no-tagline';
        const svgTransparent = buildStandaloneSvgString(cfg.id, mode, withTagline, false);
        const svgFilled = buildStandaloneSvgString(cfg.id, mode, withTagline, true);

        root.file(
          `${cfg.folderName}/SVG/oks-${cfg.id}-${mode}${tagSlug}-transparent.svg`,
          svgTransparent
        );
        root.file(
          `${cfg.folderName}/SVG/oks-${cfg.id}-${mode}${tagSlug}-${cfg.bgLabel}.svg`,
          svgFilled
        );

        // Rasterize key sizes (full PNG sizes for tagline=true, 2048px for no-tagline)
        const widths = withTagline ? lockupWidths : [2048];
        for (const w of widths) {
          rasterTasks.push({
            path: `${cfg.folderName}/PNG/oks-${cfg.id}-${mode}${tagSlug}-transparent-${w}px.png`,
            svg: svgTransparent,
            width: w,
            mime: 'image/png',
            label: `${cfg.id} ${mode} PNG (${w}px)`,
          });
          rasterTasks.push({
            path: `${cfg.folderName}/PNG/oks-${cfg.id}-${mode}${tagSlug}-${cfg.bgLabel}-${w}px.png`,
            svg: svgFilled,
            width: w,
            mime: 'image/png',
            label: `${cfg.id} ${mode} ${cfg.bgLabel} PNG (${w}px)`,
          });
        }

        if (withTagline) {
          rasterTasks.push({
            path: `${cfg.folderName}/WebP/oks-${cfg.id}-${mode}-transparent-2048px.webp`,
            svg: svgTransparent,
            width: 2048,
            mime: 'image/webp',
            label: `${cfg.id} ${mode} WebP`,
          });
        }
      }
    }
  }

  // 02-Logos/02-Standalone-Icon & Favicons
  const iconBase = '02-Logos/02-Standalone-Icon';
  const iconColorTrans = buildCustomIconSvg('#E67E22', '#0F766E', null);
  const iconColorSand = buildCustomIconSvg('#E67E22', '#0F766E', '#E8DCCB');
  const iconCharcoalTrans = buildCustomIconSvg('#2C2C2C', '#2C2C2C', null);
  const iconWhiteTrans = buildCustomIconSvg('#FFFFFF', '#FFFFFF', null);
  const iconWhiteTeal = buildCustomIconSvg('#FFFFFF', '#FFFFFF', '#0F766E');

  root.file(`${iconBase}/SVG/oks-icon-full-color-transparent.svg`, iconColorTrans);
  root.file(`${iconBase}/SVG/oks-icon-full-color-sand-beige.svg`, iconColorSand);
  root.file(`${iconBase}/SVG/oks-icon-charcoal-transparent.svg`, iconCharcoalTrans);
  root.file(`${iconBase}/SVG/oks-icon-white-transparent.svg`, iconWhiteTrans);
  root.file(`${iconBase}/SVG/oks-icon-white-on-teal.svg`, iconWhiteTeal);
  root.file(`${iconBase}/Favicon/favicon.svg`, iconColorSand);
  root.file(`${iconBase}/Favicon/site.webmanifest`, buildWebManifest());

  const iconSizes = [16, 32, 64, 128, 256, 512, 1024];
  for (const s of iconSizes) {
    rasterTasks.push({
      path: `${iconBase}/PNG/oks-icon-full-color-transparent-${s}px.png`,
      svg: iconColorTrans,
      width: s,
      mime: 'image/png',
      label: `Standalone icon ${s}px`,
    });
    rasterTasks.push({
      path: `${iconBase}/PNG/oks-icon-full-color-sand-beige-${s}px.png`,
      svg: iconColorSand,
      width: s,
      mime: 'image/png',
      label: `Standalone icon Sand Beige ${s}px`,
    });
  }

  for (const s of [256, 512, 1024]) {
    rasterTasks.push(
      {
        path: `${iconBase}/PNG/oks-icon-charcoal-transparent-${s}px.png`,
        svg: iconCharcoalTrans,
        width: s,
        mime: 'image/png',
        label: `Charcoal icon ${s}px`,
      },
      {
        path: `${iconBase}/PNG/oks-icon-white-on-teal-${s}px.png`,
        svg: iconWhiteTeal,
        width: s,
        mime: 'image/png',
        label: `Inverted icon ${s}px`,
      }
    );
  }

  // Dedicated Favicon PNG targets
  const faviconTargets = [
    { name: 'favicon-16x16.png', size: 16, svg: iconColorTrans },
    { name: 'favicon-32x32.png', size: 32, svg: iconColorTrans },
    { name: 'apple-touch-icon-180x180.png', size: 180, svg: iconColorSand },
    { name: 'android-chrome-192x192.png', size: 192, svg: iconColorSand },
    { name: 'android-chrome-512x512.png', size: 512, svg: iconColorSand },
  ];
  for (const fav of faviconTargets) {
    rasterTasks.push({
      path: `${iconBase}/Favicon/${fav.name}`,
      svg: fav.svg,
      width: fav.size,
      mime: 'image/png',
      label: `Favicon ${fav.name}`,
    });
  }

  // 03-Color-Palette
  const paletteSvg = buildPaletteSwatchesSvg();
  root.file('03-Color-Palette/colors.json', buildColorTokensJson());
  root.file('03-Color-Palette/colors.css', buildColorCss());
  root.file('03-Color-Palette/colors.scss', buildColorScss());
  root.file('03-Color-Palette/palette-swatches.svg', paletteSvg);
  rasterTasks.push({
    path: '03-Color-Palette/palette-swatches-2400px.png',
    svg: paletteSvg,
    width: 2400,
    mime: 'image/png',
    label: 'Color swatch board PNG',
  });

  // 04-Typography-and-Specs
  root.file('04-Typography-and-Specs/brand-specifications.json', buildSpecsJson());
  root.file('04-Typography-and-Specs/typography.css', buildTypographyCss());

  // Execute raster conversions sequentially/small batches with live progress
  const total = rasterTasks.length;
  for (let i = 0; i < total; i++) {
    const task = rasterTasks[i];
    onProgress?.({
      completed: i,
      total,
      label: task.label,
    });
    const blob = await svgToRasterBlob(task.svg, task.width, task.mime);
    if (blob) {
      root.file(task.path, blob);
    }
  }

  onProgress?.({
    completed: total,
    total,
    label: 'Compressing Orange-Kite-Studio-Brand-Kit.zip…',
  });

  const zipBlob = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  });

  const url = URL.createObjectURL(zipBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'Orange-Kite-Studio-Brand-Kit.zip';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
