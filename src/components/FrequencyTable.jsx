export function FrequencyTable({
  columns,
  rows,
  highlightRowIndex,
  showTotal = false,
  totalLabel = 'Total',
  totalValues,
  highlightLabel = 'Highlighted class',
}) {
  const getCellValue = (row, key, index) => {
    if (key === 'cumulative') {
      const cumulative = rows
        .slice(0, index)
        .reduce((sum, r) => sum + r.frequency, 0);
      return cumulative;
    }
    const value = row[key];
    return value ?? '—';
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[320px] border-collapse text-sm">
        <thead>
          <tr className="bg-academic-700 text-white">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`border border-academic-600 px-4 py-3 font-semibold ${
                  col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                }`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => {
            const isHighlighted = highlightRowIndex === index;
            return (
              <tr
                key={row.classInterval}
                className={`transition-colors ${
                  isHighlighted
                    ? 'bg-highlight font-semibold ring-2 ring-inset ring-highlight-border'
                    : index % 2 === 0
                      ? 'bg-white'
                      : 'bg-academic-50'
                }`}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`border border-academic-200 px-4 py-2.5 ${
                      col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                    }`}
                  >
                    {getCellValue(row, col.key, index)}
                  </td>
                ))}
              </tr>
            );
          })}
          {showTotal && totalValues && (
            <tr className="bg-academic-200 font-bold text-academic-900">
              {columns.map((col, colIndex) => (
                <td
                  key={col.key}
                  className={`border border-academic-300 px-4 py-2.5 ${
                    col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                  }`}
                >
                  {colIndex === 0
                    ? totalLabel
                    : totalValues[col.key] !== undefined
                      ? totalValues[col.key]
                      : ''}
                </td>
              ))}
            </tr>
          )}
        </tbody>
      </table>
      {highlightRowIndex !== undefined && (
        <p className="mt-2 flex items-center gap-2 text-xs text-academic-600">
          <span className="inline-block h-3 w-6 rounded border-2 border-highlight-border bg-highlight" />
          {highlightLabel}
        </p>
      )}
    </div>
  );
}
