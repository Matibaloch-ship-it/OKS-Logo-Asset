export type QuadrantId = 'primary' | 'icon' | 'monochrome' | 'inverted';
export type LockupMode = 'horizontal' | 'stacked';

export interface BrandColor {
  name: string;
  hex: string;
  rgb: string;
  role: string;
  share: string;
}

export interface QuadrantSpec {
  id: QuadrantId;
  index: string;
  title: string;
  subtitle: string;
  description: string;
  backgroundHex: string;
  foregroundColors: string[];
  usageRule: string;
}

export const BRAND_COLORS: BrandColor[] = [
  {
    name: 'Signature Orange',
    hex: '#E67E22',
    rgb: '230, 126, 34',
    role: 'Sargodha orange origin, primary mark accent, focal highlights',
    share: '10%',
  },
  {
    name: 'Deep Teal',
    hex: '#0F766E',
    rgb: '15, 118, 110',
    role: 'Basant kite chevron, inverted canvas, secondary contrast',
    share: '10%',
  },
  {
    name: 'Sand Beige',
    hex: '#E8DCCB',
    rgb: '232, 220, 203',
    role: 'Editorial presentation sheet canvas, warm neutral backdrop',
    share: '55%',
  },
  {
    name: 'Charcoal',
    hex: '#2C2C2C',
    rgb: '44, 44, 44',
    role: 'Wordmark typography, single-color print monochrome, hairline rules',
    share: '25%',
  },
  {
    name: 'Pure White',
    hex: '#FFFFFF',
    rgb: '255, 255, 255',
    role: 'Reversed mark on Deep Teal, high-contrast negative space',
    share: '—',
  },
];

export const QUADRANTS: QuadrantSpec[] = [
  {
    id: 'primary',
    index: '01',
    title: 'Primary Full-Color Lockup',
    subtitle: 'Orange #E67E22 · Deep Teal #0F766E · Charcoal #2C2C2C',
    description:
      'Master agency signature pairing the Sargodha orange pinch-ring and 45° Basant kite chevron with the uppercase Orange Kite Studio wordmark.',
    backgroundHex: '#E8DCCB',
    foregroundColors: ['#E67E22', '#0F766E', '#2C2C2C'],
    usageRule: 'Default lockup for proposals, digital headers, and client presentations.',
  },
  {
    id: 'icon',
    index: '02',
    title: 'Standalone Icon Mark',
    subtitle: 'Favicon & Social Avatar · 1:1 Optical Frame',
    description:
      'Simplified symbol-only mark engineered for 16px browser tabs, social profiles, and app icons without losing the central kite-vertex tension.',
    backgroundHex: '#E8DCCB',
    foregroundColors: ['#E67E22', '#0F766E'],
    usageRule: 'Use standalone whenever horizontal width is below 120px or brand name is adjacent.',
  },
  {
    id: 'monochrome',
    index: '03',
    title: 'Charcoal Monochrome',
    subtitle: 'Single-Color Print · Solid #2C2C2C',
    description:
      'Unified solid Charcoal application preserving the 4-unit central separation gap for letterpress, embossing, stamping, and black-and-white print.',
    backgroundHex: '#E8DCCB',
    foregroundColors: ['#2C2C2C'],
    usageRule: 'Required for single-ink print runs, foil stamping, and engraved stationery.',
  },
  {
    id: 'inverted',
    index: '04',
    title: 'Inverted on Deep Teal',
    subtitle: 'Reversed White #FFFFFF · Canvas #0F766E',
    description:
      'Pure white reversed identity anchored against a solid Deep Teal field for dark presentation covers, merchandise, and architectural signage.',
    backgroundHex: '#0F766E',
    foregroundColors: ['#FFFFFF'],
    usageRule: 'Maintain minimum 1x clear-space margin on all dark or saturated surfaces.',
  },
];

/**
 * Exact mathematical vector geometry for the refined OK Orange-Kite symbol.
 * Master symbol coordinate space: x in [0, 134.5], y in [10, 90] (height = 80, stroke = 17).
 * - Sargodha Orange "O": center (40, 50), R = 40, r = 23, pinch vertex P = (66, 50), 60deg outer bevel.
 * - Basant Kite "K": 45deg chevron with outer apex (70.5, 50), top/bottom caps width 24 (16.97 perp).
 */
export const SYMBOL_PATHS = {
  orangeO:
    'M 76.03 32.63 A 40 40 0 1 0 76.03 67.37 L 66 50 L 60.35 60.73 A 23 23 0 1 1 60.35 39.27 L 66 50 Z',
  tealK: 'M 70.5 50 L 110.5 10 L 134.5 10 L 94.5 50 L 134.5 90 L 110.5 90 Z',
};

export interface PaletteMapping {
  orangePart: string;
  tealPart: string;
  titleText: string;
  studioText: string;
  taglineText: string;
  background: string;
}

export function getQuadrantPalette(id: QuadrantId): PaletteMapping {
  switch (id) {
    case 'primary':
      return {
        orangePart: '#E67E22',
        tealPart: '#0F766E',
        titleText: '#2C2C2C',
        studioText: '#0F766E',
        taglineText: '#575049',
        background: '#E8DCCB',
      };
    case 'icon':
      return {
        orangePart: '#E67E22',
        tealPart: '#0F766E',
        titleText: '#2C2C2C',
        studioText: '#0F766E',
        taglineText: '#575049',
        background: '#E8DCCB',
      };
    case 'monochrome':
      return {
        orangePart: '#2C2C2C',
        tealPart: '#2C2C2C',
        titleText: '#2C2C2C',
        studioText: '#2C2C2C',
        taglineText: '#2C2C2C',
        background: '#E8DCCB',
      };
    case 'inverted':
      return {
        orangePart: '#FFFFFF',
        tealPart: '#FFFFFF',
        titleText: '#FFFFFF',
        studioText: '#FFFFFF',
        taglineText: '#E8DCCB',
        background: '#0F766E',
      };
  }
}

export function buildStandaloneSvgString(
  id: QuadrantId,
  lockupMode: LockupMode,
  showTagline: boolean,
  includeBackground: boolean = true
): string {
  const colors = getQuadrantPalette(id);

  if (id === 'icon') {
    const bgRect = includeBackground
      ? `<rect width="160" height="160" fill="${colors.background}" />`
      : '';
    return [
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="1024" height="1024">`,
      bgRect,
      `<g transform="translate(12.75, 30)">`,
      `<path d="${SYMBOL_PATHS.orangeO}" fill="${colors.orangePart}" />`,
      `<path d="${SYMBOL_PATHS.tealK}" fill="${colors.tealPart}" />`,
      `</g>`,
      `</svg>`,
    ]
      .filter(Boolean)
      .join('\n');
  }

  if (lockupMode === 'stacked') {
    const vbWidth = 400;
    const vbHeight = showTagline ? 260 : 230;
    const bgRect = includeBackground
      ? `<rect width="${vbWidth}" height="${vbHeight}" fill="${colors.background}" />`
      : '';
    const taglineMarkup = showTagline
      ? `<text x="200" y="218" text-anchor="middle" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="8.5" font-weight="500" letter-spacing="3.2" fill="${colors.taglineText}">RISE WITH INTENTION. LEAD WITH IMPACT.</text>`
      : '';

    return [
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${vbWidth} ${vbHeight}" width="1600" height="${Math.round(
        (1600 * vbHeight) / vbWidth
      )}">`,
      bgRect,
      `<g transform="translate(132.75, 24)">`,
      `<path d="${SYMBOL_PATHS.orangeO}" fill="${colors.orangePart}" />`,
      `<path d="${SYMBOL_PATHS.tealK}" fill="${colors.tealPart}" />`,
      `</g>`,
      `<text x="200" y="156" text-anchor="middle" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="25" font-weight="700" letter-spacing="5.5" fill="${colors.titleText}">ORANGE KITE</text>`,
      `<text x="200" y="186" text-anchor="middle" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="15.5" font-weight="500" letter-spacing="8.5" fill="${colors.studioText}">STUDIO</text>`,
      taglineMarkup,
      `</svg>`,
    ]
      .filter(Boolean)
      .join('\n');
  }

  // Horizontal lockup
  const vbWidth = 520;
  const vbHeight = 160;
  const bgRect = includeBackground
    ? `<rect width="${vbWidth}" height="${vbHeight}" fill="${colors.background}" />`
    : '';
  const taglineMarkup = showTagline
    ? `<text x="208" y="114" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="8.5" font-weight="500" letter-spacing="2.8" fill="${colors.taglineText}">RISE WITH INTENTION. LEAD WITH IMPACT.</text>`
    : '';
  const titleY = showTagline ? 64 : 74;
  const studioY = showTagline ? 90 : 102;

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${vbWidth} ${vbHeight}" width="2080" height="640">`,
    bgRect,
    `<g transform="translate(36, 30)">`,
    `<path d="${SYMBOL_PATHS.orangeO}" fill="${colors.orangePart}" />`,
    `<path d="${SYMBOL_PATHS.tealK}" fill="${colors.tealPart}" />`,
    `</g>`,
    `<text x="208" y="${titleY}" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="26" font-weight="700" letter-spacing="5.2" fill="${colors.titleText}">ORANGE KITE</text>`,
    `<text x="209" y="${studioY}" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="16" font-weight="500" letter-spacing="8.8" fill="${colors.studioText}">STUDIO</text>`,
    taglineMarkup,
    `</svg>`,
  ]
    .filter(Boolean)
    .join('\n');
}

export function buildFullSheetSvgString(
  lockupMode: LockupMode,
  showTagline: boolean
): string {
  const width = 1600;
  const height = 1040;
  const halfW = width / 2;
  const halfH = height / 2;

  const renderCellLogo = (id: QuadrantId, cx: number, cy: number): string => {
    const colors = getQuadrantPalette(id);
    if (id === 'icon') {
      return [
        `<g transform="translate(${cx - 94}, ${cy - 70}) scale(1.4)">`,
        `<path d="${SYMBOL_PATHS.orangeO}" fill="${colors.orangePart}" />`,
        `<path d="${SYMBOL_PATHS.tealK}" fill="${colors.tealPart}" />`,
        `</g>`,
      ].join('');
    }
    if (lockupMode === 'stacked') {
      const tag = showTagline
        ? `<text x="${cx}" y="${cy + 102}" text-anchor="middle" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="10" font-weight="500" letter-spacing="3.4" fill="${colors.taglineText}">RISE WITH INTENTION. LEAD WITH IMPACT.</text>`
        : '';
      return [
        `<g transform="translate(${cx - 80.7}, ${cy - 106}) scale(1.2)">`,
        `<path d="${SYMBOL_PATHS.orangeO}" fill="${colors.orangePart}" />`,
        `<path d="${SYMBOL_PATHS.tealK}" fill="${colors.tealPart}" />`,
        `</g>`,
        `<text x="${cx}" y="${cy + 36}" text-anchor="middle" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="30" font-weight="700" letter-spacing="6" fill="${colors.titleText}">ORANGE KITE</text>`,
        `<text x="${cx}" y="${cy + 70}" text-anchor="middle" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="18" font-weight="500" letter-spacing="10" fill="${colors.studioText}">STUDIO</text>`,
        tag,
      ].join('');
    }
    const tag = showTagline
      ? `<text x="${cx - 56}" y="${cy + 40}" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="9.5" font-weight="500" letter-spacing="3.0" fill="${colors.taglineText}">RISE WITH INTENTION. LEAD WITH IMPACT.</text>`
      : '';
    const titleY = showTagline ? cy - 14 : cy - 4;
    const studioY = showTagline ? cy + 16 : cy + 28;
    return [
      `<g transform="translate(${cx - 242}, ${cy - 58}) scale(1.16)">`,
      `<path d="${SYMBOL_PATHS.orangeO}" fill="${colors.orangePart}" />`,
      `<path d="${SYMBOL_PATHS.tealK}" fill="${colors.tealPart}" />`,
      `</g>`,
      `<text x="${cx - 56}" y="${titleY}" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="30" font-weight="700" letter-spacing="5.8" fill="${colors.titleText}">ORANGE KITE</text>`,
      `<text x="${cx - 55}" y="${studioY}" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="18" font-weight="500" letter-spacing="9.5" fill="${colors.studioText}">STUDIO</text>`,
      tag,
    ].join('');
  };

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">`,
    `<rect width="${width}" height="${height}" fill="#E8DCCB" />`,
    `<rect x="${halfW}" y="${halfH}" width="${halfW}" height="${halfH}" fill="#0F766E" />`,
    `<line x1="${halfW}" y1="0" x2="${halfW}" y2="${height}" stroke="#2C2C2C" stroke-opacity="0.16" stroke-width="1" />`,
    `<line x1="0" y1="${halfH}" x2="${width}" y2="${halfH}" stroke="#2C2C2C" stroke-opacity="0.16" stroke-width="1" />`,
    renderCellLogo('primary', halfW * 0.5, halfH * 0.5),
    renderCellLogo('icon', halfW * 1.5, halfH * 0.5),
    renderCellLogo('monochrome', halfW * 0.5, halfH * 1.5),
    renderCellLogo('inverted', halfW * 1.5, halfH * 1.5),
    `<text x="36" y="${halfH - 28}" font-family="'JetBrains Mono', monospace" font-size="12" letter-spacing="2" fill="#2C2C2C" fill-opacity="0.65">01 / PRIMARY FULL COLOR</text>`,
    `<text x="${halfW + 36}" y="${halfH - 28}" font-family="'JetBrains Mono', monospace" font-size="12" letter-spacing="2" fill="#2C2C2C" fill-opacity="0.65">02 / STANDALONE ICON MARK</text>`,
    `<text x="36" y="${height - 28}" font-family="'JetBrains Mono', monospace" font-size="12" letter-spacing="2" fill="#2C2C2C" fill-opacity="0.65">03 / CHARCOAL MONOCHROME</text>`,
    `<text x="${halfW + 36}" y="${height - 28}" font-family="'JetBrains Mono', monospace" font-size="12" letter-spacing="2" fill="#FFFFFF" fill-opacity="0.78">04 / INVERTED ON DEEP TEAL</text>`,
    `</svg>`,
  ].join('\n');
}

export function triggerSvgDownload(svgContent: string, filename: string): void {
  const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export async function triggerPngDownload(
  svgContent: string,
  filename: string,
  targetWidth: number = 2048
): Promise<void> {
  if (typeof document !== 'undefined' && 'fonts' in document) {
    try {
      await document.fonts.ready;
    } catch {
      // Proceed with fallback system fonts if font loading check rejects
    }
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(svgContent, 'image/svg+xml');
  const svgEl = doc.documentElement;
  const viewBoxAttr = svgEl.getAttribute('viewBox') || '0 0 520 160';
  const parts = viewBoxAttr.split(/\s+/).map(Number);
  const vbWidth = parts[2] || 520;
  const vbHeight = parts[3] || 160;
  const targetHeight = Math.round((targetWidth * vbHeight) / vbWidth);

  svgEl.setAttribute('width', String(targetWidth));
  svgEl.setAttribute('height', String(targetHeight));
  const serialized = new XMLSerializer().serializeToString(svgEl);

  const svgBlob = new Blob([serialized], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);

  await new Promise<void>((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        URL.revokeObjectURL(url);
        reject(new Error('Canvas context unavailable'));
        return;
      }
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
      URL.revokeObjectURL(url);
      canvas.toBlob(
        (pngBlob) => {
          if (!pngBlob) {
            reject(new Error('PNG export failed'));
            return;
          }
          const pngUrl = URL.createObjectURL(pngBlob);
          const link = document.createElement('a');
          link.href = pngUrl;
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(pngUrl);
          resolve();
        },
        'image/png',
        1.0
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to rasterize SVG'));
    };
    img.src = url;
  });
}
