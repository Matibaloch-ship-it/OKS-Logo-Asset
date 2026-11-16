import React from 'react';
import { Download, Maximize2 } from 'lucide-react';
import {
  buildStandaloneSvgString,
  LockupMode,
  QuadrantSpec,
  SYMBOL_PATHS,
  triggerPngDownload,
  triggerSvgDownload,
} from '../brand/logoSpec';
import { BrandMark } from './BrandMark';

interface QuadrantCardProps {
  spec: QuadrantSpec;
  lockupMode: LockupMode;
  showGrid: boolean;
  showTagline: boolean;
  onInspect: (spec: QuadrantSpec) => void;
  borderClasses: string;
}

export const QuadrantCard: React.FC<QuadrantCardProps> = ({
  spec,
  lockupMode,
  showGrid,
  showTagline,
  onInspect,
  borderClasses,
}) => {
  const isInverted = spec.id === 'inverted';
  const isIcon = spec.id === 'icon';

  const handleDownloadSvg = (e: React.MouseEvent) => {
    e.stopPropagation();
    const svg = buildStandaloneSvgString(spec.id, lockupMode, showTagline, true);
    const suffix = isIcon ? 'icon' : lockupMode;
    triggerSvgDownload(svg, `orange-kite-studio-${spec.id}-${suffix}.svg`);
  };

  const handleDownloadPng = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const svg = buildStandaloneSvgString(spec.id, lockupMode, showTagline, true);
    const suffix = isIcon ? 'icon' : lockupMode;
    await triggerPngDownload(
      svg,
      `orange-kite-studio-${spec.id}-${suffix}.png`,
      isIcon ? 1024 : 2048
    );
  };

  return (
    <article
      style={{ backgroundColor: spec.backgroundHex }}
      className={`group relative flex flex-col justify-between p-7 sm:p-10 min-h-[340px] lg:min-h-[410px] transition-colors duration-150 ${borderClasses}`}
    >
      {/* Top Specimen Index & Inspect Trigger */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div
            className={`font-mono text-xs tracking-wider uppercase tabular-nums ${
              isInverted ? 'text-white/75' : 'text-[#2C2C2C]/65'
            }`}
          >
            <span>{spec.index}</span>
            <span className="mx-2" aria-hidden="true">
              /
            </span>
            <span>{spec.title}</span>
          </div>
          <p
            className={`mt-1 text-xs ${
              isInverted ? 'text-[#E8DCCB]/80' : 'text-[#2C2C2C]/55'
            }`}
          >
            {spec.subtitle}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onInspect(spec)}
          className={`inline-flex items-center gap-1.5 min-h-[40px] px-3 py-2 text-xs font-medium whitespace-nowrap shrink-0 border transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 ${
            isInverted
              ? 'border-white/25 text-white hover:bg-white/10 focus-visible:outline-white'
              : 'border-[#2C2C2C]/20 text-[#2C2C2C] hover:bg-[#2C2C2C]/5 focus-visible:outline-[#0F766E]'
          }`}
          aria-label={`Inspect ${spec.title}`}
        >
          <Maximize2 className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Inspect</span>
        </button>
      </div>

      {/* Central Vector Artwork Stage */}
      <div
        onClick={() => onInspect(spec)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onInspect(spec);
          }
        }}
        className="my-auto py-6 flex flex-col items-center justify-center cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0F766E]"
        aria-label={`Open ${spec.title} details`}
      >
        <div
          className={`w-full flex items-center justify-center transition-transform duration-150 group-hover:scale-[1.015] ${
            isIcon
              ? 'max-w-[168px]'
              : lockupMode === 'stacked'
              ? 'max-w-[300px]'
              : 'max-w-[440px]'
          }`}
        >
          <BrandMark
            variant={spec.id}
            lockupMode={lockupMode}
            showGrid={showGrid}
            showTagline={showTagline}
            className="w-full h-auto"
          />
        </div>

        {isIcon && (
          <div className="mt-5 flex items-center gap-5 pt-4 border-t border-[#2C2C2C]/10">
            <span className="font-mono text-[11px] uppercase tracking-wider text-[#2C2C2C]/55">
              Scale check
            </span>
            {[40, 24, 16].map((size) => (
              <div key={size} className="flex items-center gap-1.5">
                <div
                  style={{ width: size, height: size }}
                  className="flex items-center justify-center bg-white border border-[#2C2C2C]/12 p-[2px]"
                  title={`${size}×${size}px favicon preview`}
                >
                  <svg viewBox="0 0 144 100" className="w-full h-full">
                    <g transform="translate(4.75, 0)">
                      <path d={SYMBOL_PATHS.orangeO} fill="#E67E22" />
                      <path d={SYMBOL_PATHS.tealK} fill="#0F766E" />
                    </g>
                  </svg>
                </div>
                <span className="font-mono text-[11px] text-[#2C2C2C]/60 tabular-nums">
                  {size}px
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Metadata & Direct Asset Export Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-current/10">
        <div className="flex items-center gap-3">
          {spec.foregroundColors.map((hex) => (
            <span
              key={hex}
              className={`inline-flex items-center gap-1.5 font-mono text-[11px] tabular-nums ${
                isInverted ? 'text-white/85' : 'text-[#2C2C2C]/75'
              }`}
            >
              <span
                className="inline-block w-2.5 h-2.5 border border-black/15"
                style={{ backgroundColor: hex }}
                aria-hidden="true"
              />
              {hex}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleDownloadSvg}
            className={`inline-flex items-center gap-1.5 min-h-[40px] px-3 py-1.5 font-mono text-xs whitespace-nowrap shrink-0 border transition-colors duration-150 ${
              isInverted
                ? 'border-white/25 text-white hover:bg-white/10'
                : 'border-[#2C2C2C]/20 text-[#2C2C2C] hover:bg-[#2C2C2C]/5'
            }`}
          >
            <Download className="w-3.5 h-3.5" aria-hidden="true" />
            <span>SVG</span>
          </button>
          <button
            type="button"
            onClick={handleDownloadPng}
            className={`inline-flex items-center gap-1.5 min-h-[40px] px-3 py-1.5 font-mono text-xs whitespace-nowrap shrink-0 border transition-colors duration-150 ${
              isInverted
                ? 'bg-white text-[#0F766E] border-white hover:bg-[#E8DCCB]'
                : 'bg-[#2C2C2C] text-white border-[#2C2C2C] hover:bg-[#1A1A1A]'
            }`}
          >
            <Download className="w-3.5 h-3.5" aria-hidden="true" />
            <span>PNG</span>
          </button>
        </div>
      </div>
    </article>
  );
};
