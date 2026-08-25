const COLORS = ['#1d4ed8', '#059669', '#d97706', '#7c3aed', '#dc2626', '#0891b2'];

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

export function SimpleBarChart({
  title,
  data,
  multiple = false,
  stacked = false,
  xLabels = [],
  showValues = true,
  xAxisLabel = 'X-axis',
  yAxisLabel = 'Frequency',
}) {
  if (!data?.length) return null;

  const width = 680;
  const height = 360;
  const padding = { top: 48, right: 28, bottom: 72, left: 64 };
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;

  const renderAxes = (maxY) => {
    const ticks = buildYTicks(maxY);
    const top = ticks[ticks.length - 1] || 1;

    return (
      <g>
        {/* Grid + Y tick values */}
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
              <text
                x={padding.left - 8}
                y={y + 4}
                textAnchor="end"
                fontSize="10"
                fill="#475569"
              >
                {tick}
              </text>
            </g>
          );
        })}

        {/* Y-axis */}
        <line
          x1={padding.left}
          y1={padding.top}
          x2={padding.left}
          y2={padding.top + innerH}
          stroke="#334155"
          strokeWidth="1.5"
        />
        {/* X-axis */}
        <line
          x1={padding.left}
          y1={padding.top + innerH}
          x2={padding.left + innerW}
          y2={padding.top + innerH}
          stroke="#334155"
          strokeWidth="1.5"
        />

        {/* Y-axis label */}
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

        {/* X-axis label */}
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
      </g>
    );
  };

  /* Stacked / sub-divided bars: segments stacked within each category bar */
  if (stacked) {
    const maxY = Math.max(
      1,
      ...data.map((d) => (d.values ?? []).reduce((s, v) => s + (Number(v) || 0), 0)),
    );
    const top = niceMax(maxY);
    const barSlot = innerW / Math.max(data.length, 1);
    const barWidth = barSlot * 0.55;

    return (
      <div className="rounded-lg border border-academic-200 bg-white p-4">
        <p className="mb-2 text-center text-sm font-semibold text-blue-900">{title}</p>
        <svg viewBox={`0 0 ${width} ${height}`} className="mx-auto w-full max-w-full">
          {renderAxes(maxY)}

          {xLabels.map((label, i) => (
            <g key={`${label}-${i}`}>
              <rect
                x={padding.left + i * 90}
                y={12}
                width={10}
                height={10}
                fill={COLORS[i % COLORS.length]}
                rx={1}
              />
              <text x={padding.left + i * 90 + 14} y={21} fontSize="10" fill="#475569">
                {label}
              </text>
            </g>
          ))}

          {data.map((item, i) => {
            const values = item.values ?? [];
            const total = values.reduce((s, v) => s + (Number(v) || 0), 0);
            const x = padding.left + i * barSlot + (barSlot - barWidth) / 2;
            let yCursor = padding.top + innerH;

            return (
              <g key={item.id ?? item.label}>
                {values.map((val, vi) => {
                  const segmentH = ((Number(val) || 0) / top) * innerH;
                  yCursor -= segmentH;
                  const y = yCursor;
                  return (
                    <g key={vi}>
                      <rect
                        x={x}
                        y={y}
                        width={barWidth}
                        height={Math.max(segmentH, 0)}
                        fill={COLORS[vi % COLORS.length]}
                        stroke="#fff"
                        strokeWidth="1"
                      />
                      {showValues && val > 0 && segmentH > 14 && (
                        <text
                          x={x + barWidth / 2}
                          y={y + segmentH / 2 + 4}
                          textAnchor="middle"
                          fontSize="9"
                          fontWeight="600"
                          fill="#fff"
                        >
                          {val}
                        </text>
                      )}
                    </g>
                  );
                })}
                <text
                  x={x + barWidth / 2}
                  y={padding.top + innerH + 18}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight="600"
                  fill="#1e3a8a"
                >
                  {String(item.label).length > 10
                    ? `${String(item.label).slice(0, 9)}…`
                    : item.label}
                </text>
                {showValues && total > 0 && (
                  <text
                    x={x + barWidth / 2}
                    y={padding.top + innerH - (total / top) * innerH - 4}
                    textAnchor="middle"
                    fontSize="9"
                    fontWeight="600"
                    fill="#1e3a8a"
                  >
                    {total}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    );
  }

  if (multiple) {
    const seriesCount = Math.max(xLabels.length, data[0]?.values?.length ?? 1, 1);
    const maxY = Math.max(1, ...data.flatMap((d) => d.values ?? []));
    const top = niceMax(maxY);
    const groupWidth = innerW / Math.max(data.length, 1);
    const barWidth = groupWidth / (seriesCount + 1);

    return (
      <div className="rounded-lg border border-academic-200 bg-white p-4">
        <p className="mb-2 text-center text-sm font-semibold text-blue-900">{title}</p>
        <svg viewBox={`0 0 ${width} ${height}`} className="mx-auto w-full max-w-full">
          {renderAxes(maxY)}

          {/* Legend */}
          {xLabels.map((label, i) => (
            <g key={`${label}-${i}`}>
              <rect
                x={padding.left + i * 110}
                y={12}
                width={10}
                height={10}
                fill={COLORS[i % COLORS.length]}
                rx={1}
              />
              <text x={padding.left + i * 110 + 14} y={21} fontSize="10" fill="#475569">
                {label.length > 14 ? `${label.slice(0, 13)}…` : label}
              </text>
            </g>
          ))}

          {data.map((group, gi) => {
            const values = group.values ?? [];
            const groupCenter = padding.left + gi * groupWidth + groupWidth / 2;
            const groupStart = groupCenter - (values.length * barWidth) / 2;

            return (
              <g key={`${group.label}-${gi}`}>
                {values.map((val, vi) => {
                  const bh = (val / top) * innerH;
                  const x = groupStart + vi * barWidth;
                  const y = padding.top + innerH - bh;
                  const w = Math.max(barWidth * 0.85, 4);
                  return (
                    <g key={vi}>
                      <rect
                        x={x}
                        y={y}
                        width={w}
                        height={Math.max(bh, 0)}
                        fill={COLORS[vi % COLORS.length]}
                        rx={2}
                      />
                      {showValues && val > 0 && (
                        <text
                          x={x + w / 2}
                          y={y - 4}
                          textAnchor="middle"
                          fontSize="9"
                          fontWeight="600"
                          fill="#1e3a8a"
                        >
                          {val}
                        </text>
                      )}
                    </g>
                  );
                })}
                <text
                  x={groupCenter}
                  y={padding.top + innerH + 18}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight="600"
                  fill="#1e3a8a"
                >
                  {group.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    );
  }

  const maxY = Math.max(1, ...data.map((d) => d.frequency));
  const top = niceMax(maxY);
  const barWidth = innerW / data.length;

  return (
    <div className="rounded-lg border border-academic-200 bg-white p-4">
      <p className="mb-2 text-center text-sm font-semibold text-blue-900">{title}</p>
      <svg viewBox={`0 0 ${width} ${height}`} className="mx-auto w-full max-w-full">
        {renderAxes(maxY)}

        {data.map((item, i) => {
          const bh = (item.frequency / top) * innerH;
          const x = padding.left + i * barWidth + barWidth * 0.15;
          const y = padding.top + innerH - bh;
          const w = barWidth * 0.7;
          return (
            <g key={item.id ?? item.label}>
              <rect
                x={x}
                y={y}
                width={w}
                height={Math.max(bh, 0)}
                fill={COLORS[i % COLORS.length]}
                rx={2}
              />
              <text
                x={x + w / 2}
                y={padding.top + innerH + 18}
                textAnchor="middle"
                fontSize="11"
                fontWeight="600"
                fill="#1e3a8a"
              >
                {String(item.label).length > 10
                  ? `${String(item.label).slice(0, 9)}…`
                  : item.label}
              </text>
              {showValues && (
                <text
                  x={x + w / 2}
                  y={y - 4}
                  textAnchor="middle"
                  fontSize="9"
                  fill="#1e3a8a"
                  fontWeight="600"
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
