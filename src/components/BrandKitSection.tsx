import React from 'react';
import { FolderArchive } from 'lucide-react';
import { BrandKitProgress } from '../brand/brandKitExporter';

interface BrandKitSectionProps {
  isGenerating: boolean;
  progress: BrandKitProgress | null;
  error: string | null;
  onDownloadKit: () => void;
}

const KIT_FOLDERS = [
  {
    index: '01',
    folder: '01-Presentation-Sheet/',
    summary: 'Complete 2×2 editorial sheets (Horizontal & Stacked lockups)',
    formats: 'SVG · 3200px PNG',
  },
  {
    index: '02',
    folder: '02-Logos/01-Primary-Full-Color/',
    summary: 'Full-color Orange & Deep Teal lockups with & without tagline',
    formats: 'SVG · PNG (1024, 2048, 4096px) · WebP',
  },
  {
    index: '03',
    folder: '02-Logos/02-Standalone-Icon/',
    summary: 'Favicon & square emblem pack + webmanifest (16px to 1024px)',
    formats: 'SVG · PNG (16–1024px) · Manifest',
  },
  {
    index: '04',
    folder: '02-Logos/03-Monochrome-Charcoal/',
    summary: 'Solid Charcoal #2C2C2C single-ink print & stamping lockups',
    formats: 'SVG · PNG (1024, 2048, 4096px) · WebP',
  },
  {
    index: '05',
    folder: '02-Logos/04-Inverted-White/',
    summary: 'Pure White #FFFFFF reversed lockups on Deep Teal & transparent',
    formats: 'SVG · PNG (1024, 2048, 4096px) · WebP',
  },
  {
    index: '06',
    folder: '03-Color-Palette/ & 04-Specs/',
    summary: 'Design tokens, swatch board, font rules & geometry specs',
    formats: 'JSON · CSS · SCSS · SVG · 2400px PNG',
  },
];

export const BrandKitSection: React.FC<BrandKitSectionProps> = ({
  isGenerating,
  progress,
  error,
  onDownloadKit,
}) => {
  const pct =
    progress && progress.total > 0
      ? Math.round((progress.completed / progress.total) * 100)
      : 0;

  return (
    <section
      id="brand-kit"
      className="max-w-[1360px] mx-auto px-5 sm:px-8 py-12 border-t border-[#2C2C2C]/15"
    >
      <div className="border border-[#2C2C2C]/20 bg-[#DDD0BD]/45 p-6 sm:p-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-[#2C2C2C]/15">
          <div className="max-w-2xl">
            <p className="font-mono text-xs uppercase tracking-wider text-[#0F766E]">
              07 / Complete Asset Archive
            </p>
            <h2 className="mt-1.5 font-display text-2xl sm:text-3xl font-medium text-[#2C2C2C]">
              Downloadable Brand Kit Folder
            </h2>
            <p className="mt-2 text-sm text-[#2C2C2C]/75 leading-relaxed">
              Packages every logo variation, lockup orientation, transparent and
              sheet background, favicon icon size (16px–1024px), print-ready PNG
              (up to 4096px), WebP, vector SVG, and color/typography token files
              into a single structured ZIP archive.
            </p>
          </div>

          <div className="shrink-0 flex flex-col items-start lg:items-end gap-2">
            <button
              type="button"
              onClick={onDownloadKit}
              disabled={isGenerating}
              className="inline-flex items-center gap-2.5 min-h-[48px] px-6 py-3 text-sm font-semibold bg-[#0F766E] text-white hover:bg-[#0B5B55] disabled:opacity-70 transition-colors whitespace-nowrap shrink-0"
            >
              <FolderArchive className="w-4 h-4" aria-hidden="true" />
              <span>
                {isGenerating
                  ? `Packaging Assets (${pct}%)…`
                  : 'Download Brand Kit (.zip)'}
              </span>
            </button>
            <span className="font-mono text-[11px] text-[#2C2C2C]/65 tabular-nums">
              Orange-Kite-Studio-Brand-Kit.zip · 70+ curated assets
            </span>
          </div>
        </div>

        {isGenerating && progress && (
          <div className="mt-6 border border-[#0F766E]/30 bg-[#E8DCCB] p-4">
            <div className="flex items-center justify-between text-xs font-mono text-[#2C2C2C] tabular-nums mb-2">
              <span className="truncate pr-4">{progress.label}</span>
              <span>
                {progress.completed} / {progress.total}
              </span>
            </div>
            <div className="w-full h-1.5 bg-[#2C2C2C]/10 overflow-hidden">
              <div
                className="h-full bg-[#0F766E] transition-all duration-150"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        )}

        {error && (
          <div className="mt-6 border border-[#E67E22] bg-[#E8DCCB] p-4 text-xs text-[#2C2C2C]">
            <strong className="font-semibold">Export failed:</strong> {error}
          </div>
        )}

        {/* Structured Folder Manifest */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
          {KIT_FOLDERS.map((item) => (
            <div
              key={item.index}
              className="border-t border-[#2C2C2C]/15 pt-4 flex flex-col justify-between gap-2"
            >
              <div>
                <div className="font-mono text-xs text-[#2C2C2C] font-medium break-all">
                  <span className="text-[#0F766E] mr-2 tabular-nums">
                    {item.index}
                  </span>
                  {item.folder}
                </div>
                <p className="mt-1.5 text-xs text-[#2C2C2C]/75 leading-relaxed">
                  {item.summary}
                </p>
              </div>
              <p className="font-mono text-[11px] text-[#2C2C2C]/55">
                {item.formats}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
