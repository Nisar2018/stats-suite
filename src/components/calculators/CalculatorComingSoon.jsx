export function CalculatorComingSoon({ title, description }) {
  return (
    <div className="p-4 sm:p-6 md:p-8">
      <h1 className="text-2xl font-bold text-blue-900 md:text-3xl">{title}</h1>
      <p className="mt-3 max-w-2xl text-academic-600">{description}</p>
      <div className="mt-8 rounded-2xl border border-dashed border-academic-300 bg-white p-10 text-center shadow-sm">
        <p className="text-lg font-semibold text-blue-900">Coming Soon</p>
        <p className="mt-2 text-sm text-academic-600">
          This calculator is under development and will be available in a future update.
        </p>
      </div>
    </div>
  );
}
