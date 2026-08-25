export function ResultLineGraph({ chart, compact = false, inline = false, wide = false }) {
  if (!chart?.values?.length) {
    return (
      <div
        className={`flex items-center justify-center rounded-lg border border-dashed border-academic-300 bg-academic-50 text-center text-xs text-academic-500 ${
          compact ? 'h-40 px-3' : 'h-48 px-4'
        }`}
      >
        Enter data to see the line graph
      </div>
    );
  }

  const padding = { top: 28, right: 16, bottom: 36, left: 44 };
  const width = wide ? 640 : inline ? 380 : compact ? 260 : 280;
  const height = wide ? 300 : inline ? 260 : compact ? 200 : 240;
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;

  const hasNumericX = chart.xValues?.length === chart.values.length;
  const resultLines = chart.resultLines ?? [];

  const resultLineValues = hasNumericX
    ? []
    : resultLines.map((line) => line.value);

  const allY = [...chart.values, ...resultLineValues];
  const minY = Math.min(...allY);
  const maxY = Math.max(...allY);
  const padY = (maxY - minY) * 0.1 || 1;
  const yMin = minY - padY;
  const yMax = maxY + padY;
  const rangeY = yMax - yMin || 1;

  let xMin = 0;
  let xMax = 1;
  let rangeX = 1;

  if (hasNumericX) {
    const resultXValues = resultLines.map((line) => line.value);
    xMin = Math.min(...chart.xValues, ...resultXValues);
    xMax = Math.max(...chart.xValues, ...resultXValues);
    const padX = (xMax - xMin) * 0.05 || 1;
    xMin -= padX;
    xMax += padX;
    rangeX = xMax - xMin || 1;
  }

  const toX = (index) => {
    if (hasNumericX) {
      return padding.left + ((chart.xValues[index] - xMin) / rangeX) * innerW;
    }
    return padding.left + (index / Math.max(chart.values.length - 1, 1)) * innerW;
  };

  const toXFromValue = (x) => padding.left + ((x - xMin) / rangeX) * innerW;

  const toY = (value) =>
    padding.top + innerH - ((value - yMin) / rangeY) * innerH;

  const interpolateFrequencyAtX = (x) => {
    const xs = chart.xValues;
    const ys = chart.values;
    if (x <= xs[0]) return ys[0];
    if (x >= xs[xs.length - 1]) return ys[ys.length - 1];
    for (let i = 0; i < xs.length - 1; i += 1) {
      if (x >= xs[i] && x <= xs[i + 1]) {
        const span = xs[i + 1] - xs[i];
        if (span === 0) return ys[i];
        const t = (x - xs[i]) / span;
        return ys[i] + t * (ys[i + 1] - ys[i]);
      }
    }
    return ys[0];
  };

  const points = chart.values.map((value, index) => ({
    x: toX(index),
    y: toY(value),
    value,
    label: chart.labels[index] ?? `${index + 1}`,
  }));

  const pathD = points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ');

  const yTicks = 4;
  const yTickValues = Array.from({ length: yTicks + 1 }, (_, i) =>
    yMin + (rangeY * i) / yTicks,
  );

  return (
    <div className="w-full">
      {chart.title && (
        <p className="mb-2 text-center text-xs font-semibold text-blue-900">{chart.title}</p>
      )}
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="mx-auto w-full max-w-full"
        role="img"
        aria-label={chart.title ?? 'Result line graph'}
      >
        {yTickValues.map((tick) => {
          const y = toY(tick);
          return (
            <g key={tick}>
              <line
                x1={padding.left}
                y1={y}
                x2={width - padding.right}
                y2={y}
                stroke="#e2e8f0"
                strokeWidth="1"
              />
              <text
                x={padding.left - 6}
                y={y + 3}
                textAnchor="end"
                fontSize="9"
                fill="#64748b"
              >
                {Number.isInteger(tick) ? tick : String(parseFloat(tick.toFixed(1)))}
              </text>
            </g>
          );
        })}

        <line
          x1={padding.left}
          y1={padding.top + innerH}
          x2={width - padding.right}
          y2={padding.top + innerH}
          stroke="#94a3b8"
          strokeWidth="1.5"
        />
        <line
          x1={padding.left}
          y1={padding.top}
          x2={padding.left}
          y2={padding.top + innerH}
          stroke="#94a3b8"
          strokeWidth="1.5"
        />

        <path
          d={pathD}
          fill="none"
          stroke="#1d4ed8"
          strokeWidth="2.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {points.map((point) => (
          <g key={`${point.label}-${point.x}`}>
            <circle cx={point.x} cy={point.y} r="4" fill="#1d4ed8" stroke="#fff" strokeWidth="1.5" />
            <title>
              x = {point.label}, f = {point.value}
            </title>
          </g>
        ))}

        {resultLines.map((line) => {
          const color = line.color ?? '#dc2626';

          if (hasNumericX) {
            const x = toXFromValue(line.value);
            const freq = interpolateFrequencyAtX(line.value);
            const y = toY(freq);
            const baseY = padding.top + innerH;

            return (
              <g key={line.label}>
                <line
                  x1={x}
                  y1={padding.top}
                  x2={x}
                  y2={baseY}
                  stroke={color}
                  strokeWidth="1.5"
                  strokeDasharray="5 4"
                />
                <line
                  x1={x}
                  y1={y}
                  x2={x}
                  y2={baseY}
                  stroke={color}
                  strokeWidth="2"
                />
                <circle cx={x} cy={y} r="5.5" fill={color} stroke="#fff" strokeWidth="2" />
                <polygon
                  points={`${x},${y - 10} ${x - 4},${y - 4} ${x + 4},${y - 4}`}
                  fill={color}
                />
                <text
                  x={x}
                  y={padding.top - 6}
                  textAnchor="middle"
                  fontSize="7.5"
                  fill={color}
                  fontWeight="700"
                >
                  {line.label}
                </text>
              </g>
            );
          }

          const y = toY(line.value);
          return (
            <g key={line.label}>
              <line
                x1={padding.left}
                y1={y}
                x2={width - padding.right}
                y2={y}
                stroke={color}
                strokeWidth="1.5"
                strokeDasharray="5 4"
              />
              <circle cx={width - padding.right - 8} cy={y} r="4.5" fill={color} stroke="#fff" strokeWidth="1.5" />
              <text
                x={width - padding.right}
                y={y - 4}
                textAnchor="end"
                fontSize="8"
                fill={color}
                fontWeight="600"
              >
                {line.label}
              </text>
            </g>
          );
        })}

        {points.map((point, index) => {
          if (chart.values.length > 8 && index % 2 !== 0 && index !== chart.values.length - 1) {
            return null;
          }
          return (
            <text
              key={`label-${point.label}`}
              x={point.x}
              y={height - (chart.xLabel ? 22 : 10)}
              textAnchor="middle"
              fontSize="8"
              fill="#64748b"
            >
              {point.label.length > 8 ? `${point.label.slice(0, 7)}…` : point.label}
            </text>
          );
        })}

        {chart.yLabel && (
          <text
            x={14}
            y={padding.top + innerH / 2}
            textAnchor="middle"
            fontSize="9"
            fill="#475569"
            transform={`rotate(-90, 14, ${padding.top + innerH / 2})`}
          >
            {chart.yLabel}
          </text>
        )}

        {chart.xLabel && (
          <text
            x={padding.left + innerW / 2}
            y={height - 2}
            textAnchor="middle"
            fontSize="9"
            fill="#475569"
          >
            {chart.xLabel}
          </text>
        )}
      </svg>

      {chart.resultSummary && (
        <p className="mt-2 rounded-md bg-blue-50 px-2 py-1.5 text-center text-xs font-semibold text-blue-900">
          {chart.resultSummary}
        </p>
      )}
    </div>
  );
}
