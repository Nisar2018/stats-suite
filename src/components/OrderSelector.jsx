const inputClass =
  'w-full rounded-lg border border-academic-300 bg-white px-4 py-2.5 text-academic-800 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 sm:max-w-xs';

export function OrderSelector({ label, value, onChange, min, max, hint }) {
  return (
    <div className="rounded-lg border border-academic-200 bg-white p-5 shadow-sm">
      <label htmlFor="order-selector" className="mb-2 block text-sm font-semibold text-blue-900">
        {label}
      </label>
      <input
        id="order-selector"
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(e) => {
          const num = Number(e.target.value);
          if (!Number.isNaN(num)) onChange(num);
        }}
        className={inputClass}
      />
      {hint && <p className="mt-2 text-xs text-academic-500">{hint}</p>}
    </div>
  );
}
