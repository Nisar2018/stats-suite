export function FormulaBox({ label, children, className = '' }) {
  return (
    <div
      className={`rounded-lg border-2 border-academic-300 bg-academic-100/80 px-6 py-5 shadow-sm ${className}`}
    >
      {label && (
        <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-academic-500">
          {label}
        </p>
      )}
      <div className="flex flex-wrap items-center justify-center gap-1 text-lg font-medium text-academic-800 sm:text-xl md:text-2xl">
        {children}
      </div>
    </div>
  );
}

export function Fraction({ numerator, denominator }) {
  return (
    <span className="formula-fraction">
      <span className="formula-numerator">{numerator}</span>
      <span className="formula-denominator">{denominator}</span>
    </span>
  );
}

export function NthRoot({ n, children }) {
  return (
    <span className="formula-nth-root">
      <span className="formula-root-index">{n}</span>
      <span className="formula-radicand">{children}</span>
    </span>
  );
}

export function FormulaLegend({ items }) {
  return (
    <div className="mt-4 rounded-md border border-academic-200 bg-white p-4">
      <p className="mb-2 text-sm font-semibold text-academic-600">Where:</p>
      <ul className="space-y-1.5">
        {items.map((item) => (
          <li key={item.symbol} className="flex gap-2 text-sm text-academic-700">
            <span className="min-w-[2rem] font-mono font-semibold text-academic-800">
              {item.symbol}
            </span>
            <span>= {item.description}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
