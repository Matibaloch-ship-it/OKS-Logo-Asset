import React, { useEffect, useState } from 'react';
import { Check, Copy, Download, Grid, X } from 'lucide-react';
import {
  buildStandaloneSvgString,
  LockupMode,
  QuadrantSpec,
  triggerPngDownload,
  triggerSvgDownload,
} from '../brand/logoSpec';
import { BrandMark } from './BrandMark';

interface InspectorModalProps {
  spec: QuadrantSpec | null;
  lockupMode: LockupMode;
  showTagline: boolean;
  onClose: () => void;
}

export const InspectorModal: React.FC<InspectorModalProps> = ({
  spec,
  lockupMode,
  showTagline,
  onClose,
}) => {
  const [modalGrid, setModalGrid] = useState(true);
  const [transparentExport, setTransparentExport] = useState(false);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  useEffect(() => {
    if (!spec) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [spec, onClose]);

  if (!spec) return null;

  const isInverted = spec.id === 'inverted';
  const isIcon = spec.id === 'icon';

  const handleCopyHex = async (hex: string) => {
    try {
      await navigator.clipboard.writeText(hex);
      setCopiedHex(hex);
      setTimeout(() => setCopiedHex(null), 1600);
    } catch {
      // Clipboard blocked in restricted context
    }
  };

  const handleSvg = () => {
    const svg = buildStandaloneSvgString(
      spec.id,
      lockupMode,
      showTagline,
      !transparentExport
    );
    const suffix = isIcon ? 'icon' : lockupMode;
    triggerSvgDownload(svg, `orange-kite-studio-${spec.id}-${suffix}.svg`);
  };

  const handlePng = async () => {
    const svg = buildStandaloneSvgString(
      spec.id,
      lockupMode,
      showTagline,
      !transparentExport
    );
    const suffix = isIcon ? 'icon' : lockupMode;
    await triggerPngDownload(
      svg,
      `orange-kite-studio-${spec.id}-${suffix}.png`,
      isIcon ? 1024 : 2048
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#2C2C2C]/70 p-4 sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="inspector-title"
    >
      <div
        className="w-full max-w-4xl bg-[#E8DCCB] text-[#2C2C2C] border border-[#2C2C2C]/25 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-[#2C2C2C]/15">
          <div className="min-w-0">
            <span className="font-mono text-xs uppercase tracking-wider text-[#2C2C2C]/65 tabular-nums">
              {spec.index} / Specimen Inspector
            </span>
            <h2
              id="inspector-title"
              className="text-lg sm:text-xl font-semibold text-[#2C2C2C] truncate"
            >
              {spec.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center w-10 h-10 border border-[#2C2C2C]/20 text-[#2C2C2C] hover:bg-[#2C2C2C]/5 transition-colors"
            aria-label="Close specimen inspector"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        {/* High-Resolution Stage */}
        <div
          style={{ backgroundColor: spec.backgroundHex }}
          className="relative flex items-center justify-center px-8 py-14 sm:py-16 border-b border-[#2C2C2C]/15"
        >
          <div
            className={`w-full flex items-center justify-center ${
              isIcon
                ? 'max-w-[220px]'
                : lockupMode === 'stacked'
                ? 'max-w-[340px]'
                : 'max-w-[540px]'
            }`}
          >
            <BrandMark
              variant={spec.id}
              lockupMode={lockupMode}
              showGrid={modalGrid}
              showTagline={showTagline}
              className="w-full h-auto"
            />
          </div>
        </div>

        {/* Inspector Specification & Export Controls */}
        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          <div className="md:col-span-7 space-y-4">
            <p className="text-sm leading-relaxed text-[#2C2C2C]/85">
              {spec.description}
            </p>
            <p className="text-xs leading-relaxed text-[#2C2C2C]/65">
              <strong className="font-semibold text-[#2C2C2C]">Usage rule:</strong>{' '}
              {spec.usageRule}
            </p>

            {/* Swatches */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              {[...spec.foregroundColors, spec.backgroundHex].map((hex) => (
                <button
                  key={hex}
                  type="button"
                  onClick={() => handleCopyHex(hex)}
                  className="inline-flex items-center gap-2 min-h-[40px] px-3 py-1.5 border border-[#2C2C2C]/20 bg-[#E8DCCB] hover:bg-[#DDD0BD] font-mono text-xs tabular-nums transition-colors"
                >
                  <span
                    className="w-3.5 h-3.5 border border-black/15 shrink-0"
                    style={{ backgroundColor: hex }}
                    aria-hidden="true"
                  />
                  <span>{hex}</span>
                  {copiedHex === hex ? (
                    <Check className="w-3.5 h-3.5 text-[#0F766E]" aria-hidden="true" />
                  ) : (
                    <Copy className="w-3 h-3 text-[#2C2C2C]/50" aria-hidden="true" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="md:col-span-5 flex flex-col gap-3 md:border-l md:border-[#2C2C2C]/15 md:pl-6">
            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setModalGrid((g) => !g)}
                className={`flex-1 inline-flex items-center justify-center gap-2 min-h-[40px] px-3 py-2 text-xs font-medium border transition-colors ${
                  modalGrid
                    ? 'bg-[#2C2C2C] text-white border-[#2C2C2C]'
                    : 'border-[#2C2C2C]/20 text-[#2C2C2C] hover:bg-[#2C2C2C]/5'
                }`}
              >
                <Grid className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{modalGrid ? 'Grid Visible' : 'Show Grid'}</span>
              </button>

              {!isInverted && (
                <button
                  type="button"
                  onClick={() => setTransparentExport((t) => !t)}
                  className={`flex-1 inline-flex items-center justify-center min-h-[40px] px-3 py-2 text-xs font-medium border transition-colors ${
                    transparentExport
                      ? 'bg-[#0F766E] text-white border-[#0F766E]'
                      : 'border-[#2C2C2C]/20 text-[#2C2C2C] hover:bg-[#2C2C2C]/5'
                  }`}
                >
                  {transparentExport ? 'Transparent BG' : 'Sheet BG'}
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={handleSvg}
                className="inline-flex items-center justify-center gap-2 min-h-[44px] px-4 py-2 text-xs font-semibold border border-[#2C2C2C] text-[#2C2C2C] hover:bg-[#2C2C2C]/5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Download SVG</span>
              </button>
              <button
                type="button"
                onClick={handlePng}
                className="inline-flex items-center justify-center gap-2 min-h-[44px] px-4 py-2 text-xs font-semibold bg-[#E67E22] text-white border border-[#E67E22] hover:bg-[#D36D15] transition-colors"
              >
                <Download className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Download PNG</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
