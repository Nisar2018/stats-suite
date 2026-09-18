import { siteConfig } from '../data/siteConfig';

/** Learning areas that match live app modules and menus. */
const learningAreas = [
  {
    id: 'central-tendency',
    title: 'Central Tendency',
    description:
      'Mean (arithmetic, geometric, harmonic), mode, median, quartiles, deciles, and percentiles for ungrouped, grouped, frequency, and weighted data — with formulas and step-by-step solutions.',
    topics: '19 topics',
    icon: 'X̄',
  },
  {
    id: 'measurement-of-dispersion',
    title: 'Measurement of Dispersion',
    description:
      'Range, quartile deviation, mean deviation, variance, and standard deviation (plus coefficients) for ungrouped and grouped data.',
    topics: '21 topics',
    icon: 'σ',
  },
  {
    id: 'representation-of-data',
    title: 'Representation of Data',
    description:
      'Frequency tables, relative and cumulative frequency, bar diagrams, pie charts, histograms, frequency polygons, scatter plots, and bivariate tables.',
    topics: '20 topics',
    icon: '▣',
  },
  {
    id: 'probability',
    title: 'Probability',
    description:
      'Factorial, permutation, combination, sample space, event types, simple and compound probability, conditional probability, and independent events with real-world examples.',
    topics: '8 topics',
    icon: 'P',
  },
  {
    id: 'basic-calculator',
    title: 'Math Calculators',
    description:
      'Free tools for everyday math and finance: basic calculator, percentage, finance (FV/PV/PMT), mortgage, loan, and GWA calculators.',
    topics: '6 tools',
    icon: 'ƒ',
  },
];

const highlights = [
  { value: '70+', label: 'Interactive Topics & Tools' },
  { value: '100%', label: 'Step-by-Step Solutions' },
  { value: 'Live', label: 'Real-time Calculations' },
  { value: 'Free', label: 'Educational Access' },
];

export function HomePage({ onStartLearning, onNavigate }) {
  const go = (pageId) => {
    if (typeof onNavigate === 'function') onNavigate(pageId);
    else onStartLearning?.();
  };

  return (
    <div>
      <section className="relative overflow-hidden" aria-label="Hero">
        <div className="relative h-64 md:h-80 lg:h-96">
          <img
            src={siteConfig.heroBanner}
            alt={`${siteConfig.name} — free interactive statistics calculators for mean, median, mode, dispersion, charts, and probability`}
            width={1920}
            height={640}
            className="h-full w-full object-cover"
            onError={(e) => {
              e.currentTarget.src = '';
              e.currentTarget.className = 'hidden';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy/90 via-navy/70 to-navy/40" />
          <div className="absolute inset-0 flex items-center">
            <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
              <p className="mb-2 text-sm font-medium uppercase tracking-wide text-blue-200">
                {siteConfig.name}
              </p>
              <h1 className="text-3xl font-bold text-white md:text-4xl lg:text-5xl">
                Free Interactive Statistics Calculators
              </h1>
              <p className="mt-3 max-w-2xl text-lg text-blue-100 md:text-xl">
                Learn and calculate central tendency, dispersion, data charts, probability, and
                everyday math — with clear formulas and step-by-step solutions.
              </p>
              <button
                type="button"
                onClick={onStartLearning}
                className="mt-6 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-blue-900 shadow-lg transition-transform hover:scale-105 hover:bg-blue-50"
              >
                Start Learning →
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16" aria-labelledby="why-heading">
        <div className="text-center">
          <h2 id="why-heading" className="text-2xl font-bold text-blue-900 md:text-3xl">
            Why {siteConfig.name}?
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-academic-600">
            A free educational platform for students and teachers — interactive statistics and math
            calculators with formulas, editable inputs, and worked solutions.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
          {highlights.map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-academic-200 bg-white p-5 text-center shadow-sm"
            >
              <p className="text-2xl font-bold text-blue-900 md:text-3xl">{item.value}</p>
              <p className="mt-1 text-sm text-academic-600">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-academic-100/60 py-12 md:py-16" aria-labelledby="learn-heading">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <h2 id="learn-heading" className="text-center text-2xl font-bold text-blue-900 md:text-3xl">
            What You Will Learn
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-academic-600">
            Explore every module available in the app — from descriptive statistics and graphs to
            probability and practical math calculators.
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {learningAreas.map((area) => (
              <button
                key={area.id}
                type="button"
                onClick={() => go(area.id)}
                className="rounded-xl border border-academic-200 bg-white p-6 text-left shadow-sm transition-shadow hover:border-blue-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-900 text-lg font-bold text-white">
                    {area.icon}
                  </div>
                  <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-800">
                    {area.topics}
                  </span>
                </div>
                <h3 className="mt-4 text-xl font-bold text-blue-900">{area.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-academic-600">{area.description}</p>
                <p className="mt-4 text-sm font-semibold text-blue-800">Open module →</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16" aria-labelledby="cta-heading">
        <div className="rounded-2xl bg-navy px-6 py-10 text-center md:px-12">
          <h2 id="cta-heading" className="text-2xl font-bold text-white md:text-3xl">
            Ready to Calculate?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-blue-100">
            Enter your own data and watch every calculation unfold step by step — free, online, no
            signup required.
          </p>
          <button
            type="button"
            onClick={onStartLearning}
            className="mt-6 rounded-lg bg-white px-8 py-3 font-semibold text-blue-900 transition-colors hover:bg-blue-50"
          >
            Go to Central Tendency Measurement
          </button>
        </div>
      </section>
    </div>
  );
}
