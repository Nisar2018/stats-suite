function niceMax(value) {
  if (value <= 0) return 1;
  const exp = Math.floor(Math.log10(value));
  const base = 10 ** exp;
  const scaled = value / base;
  if (scaled <= 1) return base;
  if (scaled <= 2) return 2 * base;
  if (scaled <= 5) return 5 * base;
  return 10 * base;
}

function formatTick(n) {
  if (!Number.isFinite(n)) return '';
  return Number.isInteger(n) ? String(n) : String(parseFloat(n.toFixed(3)));
}

/**
 * Polygon / ogive chart — points plotted by numeric x and y, connected by lines.
 * points: [{ x, y, label? }]
 */
export function PolygonChart({
  title,
  points,
  xLabel = 'Upper class boundary',
  yLabel = 'Cumulative relative frequency',
  yMaxHint = 1,
  closed = false,
  step = false,
  markers = null,
}) {
  if (!points?.length) return null;

  const width = 680;
  const height = 360;
  const padding = { top: 40, right: 28, bottom: 72, left: 64 };
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;

  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const xMin = Math.min(0, ...xs);
  const xMax = Math.max(...xs);
  const yMin = 0;
  const yMax = niceMax(Math.max(yMaxHint, ...ys));
  const xRange = xMax - xMin || 1;
  const yRange = yMax - yMin || 1;

  const scaleX = (v) => padding.left + ((v - xMin) / xRange) * innerW;
  const scaleY = (v) => padding.top + innerH - ((v - yMin) / yRange) * innerH;

  const pathD =
    points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${scaleX(p.x)} ${scaleY(p.y)}`).join(' ') +
    (closed ? ' Z' : '');

  const yTicks = Array.from({ length: 6 }, (_, i) => (yMax * i) / 5);
  const markerList = markers ?? (step ? [] : points);
  const xTicks = [
    ...new Set([
      xMin,
      ...(markers?.map((m) => m.x) ?? points.map((p) => p.x)),
      xMax,
    ]),
  ].sort((a, b) => a - b);

  const caption = closed
    ? `Closed geometric shape joining ${xLabel.toLowerCase()} vs ${yLabel.toLowerCase()}`
    : step
      ? `Step polygon of ${xLabel.toLowerCase()} vs ${yLabel.toLowerCase()}`
      : `Polygon joining points of ${xLabel.toLowerCase()} vs ${yLabel.toLowerCase()}`;

  return (
    <div className="rounded-lg border border-academic-200 bg-white p-4">
      {title && <p className="mb-2 text-center text-sm font-semibold text-blue-900">{title}</p>}
      <p className="mb-2 text-center text-xs text-academic-500">{caption}</p>
      <svg viewBox={`0 0 ${width} ${height}`} className="mx-auto w-full max-w-full">
        {yTicks.map((tick) => {
          const y = scaleY(tick);
          return (
            <g key={`yt-${tick}`}>
              <line
                x1={padding.left}
                y1={y}
                x2={padding.left + innerW}
                y2={y}
                stroke="#e2e8f0"
                strokeWidth="1"
              />
              <text x={padding.left - 8} y={y + 4} textAnchor="end" fontSize="10" fill="#475569">
                {formatTick(tick)}
              </text>
            </g>
          );
        })}

        <line
          x1={padding.left}
          y1={padding.top}
          x2={padding.left}
          y2={padding.top + innerH}
          stroke="#334155"
          strokeWidth="1.5"
        />
        <line
          x1={padding.left}
          y1={padding.top + innerH}
          x2={padding.left + innerW}
          y2={padding.top + innerH}
          stroke="#334155"
          strokeWidth="1.5"
        />

        <text
          x={16}
          y={padding.top + innerH / 2}
          textAnchor="middle"
          fontSize="11"
          fontWeight="600"
          fill="#1e3a8a"
          transform={`rotate(-90, 16, ${padding.top + innerH / 2})`}
        >
          {yLabel}
        </text>
        <text
          x={padding.left + innerW / 2}
          y={height - 12}
          textAnchor="middle"
          fontSize="11"
          fontWeight="600"
          fill="#1e3a8a"
        >
          {xLabel}
        </text>

        <path
          d={pathD}
          fill={closed ? 'rgba(37, 99, 235, 0.12)' : 'none'}
          stroke="#1d4ed8"
          strokeWidth="2.5"
          strokeLinejoin="round"
          strokeLinecap={step ? 'square' : 'round'}
        />

        {markerList.map((p, i) => (
          <g key={`pt-${p.x}-${p.y}-${i}`}>
            <circle cx={scaleX(p.x)} cy={scaleY(p.y)} r="4.5" fill="#1d4ed8" stroke="#fff" strokeWidth="1.5" />
            <text
              x={scaleX(p.x)}
              y={scaleY(p.y) - 10}
              textAnchor="middle"
              fontSize="9"
              fontWeight="600"
              fill="#1e3a8a"
            >
              {formatTick(p.y)}
            </text>
          </g>
        ))}

        {xTicks.map((b) => (
          <g key={`xt-${b}`}>
            <line
              x1={scaleX(b)}
              y1={padding.top + innerH}
              x2={scaleX(b)}
              y2={padding.top + innerH + 5}
              stroke="#334155"
              strokeWidth="1"
            />
            <text
              x={scaleX(b)}
              y={padding.top + innerH + 18}
              textAnchor="middle"
              fontSize="9"
              fontWeight="600"
              fill="#1e3a8a"
            >
              {formatTick(b)}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
