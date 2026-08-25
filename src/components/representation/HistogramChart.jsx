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

function buildYTicks(maxY, count = 5) {
  const top = niceMax(maxY);
  const step = top / count;
  return Array.from({ length: count + 1 }, (_, i) => Math.round(step * i * 100) / 100);
}

function formatBoundaryLabel(n) {
  if (!Number.isFinite(n)) return '';
  return Number.isInteger(n) ? String(n) : String(parseFloat(n.toFixed(1)));
}

export function HistogramChart({
  title,
  data,
  useAdjusted = false,
  discrete = false,
  boundaryBased = false,
}) {
  if (!data?.length) return null;

  const width = 680;
  const height = 360;
  const padding = { top: 40, right: 28, bottom: 72, left: 64 };
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;

  const maxY = Math.max(1, ...data.map((d) => d.frequency));
  const top = niceMax(maxY);
  const ticks = buildYTicks(maxY);

  const yAxisLabel = useAdjusted ? 'Adjusted frequency' : 'Frequency';
  const xAxisLabel = boundaryBased
    ? discrete
      ? 'Discrete value'
      : 'Class boundary'
    : discrete
      ? 'Discrete value'
      : 'Class interval';

  /* Boundary-based histogram — x-axis from 0 with gap before first bar */
  if (boundaryBased) {
    const xMin = 0;
    const xMax = Math.max(...data.map((d) => d.upperBoundary));
    const xRange = xMax - xMin || 1;

    const scaleX = (val) => padding.left + ((val - xMin) / xRange) * innerW;

    const boundaryTicks = [
      0,
      ...new Set(data.flatMap((d) => [d.lowerBoundary, d.upperBoundary])),
    ].sort((a, b) => a - b);

    return (
      <div className="rounded-lg border border-academic-200 bg-white p-4">
        <p className="mb-2 text-center text-sm font-semibold text-blue-900">{title}</p>
        <p className="mb-2 text-center text-xs text-academic-500">
          X-axis from 0 to {formatBoundaryLabel(xMax)} — gap before first class boundary
        </p>
        <svg viewBox={`0 0 ${width} ${height}`} className="mx-auto w-full max-w-full">
          {ticks.map((tick) => {
            const y = padding.top + innerH - (tick / top) * innerH;
            return (
              <g key={`ytick-${tick}`}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={padding.left + innerW}
                  y2={y}
                  stroke="#e2e8f0"
                  strokeWidth="1"
                />
                <text x={padding.left - 8} y={y + 4} textAnchor="end" fontSize="10" fill="#475569">
                  {tick}
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
            {yAxisLabel}
          </text>
          <text
            x={padding.left + innerW / 2}
            y={height - 12}
            textAnchor="middle"
            fontSize="11"
            fontWeight="600"
            fill="#1e3a8a"
          >
            {xAxisLabel}
          </text>

          {data.map((item, i) => {
            const x = scaleX(item.lowerBoundary);
            const barW = scaleX(item.upperBoundary) - x;
            const bh = (item.frequency / top) * innerH;
            const y = padding.top + innerH - bh;
            const midX = x + barW / 2;

            return (
              <g key={`${item.lowerBoundary}-${item.upperBoundary}-${i}`}>
                <rect
                  x={x}
                  y={y}
                  width={Math.max(barW, 1)}
                  height={Math.max(bh, 0)}
                  fill="#bfdbfe"
                  stroke="#93c5fd"
                  strokeWidth={1}
                />
                {/* Dotted vertical line at bar midpoint */}
                <line
                  x1={midX}
                  y1={padding.top + innerH}
                  x2={midX}
                  y2={y}
                  stroke="#1e3a8a"
                  strokeWidth="1.5"
                  strokeDasharray="4 3"
                />
                {item.frequency > 0 && (
                  <text
                    x={midX}
                    y={y - 4}
                    textAnchor="middle"
                    fontSize="9"
                    fontWeight="600"
                    fill="#1e3a8a"
                  >
                    {item.frequency}
                  </text>
                )}
              </g>
            );
          })}

          {/* X-axis boundary tick labels */}
          {boundaryTicks.map((b) => (
            <g key={`xbound-${b}`}>
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
                {formatBoundaryLabel(b)}
              </text>
            </g>
          ))}
        </svg>
      </div>
    );
  }

  const totalWidth = data.reduce((s, d) => s + d.width, 0) || 1;
  let xOffset = padding.left;

  return (
    <div className="rounded-lg border border-academic-200 bg-white p-4">
      <p className="mb-2 text-center text-sm font-semibold text-blue-900">{title}</p>
      <p className="mb-2 text-center text-xs text-academic-500">
        {useAdjusted
          ? 'Bar height = adjusted frequency (f ÷ width)'
          : discrete
            ? 'Bars centred on each discrete value'
            : 'Bars touch — equal class width histogram'}
      </p>
      <svg viewBox={`0 0 ${width} ${height}`} className="mx-auto w-full max-w-full">
        {ticks.map((tick) => {
          const y = padding.top + innerH - (tick / top) * innerH;
          return (
            <g key={`ytick-${tick}`}>
              <line
                x1={padding.left}
                y1={y}
                x2={padding.left + innerW}
                y2={y}
                stroke="#e2e8f0"
                strokeWidth="1"
              />
              <text x={padding.left - 8} y={y + 4} textAnchor="end" fontSize="10" fill="#475569">
                {tick}
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
          {yAxisLabel}
        </text>
        <text
          x={padding.left + innerW / 2}
          y={height - 12}
          textAnchor="middle"
          fontSize="11"
          fontWeight="600"
          fill="#1e3a8a"
        >
          {xAxisLabel}
        </text>

        {data.map((item, i) => {
          const barPixelWidth = (item.width / totalWidth) * innerW;
          const bh = (item.frequency / top) * innerH;
          const x = xOffset;
          const y = padding.top + innerH - bh;
          xOffset += barPixelWidth;
          return (
            <g key={`${item.label}-${i}`}>
              <rect
                x={x}
                y={y}
                width={barPixelWidth}
                height={Math.max(bh, 0)}
                fill="#bfdbfe"
                stroke="#93c5fd"
                strokeWidth={discrete ? 2 : 0}
              />
              <text
                x={x + barPixelWidth / 2}
                y={padding.top + innerH + 18}
                textAnchor="middle"
                fontSize="9"
                fontWeight="600"
                fill="#1e3a8a"
              >
                {item.label}
              </text>
              {item.frequency > 0 && (
                <text
                  x={x + barPixelWidth / 2}
                  y={y - 4}
                  textAnchor="middle"
                  fontSize="9"
                  fontWeight="600"
                  fill="#1e3a8a"
                >
                  {item.frequency}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
