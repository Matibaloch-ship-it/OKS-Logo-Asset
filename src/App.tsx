import React, { useEffect, useRef, useState } from 'react';
import { Check, Copy, Download, FolderArchive, Grid, Layers } from 'lucide-react';
import {
  BrandKitProgress,
  downloadCompleteBrandKitZip,
} from './brand/brandKitExporter';
import {
  BRAND_COLORS,
  buildFullSheetSvgString,
  LockupMode,
  QUADRANTS,
  QuadrantSpec,
  SYMBOL_PATHS,
  triggerPngDownload,
  triggerSvgDownload,
} from './brand/logoSpec';
import { BrandKitSection } from './components/BrandKitSection';
import { InspectorModal } from './components/InspectorModal';
import { QuadrantCard } from './components/QuadrantCard';

export default function App() {
  const [lockupMode, setLockupMode] = useState<LockupMode>('horizontal');
  const [showGrid, setShowGrid] = useState<boolean>(false);
  const [showTagline, setShowTagline] = useState<boolean>(true);
  const [activeSpec, setActiveSpec] = useState<QuadrantSpec | null>(null);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [exportMenuOpen, setExportMenuOpen] = useState<boolean>(false);
  const [exportingPng, setExportingPng] = useState<boolean>(false);
  const [kitGenerating, setKitGenerating] = useState<boolean>(false);
  const [kitProgress, setKitProgress] = useState<BrandKitProgress | null>(null);
  const [kitError, setKitError] = useState<string | null>(null);
  const exportMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!exportMenuOpen) return;
    const handleOutside = (e: MouseEvent) => {
      if (
        exportMenuRef.current &&
        !exportMenuRef.current.contains(e.target as Node)
      ) {
        setExportMenuOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setExportMenuOpen(false);
    };
    document.addEventListener('mousedown', handleOutside);
    window.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      window.removeEventListener('keydown', handleKey);
    };
  }, [exportMenuOpen]);

  const handleCopyColor = async (hex: string) => {
    try {
      await navigator.clipboard.writeText(hex);
      setCopiedHex(hex);
      setTimeout(() => setCopiedHex(null), 1600);
    } catch {
      // Clipboard API unavailable
    }
  };

  const handleExportFullSvg = () => {
    const svg = buildFullSheetSvgString(lockupMode, showTagline);
    triggerSvgDownload(svg, `orange-kite-studio-presentation-sheet-${lockupMode}.svg`);
    setExportMenuOpen(false);
  };

  const handleExportFullPng = async () => {
    setExportingPng(true);
    try {
      const svg = buildFullSheetSvgString(lockupMode, showTagline);
      await triggerPngDownload(
        svg,
        `orange-kite-studio-presentation-sheet-${lockupMode}.png`,
        3200
      );
    } finally {
      setExportingPng(false);
      setExportMenuOpen(false);
    }
  };

  const handleDownloadBrandKit = async () => {
    if (kitGenerating) return;
    setExportMenuOpen(false);
    setKitError(null);
    setKitGenerating(true);
    try {
      await downloadCompleteBrandKitZip((prog) => setKitProgress(prog));
    } catch (err) {
      setKitError(
        err instanceof Error ? err.message : 'Unable to generate brand kit archive.'
      );
    } finally {
      setKitGenerating(false);
      setKitProgress(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#E8DCCB] text-[#2C2C2C] flex flex-col">
      {/* Strict 3-Zone Top Bar */}
      <header className="sticky top-0 z-30 bg-[#E8DCCB]/95 backdrop-blur-sm border-b border-[#2C2C2C]/15">
        <div className="max-w-[1360px] mx-auto px-5 sm:px-8 h-16 flex items-center justify-between gap-8">
          <a
            href="#variations"
            className="font-display text-lg sm:text-xl font-semibold tracking-tight text-[#2C2C2C] whitespace-nowrap shrink-0"
          >
            Orange Kite Studio
          </a>

          <nav
            aria-label="Primary sections"
            className="hidden md:flex items-center gap-7 text-sm font-medium text-[#2C2C2C]/75"
          >
            <a
              href="#variations"
              className="hover:text-[#2C2C2C] transition-colors whitespace-nowrap shrink-0"
            >
              Variations
            </a>
            <a
              href="#favicon"
              className="hover:text-[#2C2C2C] transition-colors whitespace-nowrap shrink-0"
            >
              Favicon Scale
            </a>
            <a
              href="#palette"
              className="hover:text-[#2C2C2C] transition-colors whitespace-nowrap shrink-0"
            >
              Color System
            </a>
            <a
              href="#brand-kit"
              className="hover:text-[#2C2C2C] transition-colors whitespace-nowrap shrink-0"
            >
              Brand Kit
            </a>
          </nav>

          <div className="relative shrink-0" ref={exportMenuRef}>
            <button
              type="button"
              onClick={() => setExportMenuOpen((o) => !o)}
              className="inline-flex items-center gap-2 min-h-[40px] px-4 py-2 text-xs font-semibold bg-[#2C2C2C] text-white hover:bg-[#1A1A1A] transition-colors whitespace-nowrap shrink-0"
              aria-expanded={exportMenuOpen}
            >
              <Download className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Export Brand Kit</span>
            </button>

            {exportMenuOpen && (
              <div className="absolute right-0 mt-2 w-68 bg-[#E8DCCB] border border-[#2C2C2C]/25 p-1.5 z-40">
                <button
                  type="button"
                  onClick={handleDownloadBrandKit}
                  disabled={kitGenerating}
                  className="w-full flex items-center justify-between px-3 py-2.5 text-xs font-semibold text-white bg-[#0F766E] hover:bg-[#0B5B55] transition-colors text-left mb-1"
                >
                  <span>
                    {kitGenerating ? 'Packaging ZIP…' : 'Complete Brand Kit'}
                  </span>
                  <span className="font-mono text-[11px] text-white/85">
                    .ZIP
                  </span>
                </button>
                <button
                  type="button"
                  onClick={handleExportFullPng}
                  disabled={exportingPng}
                  className="w-full flex items-center justify-between px-3 py-2.5 text-xs font-medium text-[#2C2C2C] hover:bg-[#2C2C2C]/8 transition-colors text-left"
                >
                  <span>{exportingPng ? 'Rendering PNG…' : 'Presentation PNG'}</span>
                  <span className="font-mono text-[11px] text-[#2C2C2C]/60 tabular-nums">
                    3200px
                  </span>
                </button>
                <button
                  type="button"
                  onClick={handleExportFullSvg}
                  className="w-full flex items-center justify-between px-3 py-2.5 text-xs font-medium text-[#2C2C2C] hover:bg-[#2C2C2C]/8 transition-colors text-left"
                >
                  <span>Vector Master SVG</span>
                  <span className="font-mono text-[11px] text-[#2C2C2C]/60">
                    Editable
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Editorial Masthead & Workspace Controls */}
        <section className="max-w-[1360px] mx-auto px-5 sm:px-8 pt-10 pb-8 border-b border-[#2C2C2C]/15">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#0F766E]">
                Brand Identity Sheet · Version 1.0 · Lahore, Pakistan
              </p>
              <h1 className="mt-2 font-display text-3xl sm:text-4xl lg:text-[42px] font-medium leading-[1.15] text-[#2C2C2C] text-balance">
                Sargodha Orange &amp; Basant Kite Geometric Mark
              </h1>
              <p className="mt-3 text-sm sm:text-base text-[#2C2C2C]/75 leading-relaxed">
                Creative intelligence for market leaders. Flat vector identity
                system pairing a refined circular orange pinch-ring with a 45°
                kite chevron across four canonical applications.
              </p>
            </div>

            {/* Interactive Sheet Controls */}
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              {/* Lockup Orientation Switch */}
              <div
                className="inline-flex items-center border border-[#2C2C2C]/20 p-1 bg-[#DDD0BD]/60"
                role="group"
                aria-label="Logo lockup orientation"
              >
                <button
                  type="button"
                  onClick={() => setLockupMode('horizontal')}
                  className={`min-h-[36px] px-3.5 py-1.5 text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
                    lockupMode === 'horizontal'
                      ? 'bg-[#2C2C2C] text-white'
                      : 'text-[#2C2C2C]/75 hover:text-[#2C2C2C]'
                  }`}
                >
                  Horizontal
                </button>
                <button
                  type="button"
                  onClick={() => setLockupMode('stacked')}
                  className={`min-h-[36px] px-3.5 py-1.5 text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
                    lockupMode === 'stacked'
                      ? 'bg-[#2C2C2C] text-white'
                      : 'text-[#2C2C2C]/75 hover:text-[#2C2C2C]'
                  }`}
                >
                  Stacked
                </button>
              </div>

              <button
                type="button"
                onClick={() => setShowGrid((prev) => !prev)}
                className={`inline-flex items-center gap-2 min-h-[44px] px-4 py-2 text-xs font-medium whitespace-nowrap shrink-0 border transition-colors ${
                  showGrid
                    ? 'bg-[#0F766E] text-white border-[#0F766E]'
                    : 'border-[#2C2C2C]/20 text-[#2C2C2C] hover:bg-[#2C2C2C]/5'
                }`}
                aria-pressed={showGrid}
              >
                <Grid className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Construction Grid</span>
              </button>

              <button
                type="button"
                onClick={() => setShowTagline((prev) => !prev)}
                className={`inline-flex items-center gap-2 min-h-[44px] px-4 py-2 text-xs font-medium whitespace-nowrap shrink-0 border transition-colors ${
                  showTagline
                    ? 'bg-[#E67E22] text-white border-[#E67E22]'
                    : 'border-[#2C2C2C]/20 text-[#2C2C2C] hover:bg-[#2C2C2C]/5'
                }`}
                aria-pressed={showTagline}
              >
                <Layers className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{showTagline ? 'Tagline On' : 'Tagline Off'}</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadBrandKit}
                disabled={kitGenerating}
                className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2 text-xs font-semibold whitespace-nowrap shrink-0 bg-[#0F766E] text-white border border-[#0F766E] hover:bg-[#0B5B55] disabled:opacity-70 transition-colors"
              >
                <FolderArchive className="w-3.5 h-3.5" aria-hidden="true" />
                <span>
                  {kitGenerating && kitProgress
                    ? `Packaging (${Math.round(
                        (kitProgress.completed / Math.max(1, kitProgress.total)) *
                          100
                      )}%)`
                    : 'Download Kit (.zip)'}
                </span>
              </button>
            </div>
          </div>
        </section>

        {/* Hero 2x2 Editorial Logo Presentation Sheet */}
        <section
          id="variations"
          aria-label="Four canonical logo variations"
          className="max-w-[1360px] mx-auto px-5 sm:px-8 py-8 sm:py-10"
        >
          <div className="border border-[#2C2C2C]/20 bg-[#E8DCCB] grid grid-cols-1 md:grid-cols-2">
            <QuadrantCard
              spec={QUADRANTS[0]}
              lockupMode={lockupMode}
              showGrid={showGrid}
              showTagline={showTagline}
              onInspect={setActiveSpec}
              borderClasses="border-b border-[#2C2C2C]/16 md:border-r"
            />
            <QuadrantCard
              spec={QUADRANTS[1]}
              lockupMode={lockupMode}
              showGrid={showGrid}
              showTagline={showTagline}
              onInspect={setActiveSpec}
              borderClasses="border-b border-[#2C2C2C]/16"
            />
            <QuadrantCard
              spec={QUADRANTS[2]}
              lockupMode={lockupMode}
              showGrid={showGrid}
              showTagline={showTagline}
              onInspect={setActiveSpec}
              borderClasses="border-b md:border-b-0 md:border-r border-[#2C2C2C]/16"
            />
            <QuadrantCard
              spec={QUADRANTS[3]}
              lockupMode={lockupMode}
              showGrid={showGrid}
              showTagline={showTagline}
              onInspect={setActiveSpec}
              borderClasses=""
            />
          </div>
        </section>

        {/* Favicon & Small-Scale Legibility Strip */}
        <section
          id="favicon"
          className="max-w-[1360px] mx-auto px-5 sm:px-8 py-10 border-t border-[#2C2C2C]/15"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-4">
              <p className="font-mono text-xs uppercase tracking-wider text-[#2C2C2C]/60">
                02 / Legibility Stress Test
              </p>
              <h2 className="mt-1.5 font-display text-2xl font-medium text-[#2C2C2C]">
                Favicon &amp; Micro-Scale Readiness
              </h2>
              <p className="mt-2 text-sm text-[#2C2C2C]/75 leading-relaxed">
                Equal 17-unit stroke parity between the circular Sargodha orange
                ring and the 45° Basant kite chevron preserves silhouette clarity
                down to 16px browser tabs.
              </p>
            </div>

            <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Browser Tab', size: 16, bg: '#FFFFFF', fg: 'color' },
                { label: 'Bookmark Icon', size: 32, bg: '#E8DCCB', fg: 'color' },
                { label: 'App Tile', size: 48, bg: '#0F766E', fg: 'white' },
                { label: 'Social Avatar', size: 64, bg: '#2C2C2C', fg: 'color' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="border border-[#2C2C2C]/15 p-5 flex flex-col justify-between gap-4 bg-[#E8DCCB]"
                >
                  <div className="flex items-center justify-between font-mono text-[11px] text-[#2C2C2C]/65 tabular-nums">
                    <span>{item.label}</span>
                    <span>{item.size}px</span>
                  </div>
                  <div className="h-20 flex items-center justify-center">
                    <div
                      style={{
                        width: Math.max(item.size + 12, 32),
                        height: Math.max(item.size + 12, 32),
                        backgroundColor: item.bg,
                      }}
                      className="flex items-center justify-center border border-[#2C2C2C]/15 p-1.5"
                    >
                      <svg
                        viewBox="0 0 144 100"
                        style={{ width: item.size, height: item.size }}
                      >
                        <g transform="translate(4.75, 0)">
                          <path
                            d={SYMBOL_PATHS.orangeO}
                            fill={item.fg === 'white' ? '#FFFFFF' : '#E67E22'}
                          />
                          <path
                            d={SYMBOL_PATHS.tealK}
                            fill={item.fg === 'white' ? '#FFFFFF' : '#0F766E'}
                          />
                        </g>
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Primary Colour System */}
        <section
          id="palette"
          className="max-w-[1360px] mx-auto px-5 sm:px-8 py-10 border-t border-[#2C2C2C]/15"
        >
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div>
              <p className="font-mono text-xs uppercase tracking-wider text-[#2C2C2C]/60">
                03 / Colour Architecture
              </p>
              <h2 className="mt-1.5 font-display text-2xl font-medium text-[#2C2C2C]">
                Approved Brand Palette
              </h2>
            </div>
            <p className="text-xs text-[#2C2C2C]/65">
              Click any swatch to copy its exact hex specification.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 border border-[#2C2C2C]/18">
            {BRAND_COLORS.map((swatch, idx) => {
              const isDarkSwatch =
                swatch.hex === '#0F766E' || swatch.hex === '#2C2C2C';
              return (
                <button
                  key={swatch.hex}
                  type="button"
                  onClick={() => handleCopyColor(swatch.hex)}
                  className={`text-left flex flex-col justify-between p-5 min-h-[190px] transition-opacity hover:opacity-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F766E] ${
                    idx < BRAND_COLORS.length - 1
                      ? 'border-b lg:border-b-0 lg:border-r border-[#2C2C2C]/18'
                      : ''
                  }`}
                  style={{
                    backgroundColor: swatch.hex,
                    color: isDarkSwatch ? '#FFFFFF' : '#2C2C2C',
                  }}
                >
                  <div className="flex items-start justify-between gap-2 w-full">
                    <span className="font-mono text-xs tabular-nums opacity-80">
                      {swatch.hex}
                    </span>
                    <span className="inline-flex items-center gap-1 font-mono text-[11px] opacity-80">
                      {copiedHex === swatch.hex ? (
                        <>
                          <Check className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" aria-hidden="true" />
                          <span className="tabular-nums">{swatch.share}</span>
                        </>
                      )}
                    </span>
                  </div>

                  <div>
                    <p className="text-sm font-semibold">{swatch.name}</p>
                    <p className="mt-1 text-xs opacity-75 leading-snug">
                      {swatch.role}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Geometric & Typographic Specifications */}
        <section
          id="specs"
          className="max-w-[1360px] mx-auto px-5 sm:px-8 py-10 border-t border-[#2C2C2C]/15"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <p className="font-mono text-xs uppercase tracking-wider text-[#2C2C2C]/60">
                04 / Geometry
              </p>
              <h3 className="mt-1.5 text-base font-semibold text-[#2C2C2C]">
                Precision &amp; Clear Space
              </h3>
              <dl className="mt-4 divide-y divide-[#2C2C2C]/12 border-t border-b border-[#2C2C2C]/12 text-xs">
                <div className="py-2.5 flex justify-between gap-4">
                  <dt className="text-[#2C2C2C]/70">Stroke Ratio</dt>
                  <dd className="font-mono tabular-nums">1:1 (17 units)</dd>
                </div>
                <div className="py-2.5 flex justify-between gap-4">
                  <dt className="text-[#2C2C2C]/70">Kite Chevron Angle</dt>
                  <dd className="font-mono tabular-nums">45.0° Diagonal</dd>
                </div>
                <div className="py-2.5 flex justify-between gap-4">
                  <dt className="text-[#2C2C2C]/70">Central Separation</dt>
                  <dd className="font-mono tabular-nums">4.5 units</dd>
                </div>
                <div className="py-2.5 flex justify-between gap-4">
                  <dt className="text-[#2C2C2C]/70">Minimum Clear Space</dt>
                  <dd className="font-mono tabular-nums">1x stroke height</dd>
                </div>
              </dl>
            </div>

            <div>
              <p className="font-mono text-xs uppercase tracking-wider text-[#2C2C2C]/60">
                05 / Wordmark System
              </p>
              <h3 className="mt-1.5 text-base font-semibold text-[#2C2C2C]">
                Uppercase Typographic Lockup
              </h3>
              <dl className="mt-4 divide-y divide-[#2C2C2C]/12 border-t border-b border-[#2C2C2C]/12 text-xs">
                <div className="py-2.5 flex justify-between gap-4">
                  <dt className="text-[#2C2C2C]/70">Primary Wordmark</dt>
                  <dd className="font-mono">ORANGE KITE (700)</dd>
                </div>
                <div className="py-2.5 flex justify-between gap-4">
                  <dt className="text-[#2C2C2C]/70">Descriptor</dt>
                  <dd className="font-mono">STUDIO (500)</dd>
                </div>
                <div className="py-2.5 flex justify-between gap-4">
                  <dt className="text-[#2C2C2C]/70">Display Serif</dt>
                  <dd className="font-mono">Playfair Display</dd>
                </div>
                <div className="py-2.5 flex justify-between gap-4">
                  <dt className="text-[#2C2C2C]/70">Supporting Sans</dt>
                  <dd className="font-mono">Plus Jakarta Sans</dd>
                </div>
              </dl>
            </div>

            <div>
              <p className="font-mono text-xs uppercase tracking-wider text-[#2C2C2C]/60">
                06 / Guardrails
              </p>
              <h3 className="mt-1.5 text-base font-semibold text-[#2C2C2C]">
                Flat Vector Discipline
              </h3>
              <ul className="mt-4 space-y-2.5 text-xs text-[#2C2C2C]/75 leading-relaxed">
                <li>
                  No drop shadows, bevels, 3D extrusions, or multi-stop gradients
                  across any logo lockup.
                </li>
                <li>
                  Always preserve the 4.5-unit gap between the Sargodha orange
                  pinch vertex and Deep Teal kite apex.
                </li>
                <li>
                  Never pair the full-color mark over unapproved saturated
                  backgrounds; switch to the pure white reversed lockup.
                </li>
              </ul>
            </div>
          </div>
        </section>

        <BrandKitSection
          isGenerating={kitGenerating}
          progress={kitProgress}
          error={kitError}
          onDownloadKit={handleDownloadBrandKit}
        />
      </main>

      <footer className="border-t border-[#2C2C2C]/15 py-6">
        <div className="max-w-[1360px] mx-auto px-5 sm:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#2C2C2C]/60">
          <span>Orange Kite Studio · Creative intelligence for market leaders</span>
          <span>Rise with intention. Lead with impact.</span>
        </div>
      </footer>

      <InspectorModal
        spec={activeSpec}
        lockupMode={lockupMode}
        showTagline={showTagline}
        onClose={() => setActiveSpec(null)}
      />
    </div>
  );
}
