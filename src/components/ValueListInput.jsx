import { useEffect, useState } from 'react';

export function ValueListInput({
  label,
  placeholder = 'e.g. 12, 15, 18, 20, 22',
  defaultValue = '',
  onValuesChange,
}) {
  const [input, setInput] = useState(defaultValue);

  useEffect(() => {
    if (defaultValue) {
      handleChange(defaultValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (value) => {
    setInput(value);
    const values = value
      .split(/[,;\s]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0)
      .map(Number)
      .filter((n) => !Number.isNaN(n));
    onValuesChange(values);
  };

  return (
    <div className="rounded-lg border border-academic-200 bg-white p-5 shadow-sm">
      <label htmlFor="value-list-input" className="mb-2 block text-sm font-semibold text-blue-900">
        {label}
      </label>
      <input
        id="value-list-input"
        type="text"
        value={input}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-academic-300 px-4 py-2.5 text-academic-800 placeholder:text-academic-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
      />
      <p className="mt-2 text-xs text-academic-500">Enter values separated by commas or spaces</p>
    </div>
  );
}
