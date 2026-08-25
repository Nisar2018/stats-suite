export function CalculationSteps({ steps, result, resultLabel = 'Result' }) {
  if (steps.length === 0) return null;

  return (
    <div className="rounded-lg border border-academic-200 bg-white shadow-sm">
      <div className="border-b border-academic-200 bg-academic-50 px-5 py-3">
        <h3 className="font-semibold text-blue-900">Calculation Steps</h3>
      </div>
      <ol className="divide-y divide-academic-100">
        {steps.map((step) => (
          <li key={step.step} className="px-5 py-4">
            <div className="flex gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                {step.step}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-academic-800">{step.title}</p>
                <pre className="mt-1.5 whitespace-pre-wrap font-sans text-sm leading-relaxed text-academic-600">
                  {step.content}
                </pre>
              </div>
            </div>
          </li>
        ))}
      </ol>
      {result && (
        <div className="border-t-2 border-blue-200 bg-blue-50 px-5 py-4">
          <p className="text-sm font-medium text-blue-700">{resultLabel}</p>
          <p className="mt-1 text-2xl font-bold text-blue-900">{result}</p>
        </div>
      )}
    </div>
  );
}
