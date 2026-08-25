function formatTick(n) {
  if (!Number.isFinite(n)) return '';
  return Number.isInteger(n) ? String(n) : String(parseFloat(n.toFixed(2)));
}

function nicePad(min, max) {
  const span = max - min || 1;
  const pad = span * 0.08;
  return { lo: min - pad, hi: max + pad };
}

/**
 * Scatter plot — points: [{ x, y }]
 * showEqualityLine: draw y = x at 45° (same-variable plot, shared axis scale)
 */
export function ScatterPlotChart({
  title,
  points,
  xLabel = 'X',
  yLabel = 'Y',
  showEqualityLine = false,
}) {
  if (!points?.length) return null;

  const width = 520;
  const height = 420;
  const padding = { top: 36, right: 28, bottom: 64, left: 56 };
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;

  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);

  let xLo;
  let xHi;
  let yLo;
  let yHi;

  if (showEqualityLine) {
    const min = Math.min(...xs, ...ys);
    const max = Math.max(...xs, ...ys);
    const shared = nicePad(min, max);
    xLo = yLo = shared.lo;
    xHi = yHi = shared.hi;
  } else {
    const xp = nicePad(Math.min(...xs), Math.max(...xs));
    const yp = nicePad(Math.min(...ys), Math.max(...ys));
    xLo = xp.lo;
    xHi = xp.hi;
    yLo = yp.lo;
    yHi = yp.hi;
  }

  const xRange = xHi - xLo || 1;
  const yRange = yHi - yLo || 1;

  const scaleX = (v) => padding.left + ((v - xLo) / xRange) * innerW;
  const scaleY = (v) => padding.top + innerH - ((v - yLo) / yRange) * innerH;

  const xTicks = Array.from({ length: 6 }, (_, i) => xLo + (xRange * i) / 5);
  const yTicks = Array.from({ length: 6 }, (_, i) => yLo + (yRange * i) / 5);

  return (
    <div className="rounded-lg border border-academic-200 bg-white p-4">
      {title && <p className="mb-2 text-center text-sm font-semibold text-blue-900">{title}</p>}
      {showEqualityLine && (
        <p className="mb-2 text-center text-xs text-academic-500">
          Line of equality drawn at 45° (y = x)
        </p>
      )}
      <svg viewBox={`0 0 ${width} ${height}`} className="mx-auto w-full max-w-full">
        {yTicks.map((tick) => (
          <g key={`yg-${tick}`}>
            <line
              x1={padding.left}
              y1={scaleY(tick)}
              x2={padding.left + innerW}
              y2={scaleY(tick)}
              stroke="#e2e8f0"
              strokeWidth="1"
            />
            <text x={padding.left - 6} y={scaleY(tick) + 3} textAnchor="end" fontSize="9" fill="#64748b">
              {formatTick(tick)}
            </text>
          </g>
        ))}
        {xTicks.map((tick) => (
          <g key={`xg-${tick}`}>
            <line
              x1={scaleX(tick)}
              y1={padding.top}
              x2={scaleX(tick)}
              y2={padding.top + innerH}
              stroke="#e2e8f0"
              strokeWidth="1"
            />
            <text
              x={scaleX(tick)}
              y={padding.top + innerH + 16}
              textAnchor="middle"
              fontSize="9"
              fill="#64748b"
            >
              {formatTick(tick)}
            </text>
          </g>
        ))}

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

        {showEqualityLine && (
          <line
            x1={scaleX(xLo)}
            y1={scaleY(xLo)}
            x2={scaleX(xHi)}
            y2={scaleY(xHi)}
            stroke="#dc2626"
            strokeWidth="1.5"
            strokeDasharray="6 4"
          />
        )}

        {points.map((p, i) => (
          <circle
            key={`sc-${i}-${p.x}-${p.y}`}
            cx={scaleX(p.x)}
            cy={scaleY(p.y)}
            r="5"
            fill="#1d4ed8"
            stroke="#fff"
            strokeWidth="1.5"
          >
            <title>
              ({formatTick(p.x)}, {formatTick(p.y)})
            </title>
          </circle>
        ))}

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
          y={height - 14}
          textAnchor="middle"
          fontSize="11"
          fontWeight="600"
          fill="#1e3a8a"
        >
          {xLabel}
        </text>
      </svg>
    </div>
  );
}
