import React from 'react';
import {
  getQuadrantPalette,
  LockupMode,
  QuadrantId,
  SYMBOL_PATHS,
} from '../brand/logoSpec';

interface BrandMarkProps {
  variant: QuadrantId;
  lockupMode: LockupMode;
  showGrid?: boolean;
  showTagline?: boolean;
  className?: string;
}

export const BrandMark: React.FC<BrandMarkProps> = ({
  variant,
  lockupMode,
  showGrid = false,
  showTagline = true,
  className = '',
}) => {
  const colors = getQuadrantPalette(variant);
  const gridStroke =
    variant === 'inverted' ? 'rgba(255, 255, 255, 0.28)' : 'rgba(44, 44, 44, 0.24)';
  const accentGridStroke =
    variant === 'inverted' ? 'rgba(255, 255, 255, 0.55)' : 'rgba(230, 126, 34, 0.65)';
  const gridLabelFill =
    variant === 'inverted' ? 'rgba(255, 255, 255, 0.72)' : 'rgba(44, 44, 44, 0.68)';

  if (variant === 'icon') {
    return (
      <svg
        viewBox="0 0 180 180"
        className={className}
        role="img"
        aria-label="Orange Kite Studio standalone orange-kite icon mark"
      >
        {showGrid && (
          <g>
            {/* 1x Clear space boundary (x = 17 units) */}
            <rect
              x="5.75"
              y="33"
              width="168.5"
              height="114"
              fill="none"
              stroke={gridStroke}
              strokeWidth="0.75"
              strokeDasharray="3 3"
            />
            {/* Favicon 1:1 bounding square */}
            <rect
              x="16"
              y="16"
              width="148"
              height="148"
              fill="none"
              stroke={gridStroke}
              strokeWidth="0.75"
            />
            {/* Horizontal centerline & 45-degree Basant kite tangents */}
            <line
              x1="12"
              y1="90"
              x2="168"
              y2="90"
              stroke={gridStroke}
              strokeWidth="0.6"
            />
            <line
              x1="93.25"
              y1="90"
              x2="148.25"
              y2="35"
              stroke={accentGridStroke}
              strokeWidth="0.75"
              strokeDasharray="2.5 2.5"
            />
            <line
              x1="93.25"
              y1="90"
              x2="148.25"
              y2="145"
              stroke={accentGridStroke}
              strokeWidth="0.75"
              strokeDasharray="2.5 2.5"
            />
            {/* Sargodha Orange radial axis */}
            <circle
              cx="62.75"
              cy="90"
              r="40"
              fill="none"
              stroke={accentGridStroke}
              strokeWidth="0.7"
              strokeDasharray="2 2"
            />
            <circle
              cx="62.75"
              cy="90"
              r="23"
              fill="none"
              stroke={gridStroke}
              strokeWidth="0.6"
            />
            <text
              x="16"
              y="12"
              fontFamily="'JetBrains Mono', monospace"
              fontSize="6.5"
              fill={gridLabelFill}
            >
              1:1 FAVICON · R=40 · 45° KITE AXIS
            </text>
          </g>
        )}
        <g transform="translate(22.75, 40)">
          <path d={SYMBOL_PATHS.orangeO} fill={colors.orangePart} />
          <path d={SYMBOL_PATHS.tealK} fill={colors.tealPart} />
        </g>
      </svg>
    );
  }

  if (lockupMode === 'stacked') {
    const vbHeight = showTagline ? 256 : 226;
    return (
      <svg
        viewBox={`0 0 400 ${vbHeight}`}
        className={className}
        role="img"
        aria-label={`Orange Kite Studio ${variant} stacked logo`}
      >
        {showGrid && (
          <g>
            {/* Outer clear-space frame */}
            <rect
              x="28"
              y="12"
              width="344"
              height={vbHeight - 24}
              fill="none"
              stroke={gridStroke}
              strokeWidth="0.8"
              strokeDasharray="3 3"
            />
            {/* Vertical symmetry axis */}
            <line
              x1="200"
              y1="12"
              x2="200"
              y2={vbHeight - 12}
              stroke={gridStroke}
              strokeWidth="0.6"
            />
            {/* Basant kite 45deg alignment guides */}
            <line
              x1="203"
              y1="76"
              x2="268"
              y2="11"
              stroke={accentGridStroke}
              strokeWidth="0.75"
              strokeDasharray="2.5 2.5"
            />
            <line
              x1="203"
              y1="76"
              x2="268"
              y2="141"
              stroke={accentGridStroke}
              strokeWidth="0.75"
              strokeDasharray="2.5 2.5"
            />
            <circle
              cx="172.75"
              cy="76"
              r="40"
              fill="none"
              stroke={accentGridStroke}
              strokeWidth="0.75"
              strokeDasharray="2 2"
            />
            <text
              x="32"
              y="22"
              fontFamily="'JetBrains Mono', monospace"
              fontSize="7"
              fill={gridLabelFill}
            >
              CLEAR SPACE 1X · STACKED LOCKUP
            </text>
          </g>
        )}
        <g transform="translate(132.75, 26)">
          <path d={SYMBOL_PATHS.orangeO} fill={colors.orangePart} />
          <path d={SYMBOL_PATHS.tealK} fill={colors.tealPart} />
        </g>
        <text
          x="200"
          y="156"
          textAnchor="middle"
          fontFamily="'Plus Jakarta Sans', sans-serif"
          fontSize="25"
          fontWeight="700"
          letterSpacing="5.5"
          fill={colors.titleText}
        >
          ORANGE KITE
        </text>
        <text
          x="200"
          y="186"
          textAnchor="middle"
          fontFamily="'Plus Jakarta Sans', sans-serif"
          fontSize="15.5"
          fontWeight="500"
          letterSpacing="8.5"
          fill={colors.studioText}
        >
          STUDIO
        </text>
        {showTagline && (
          <text
            x="200"
            y="218"
            textAnchor="middle"
            fontFamily="'Plus Jakarta Sans', sans-serif"
            fontSize="8.5"
            fontWeight="500"
            letterSpacing="3.2"
            fill={colors.taglineText}
          >
            RISE WITH INTENTION. LEAD WITH IMPACT.
          </text>
        )}
      </svg>
    );
  }

  // Horizontal lockup
  const titleY = showTagline ? 64 : 74;
  const studioY = showTagline ? 90 : 102;

  return (
    <svg
      viewBox="0 0 520 160"
      className={className}
      role="img"
      aria-label={`Orange Kite Studio ${variant} horizontal logo`}
    >
      {showGrid && (
        <g>
          {/* Clear space outer margin (1x = 17 units) */}
          <rect
            x="19"
            y="19"
            width="482"
            height="122"
            fill="none"
            stroke={gridStroke}
            strokeWidth="0.85"
            strokeDasharray="3 3"
          />
          {/* Symbol-to-wordmark 2x optical separation */}
          <line
            x1="170.5"
            y1="19"
            x2="170.5"
            y2="141"
            stroke={gridStroke}
            strokeWidth="0.7"
          />
          <line
            x1="208"
            y1="19"
            x2="208"
            y2="141"
            stroke={gridStroke}
            strokeWidth="0.7"
          />
          {/* Horizontal axis & baseline */}
          <line
            x1="19"
            y1="80"
            x2="501"
            y2="80"
            stroke={gridStroke}
            strokeWidth="0.6"
          />
          {/* Radial orange + 45deg kite guides */}
          <circle
            cx="76"
            cy="80"
            r="40"
            fill="none"
            stroke={accentGridStroke}
            strokeWidth="0.75"
            strokeDasharray="2 2"
          />
          <line
            x1="106.5"
            y1="80"
            x2="156.5"
            y2="30"
            stroke={accentGridStroke}
            strokeWidth="0.75"
            strokeDasharray="2.5 2.5"
          />
          <line
            x1="106.5"
            y1="80"
            x2="156.5"
            y2="130"
            stroke={accentGridStroke}
            strokeWidth="0.75"
            strokeDasharray="2.5 2.5"
          />
          <text
            x="24"
            y="14"
            fontFamily="'JetBrains Mono', monospace"
            fontSize="7"
            fill={gridLabelFill}
          >
            1X MARGIN · 2X GAP · 45° KITE GEOMETRY
          </text>
        </g>
      )}
      <g transform="translate(36, 30)">
        <path d={SYMBOL_PATHS.orangeO} fill={colors.orangePart} />
        <path d={SYMBOL_PATHS.tealK} fill={colors.tealPart} />
      </g>
      <text
        x="208"
        y={titleY}
        fontFamily="'Plus Jakarta Sans', sans-serif"
        fontSize="26"
        fontWeight="700"
        letterSpacing="5.2"
        fill={colors.titleText}
      >
        ORANGE KITE
      </text>
      <text
        x="209"
        y={studioY}
        fontFamily="'Plus Jakarta Sans', sans-serif"
        fontSize="16"
        fontWeight="500"
        letterSpacing="8.8"
        fill={colors.studioText}
      >
        STUDIO
      </text>
      {showTagline && (
        <text
          x="208"
          y="114"
          fontFamily="'Plus Jakarta Sans', sans-serif"
          fontSize="8.5"
          fontWeight="500"
          letterSpacing="2.8"
          fill={colors.taglineText}
        >
          RISE WITH INTENTION. LEAD WITH IMPACT.
        </text>
      )}
    </svg>
  );
};
