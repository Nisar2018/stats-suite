import { siteConfig } from '../data/siteConfig';

const statsFeatures = [
  {
    title: 'Mean',
    description:
      'Calculate arithmetic, geometric, and harmonic mean for ungrouped data, grouped data, frequency tables, and weighted datasets with full step-by-step working.',
    icon: 'X̄',
  },
  {
    title: 'Mode',
    description:
      'Find the most frequently occurring value in ungrouped data or use the modal class formula for grouped frequency distributions.',
    icon: 'Mo',
  },
  {
    title: 'Median',
    description:
      'Determine the middle value of a dataset or locate the median class in a frequency table with cumulative frequency analysis.',
    icon: 'Md',
  },
];

const highlights = [
  { value: '19+', label: 'Interactive Topics' },
  { value: '100%', label: 'Step-by-Step Solutions' },
  { value: 'Live', label: 'Real-time Calculations' },
  { value: 'Free', label: 'Educational Access' },
];

export function HomePage({ onStartLearning }) {
  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="relative h-64 md:h-80 lg:h-96">
          <img
            src={siteConfig.heroBanner}
            alt="Statistics learning hero banner"
            className="h-full w-full object-cover"
            onError={(e) => {
              e.currentTarget.src = '';
              e.currentTarget.className = 'hidden';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy/90 via-navy/70 to-navy/40" />
          <div className="absolute inset-0 flex items-center">
            <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
              <h1 className="text-3xl font-bold text-white md:text-4xl lg:text-5xl">
                Master Central Tendency
              </h1>
              <p className="mt-3 max-w-xl text-lg text-blue-100 md:text-xl">
                Interactive statistics learning with formulas, calculators, and detailed
                calculation steps for mean, mode, and median.
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

      <section className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-blue-900 md:text-3xl">
            Why StatsSuite?
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-academic-600">
            A comprehensive educational platform designed for students learning measures of
            central tendency in statistics.
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

      <section className="bg-academic-100/60 py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <h2 className="text-center text-2xl font-bold text-blue-900 md:text-3xl">
            What You Will Learn
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-academic-600">
            Explore the three fundamental measures of central tendency with interactive tools.
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {statsFeatures.map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border border-academic-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-900 text-lg font-bold text-white">
                  {feature.icon}
                </div>
                <h3 className="mt-4 text-xl font-bold text-blue-900">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-academic-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
        <div className="rounded-2xl bg-navy px-6 py-10 text-center md:px-12">
          <h2 className="text-2xl font-bold text-white md:text-3xl">
            Ready to Calculate?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-blue-100">
            Enter your own data values and watch every calculation unfold step by step.
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
