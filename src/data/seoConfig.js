import { siteConfig } from './siteConfig';
import { menuSections } from './menuConfig';
import { dispersionMenuSections } from './dispersionMenuConfig';
import { representationMenuSections } from './representationMenuConfig';
import { probabilityMenuSections } from './probabilityMenuConfig';
import { mathCalculatorMenuSections } from './mathCalculatorMenuConfig';

/** Override with your live domain when deploying (no trailing slash). */
export const SITE_ORIGIN =
  typeof window !== 'undefined' && window.location?.origin
    ? window.location.origin
    : 'https://mystatcalculator.com';

export const siteSeo = {
  name: siteConfig.name,
  tagline: siteConfig.tagline,
  defaultTitle: `${siteConfig.name} — Free Statistics Calculators Online | Mean, Median, Mode, Probability`,
  titleTemplate: `%s | ${siteConfig.name}`,
  defaultDescription:
    'Free interactive statistics calculators for central tendency (mean, median, mode), dispersion (range, variance, SD), frequency tables, charts, probability, and math tools — with formulas and step-by-step solutions.',
  defaultKeywords:
    'statistics calculator, free statistics calculator online, central tendency calculator, mean median mode calculator, standard deviation calculator, variance calculator, frequency table, histogram, probability calculator, permutation combination, percentage calculator, StatsSuite, mystatcalculator',
  author: siteConfig.name,
  ogImage: '/images/mystatcalculator.png',
  twitterCard: 'summary_large_image',
  locale: 'en_US',
  type: 'website',
};

const brand = siteConfig.name;

/** Top-level page SEO (used when no topic, or as section defaults). */
export const pageSeo = {
  home: {
    title: siteSeo.defaultTitle,
    description: siteSeo.defaultDescription,
    keywords: siteSeo.defaultKeywords,
  },
  'central-tendency': {
    title: `Central Tendency Calculator — Mean, Median, Mode | ${brand}`,
    description:
      'Calculate mean, median, mode, quartiles, deciles, and percentiles with interactive formulas and step-by-step solutions for ungrouped and grouped data.',
    keywords:
      'central tendency calculator, mean calculator, median calculator, mode calculator, quartile, percentile, geometric mean, harmonic mean',
  },
  'measurement-of-dispersion': {
    title: `Measurement of Dispersion — Range, Variance, SD | ${brand}`,
    description:
      'Learn and calculate range, quartile deviation, mean deviation, variance, and standard deviation with clear formulas and worked examples.',
    keywords:
      'dispersion calculator, range, quartile deviation, mean deviation, variance, standard deviation, coefficient of variation',
  },
  'representation-of-data': {
    title: `Representation of Data — Tables, Charts & Graphs | ${brand}`,
    description:
      'Build frequency tables, bar charts, pie graphs, histograms, polygons, and scatter plots from raw data with interactive statistics tools.',
    keywords:
      'frequency table, bar chart, histogram, pie chart, scatter plot, cumulative frequency, data representation',
  },
  probability: {
    title: `Probability Calculator — Factorial, Permutation, Combination | ${brand}`,
    description:
      'Learn probability with interactive calculators for factorial, permutation, combination, sample space, events, conditional probability, and independent events.',
    keywords:
      'probability calculator, factorial, permutation, combination, sample space, conditional probability, independent events',
  },
  'basic-calculator': {
    title: `Basic Calculator Online | ${brand}`,
    description:
      'Free online basic calculator for addition, subtraction, multiplication, division, percentages, square roots, exponents, and memory functions.',
    keywords: 'basic calculator, online calculator, arithmetic calculator, free calculator',
  },
  'percentage-calculator': {
    title: `Percentage Calculator Online | ${brand}`,
    description:
      'Find percentages, percent increase or decrease, and reverse percentages for discounts, tax, grades, and everyday math problems.',
    keywords: 'percentage calculator, percent increase, percent decrease, reverse percentage',
  },
  'finance-calculator': {
    title: `Finance Calculator — FV, PV, PMT Online | ${brand}`,
    description:
      'Calculate Future Value, Present Value, Payment, Interest Rate, and Number of Periods with instant results and payment breakdowns.',
    keywords: 'finance calculator, FV, PV, PMT, interest rate calculator, time value of money',
  },
  'mortgage-calculator': {
    title: `Mortgage Calculator — Monthly Payment & Amortization | ${brand}`,
    description:
      'Estimate mortgage monthly payments, interest, principal, and amortization schedules with interactive charts for home loan planning.',
    keywords: 'mortgage calculator, home loan calculator, amortization schedule, monthly payment',
  },
  'loan-calculator': {
    title: `Loan Calculator — Payment & Interest Schedule | ${brand}`,
    description:
      'Estimate monthly payments, total interest, and payoff schedules for amortized loans, deferred loans, and bonds.',
    keywords: 'loan calculator, EMI calculator, loan payment, interest schedule',
  },
  'gwa-calculator': {
    title: `GWA Calculator — General Weighted Average | ${brand}`,
    description:
      'Calculate your General Weighted Average (GWA) by subject grades and units. Instant weighted average for honors and scholarship tracking.',
    keywords: 'GWA calculator, general weighted average, grade calculator, GPA weighted',
  },
  about: {
    title: `About Us | ${brand}`,
    description:
      'Learn about StatsSuite — an interactive statistics learning platform with calculators, formulas, and step-by-step solutions for students and educators.',
    keywords: 'about StatsSuite, statistics learning platform, educational calculator',
  },
  contact: {
    title: `Contact Us | ${brand}`,
    description:
      'Contact StatsSuite for questions, feedback, or support about our free statistics and math calculators.',
    keywords: 'contact StatsSuite, support, feedback',
  },
  privacy: {
    title: `Privacy Policy | ${brand}`,
    description:
      'Read how StatsSuite handles privacy. Calculations run in your browser; we do not collect personal data entered into calculators.',
    keywords: 'privacy policy, data protection, StatsSuite privacy',
  },
  terms: {
    title: `Terms of Use | ${brand}`,
    description:
      'Terms of Use for StatsSuite. Educational tool provided as-is; review terms before using calculators for academic or professional work.',
    keywords: 'terms of use, terms and conditions, StatsSuite terms',
  },
};

/** Topic-level SEO overrides (title + description). Labels fill gaps automatically. */
const topicSeoOverrides = {
  'mean-ungrouped': {
    title: `Mean of Ungrouped Data Calculator | ${brand}`,
    description:
      'Calculate the arithmetic mean of ungrouped data with the formula, editable values, and a full step-by-step solution.',
    keywords: 'mean of ungrouped data, arithmetic mean calculator, average calculator',
  },
  'mean-ungrouped-table': {
    title: `Mean of Ungrouped Data (With Table) | ${brand}`,
    description:
      'Find the mean using a value–frequency table for ungrouped data, with fx products and clear calculation steps.',
    keywords: 'mean frequency table, ungrouped mean with table',
  },
  'mean-grouped': {
    title: `Mean of Grouped Data Calculator | ${brand}`,
    description:
      'Compute the mean of grouped data using class midpoints and frequencies, with formulas and worked steps.',
    keywords: 'mean of grouped data, class midpoint mean, grouped average',
  },
  'mean-frequency': {
    title: `Mean from Frequency Table Calculator | ${brand}`,
    description:
      'Calculate the mean when data is given in a frequency distribution table, with interactive inputs and solutions.',
    keywords: 'mean frequency distribution, frequency table mean',
  },
  'mean-weighted': {
    title: `Weighted Mean Calculator | ${brand}`,
    description:
      'Calculate the weighted mean from values and weights, with formula display and step-by-step working.',
    keywords: 'weighted mean calculator, weighted average',
  },
  'geom-mean-ungrouped': {
    title: `Geometric Mean of Ungrouped Data | ${brand}`,
    description:
      'Find the geometric mean of ungrouped positive values with the product formula and detailed steps.',
    keywords: 'geometric mean calculator, ungrouped geometric mean',
  },
  'geom-mean-grouped': {
    title: `Geometric Mean of Grouped Data | ${brand}`,
    description:
      'Calculate the geometric mean for grouped frequency data using midpoints and frequencies.',
    keywords: 'geometric mean grouped data, GM calculator',
  },
  'harm-mean-ungrouped': {
    title: `Harmonic Mean of Ungrouped Data | ${brand}`,
    description:
      'Compute the harmonic mean of ungrouped data with the reciprocal formula and step-by-step solution.',
    keywords: 'harmonic mean calculator, HM ungrouped',
  },
  'harm-mean-grouped': {
    title: `Harmonic Mean of Grouped Data | ${brand}`,
    description:
      'Calculate the harmonic mean for grouped or frequency data with clear formulas and worked examples.',
    keywords: 'harmonic mean grouped data, frequency harmonic mean',
  },
  'mode-ungrouped': {
    title: `Mode of Ungrouped Data Calculator | ${brand}`,
    description:
      'Find the mode — the most frequent value — in ungrouped data with instant results and explanations.',
    keywords: 'mode calculator, mode of ungrouped data',
  },
  'mode-frequency': {
    title: `Mode from Frequency Table Calculator | ${brand}`,
    description:
      'Locate the modal class and calculate the mode for grouped frequency distributions with the mode formula.',
    keywords: 'mode frequency table, modal class, grouped mode',
  },
  'median-ungrouped': {
    title: `Median of Ungrouped Data Calculator | ${brand}`,
    description:
      'Calculate the median of ungrouped data after sorting, with odd/even case handling and steps.',
    keywords: 'median calculator, median of ungrouped data',
  },
  'median-frequency': {
    title: `Median from Frequency Table Calculator | ${brand}`,
    description:
      'Find the median class and median value for grouped frequency data using cumulative frequencies.',
    keywords: 'median frequency table, grouped median, cumulative frequency median',
  },
  'quartile-ungrouped': {
    title: `Quartiles of Ungrouped Data Calculator | ${brand}`,
    description:
      'Calculate Q1, Q2, and Q3 for ungrouped data with formulas, positions, and step-by-step solutions.',
    keywords: 'quartile calculator, Q1 Q2 Q3, ungrouped quartiles',
  },
  'quartile-grouped': {
    title: `Quartiles of Grouped Data Calculator | ${brand}`,
    description:
      'Find quartiles for grouped frequency distributions using cumulative frequency and class boundaries.',
    keywords: 'grouped quartiles, quartile frequency table',
  },
  'decile-ungrouped': {
    title: `Decile of Ungrouped Data Calculator | ${brand}`,
    description:
      'Calculate any decile (D1–D9) for ungrouped data with selectable order and full working.',
    keywords: 'decile calculator, ungrouped decile',
  },
  'decile-frequency': {
    title: `Decile from Frequency Table Calculator | ${brand}`,
    description:
      'Compute deciles for frequency distributions using cumulative frequency and class interval formulas.',
    keywords: 'decile frequency table, grouped decile',
  },
  'percentile-ungrouped': {
    title: `Percentile of Ungrouped Data Calculator | ${brand}`,
    description:
      'Find any percentile for ungrouped data with a chosen order and clear calculation steps.',
    keywords: 'percentile calculator, ungrouped percentile',
  },
  'percentile-frequency': {
    title: `Percentile from Frequency Table Calculator | ${brand}`,
    description:
      'Calculate percentiles for grouped frequency data using cumulative frequency methods.',
    keywords: 'percentile frequency table, grouped percentile',
  },
  'range-ungrouped': {
    title: `Range of Ungrouped Data Calculator | ${brand}`,
    description:
      'Calculate the range of ungrouped data as highest minus lowest value, with coefficient of range options.',
    keywords: 'range calculator, range of ungrouped data',
  },
  'range-grouped': {
    title: `Range of Grouped Data Calculator | ${brand}`,
    description:
      'Find the range of grouped data from class boundaries or limits, with step-by-step explanation.',
    keywords: 'range of grouped data, class range',
  },
  'range-coefficient': {
    title: `Coefficient of Range Calculator | ${brand}`,
    description:
      'Calculate the coefficient of range = (Ymax − Ymin) / (Ymax + Ymin) as a relative measure of dispersion.',
    keywords: 'coefficient of range, relative range',
  },
  'qd-ungrouped': {
    title: `Quartile Deviation (Ungrouped) Calculator | ${brand}`,
    description:
      'Calculate quartile deviation (semi-interquartile range) for ungrouped data from Q1 and Q3.',
    keywords: 'quartile deviation, semi-interquartile range, QD calculator',
  },
  'qd-grouped': {
    title: `Quartile Deviation (Grouped) Calculator | ${brand}`,
    description:
      'Compute quartile deviation for grouped frequency data with Q1, Q3, and clear formulas.',
    keywords: 'quartile deviation grouped data, QD frequency table',
  },
  'qd-coefficient-ungrouped': {
    title: `Coefficient of Quartile Deviation (Ungrouped) | ${brand}`,
    description:
      'Calculate the coefficient of quartile deviation for ungrouped data using (Q₃ − Q₁) / (Q₃ + Q₁).',
    keywords: 'coefficient of quartile deviation, ungrouped, relative dispersion',
  },
  'qd-coefficient-grouped': {
    title: `Coefficient of Quartile Deviation (Grouped) | ${brand}`,
    description:
      'Calculate the coefficient of quartile deviation for grouped data using (Q₃ − Q₁) / (Q₃ + Q₁).',
    keywords: 'coefficient of quartile deviation, grouped data, relative dispersion',
  },
  'md-mean-ungrouped': {
    title: `Mean Deviation from Mean (Ungrouped) | ${brand}`,
    description:
      'Calculate mean deviation from the arithmetic mean for ungrouped data with absolute deviations.',
    keywords: 'mean deviation from mean, MD ungrouped',
  },
  'md-mean-grouped': {
    title: `Mean Deviation from Mean (Grouped) | ${brand}`,
    description:
      'Find mean deviation from the mean for grouped frequency data using midpoints and frequencies.',
    keywords: 'mean deviation grouped, MD from mean',
  },
  'md-median-ungrouped': {
    title: `Mean Deviation from Median (Ungrouped) | ${brand}`,
    description:
      'Calculate mean deviation about the median for ungrouped data with step-by-step absolute deviations.',
    keywords: 'mean deviation from median, MD median ungrouped',
  },
  'md-median-grouped': {
    title: `Mean Deviation from Median (Grouped) | ${brand}`,
    description:
      'Compute mean deviation from the median for grouped frequency distributions.',
    keywords: 'mean deviation median grouped',
  },
  'md-mode-ungrouped': {
    title: `Mean Deviation from Mode (Ungrouped) | ${brand}`,
    description:
      'Calculate mean deviation about the mode for ungrouped data with clear formulas and solutions.',
    keywords: 'mean deviation from mode, MD mode',
  },
  'md-mode-grouped': {
    title: `Mean Deviation from Mode (Grouped) | ${brand}`,
    description:
      'Find mean deviation from the mode for grouped frequency data using midpoints and frequencies.',
    keywords: 'mean deviation mode grouped',
  },
  'md-coeff-mean': {
    title: `Mean Coefficient of Dispersion | ${brand}`,
    description:
      'Calculate the mean coefficient of dispersion as M.D / Mean for relative dispersion about the mean.',
    keywords: 'mean coefficient of dispersion, MD/Mean',
  },
  'md-coeff-median': {
    title: `Median Coefficient of Dispersion | ${brand}`,
    description:
      'Calculate the median coefficient of dispersion as M.D / Median for relative dispersion about the median.',
    keywords: 'median coefficient of dispersion, MD/Median',
  },
  'variance-ungrouped': {
    title: `Variance of Ungrouped Data Calculator | ${brand}`,
    description:
      'Calculate population or sample variance for ungrouped data with formulas and worked steps.',
    keywords: 'variance calculator, ungrouped variance, sample variance',
  },
  'variance-grouped': {
    title: `Variance of Grouped Data Calculator | ${brand}`,
    description:
      'Compute variance for grouped frequency data using midpoints, frequencies, and step-by-step working.',
    keywords: 'variance grouped data, frequency variance',
  },
  'variance-coefficient': {
    title: `Coefficient of Variance Calculator | ${brand}`,
    description:
      'Calculate the coefficient of variance as (Variance / Mean) × 100 for relative variability.',
    keywords: 'coefficient of variance, CV calculator',
  },
  'sd-ungrouped': {
    title: `Standard Deviation (Ungrouped) Calculator | ${brand}`,
    description:
      'Calculate standard deviation for ungrouped data as the square root of variance, with full steps.',
    keywords: 'standard deviation calculator, SD ungrouped, sample SD',
  },
  'sd-grouped': {
    title: `Standard Deviation (Grouped) Calculator | ${brand}`,
    description:
      'Find standard deviation for grouped frequency distributions with midpoints and clear formulas.',
    keywords: 'standard deviation grouped data, SD frequency table',
  },
  'sd-coefficient': {
    title: `Coefficient of S.D Calculator | ${brand}`,
    description:
      'Calculate the coefficient of standard deviation as S.D / Mean for relative dispersion.',
    keywords: 'coefficient of SD, SD/Mean',
  },
  'freq-continuous': {
    title: `Continuous Frequency Table from Raw Data | ${brand}`,
    description:
      'Build a discrete or continuous frequency distribution from raw numerical data with class intervals and mid-values.',
    keywords: 'frequency table, continuous data, class interval, mid value',
  },
  'freq-categorical': {
    title: `Categorical Frequency Table Maker | ${brand}`,
    description:
      'Create a frequency table for categorical data and summarize category counts interactively.',
    keywords: 'categorical frequency table, qualitative data table',
  },
  'freq-open': {
    title: `Open Data Frequency Table | ${brand}`,
    description:
      'Form frequency tables from open numerical or alphabetic data with flexible classification.',
    keywords: 'open data frequency, alphabet frequency table',
  },
  'rel-frequency': {
    title: `Relative Frequency Distribution Calculator | ${brand}`,
    description:
      'Convert frequencies to relative frequencies and percentages for clear distribution analysis.',
    keywords: 'relative frequency, relative frequency distribution',
  },
  'cum-frequency': {
    title: `Cumulative Frequency Distribution Calculator | ${brand}`,
    description:
      'Build less-than and more-than cumulative frequency tables from class frequencies.',
    keywords: 'cumulative frequency, less than cf, more than cf',
  },
  'graphs-intro': {
    title: `Formation of Graphs from Data | ${brand}`,
    description:
      'Learn how statistical graphs are formed from data and choose the right chart for your dataset.',
    keywords: 'statistical graphs, data visualization basics',
  },
  'bar-simple': {
    title: `Simple Bar Diagram Maker | ${brand}`,
    description:
      'Create a simple bar diagram from categories and frequencies with an interactive chart.',
    keywords: 'simple bar chart, bar diagram calculator',
  },
  'bar-multiple': {
    title: `Multiple Bar Diagram Maker | ${brand}`,
    description:
      'Compare series side by side with a multiple bar diagram built from your frequency data.',
    keywords: 'multiple bar diagram, clustered bar chart',
  },
  'bar-subdivided': {
    title: `Sub-divided Bar Diagram Maker | ${brand}`,
    description:
      'Build subdivided (stacked) bar diagrams to show component parts within each category.',
    keywords: 'subdivided bar diagram, stacked bar chart',
  },
  'pie-graph': {
    title: `Pie Graph / Pie Chart Maker | ${brand}`,
    description:
      'Create a pie chart from frequencies with angles, percentages, and an interactive visualization.',
    keywords: 'pie chart maker, pie graph calculator, sector angle',
  },
  'histogram-equal': {
    title: `Histogram (Equal Class Width) Maker | ${brand}`,
    description:
      'Draw a histogram for continuous data with equal class widths from frequency tables.',
    keywords: 'histogram equal width, continuous histogram',
  },
  'histogram-unequal': {
    title: `Histogram (Unequal Class Width) Maker | ${brand}`,
    description:
      'Create histograms with unequal class widths using frequency density for accurate areas.',
    keywords: 'histogram unequal width, frequency density',
  },
  'histogram-discrete': {
    title: `Histogram for Discrete Data | ${brand}`,
    description:
      'Construct a histogram suitable for discrete data values and their frequencies.',
    keywords: 'discrete histogram, discrete data chart',
  },
  'polygon-frequency': {
    title: `Frequency Polygon Calculator | ${brand}`,
    description:
      'Draw a closed frequency polygon from mid-points of class boundaries and frequencies with an interactive table and chart.',
    keywords: 'frequency polygon, mid-point of class boundaries, closed polygon chart',
  },
  'polygon-cf-step-discrete': {
    title: `Cumulative Frequency Step Polygon (Discrete) | ${brand}`,
    description:
      'Build a cumulative frequency step (staircase) polygon for simple discrete data from values and frequencies.',
    keywords: 'cumulative frequency step polygon, discrete step chart, staircase ogive',
  },
  'polygon-crf': {
    title: `Cumulative Relative Frequency Polygon | ${brand}`,
    description:
      'Plot a cumulative relative frequency (ogive-style) polygon for continuous frequency data.',
    keywords: 'frequency polygon, cumulative relative frequency, ogive',
  },
  'polygon-crf-discrete': {
    title: `CRF Polygon for Discrete Data | ${brand}`,
    description:
      'Build a cumulative relative frequency polygon for discrete distributions.',
    keywords: 'discrete frequency polygon, CRF discrete',
  },
  'scatter-same': {
    title: `Scatter Plot for Same Variable | ${brand}`,
    description:
      'Compare paired observations of the same variable on a scatter plot with an equality reference line.',
    keywords: 'scatter plot same variable, equality line plot',
  },
  'scatter-different': {
    title: `Scatter Plot of Different Variables | ${brand}`,
    description:
      'Visualize the relationship between two different variables with an interactive scatter plot.',
    keywords: 'scatter plot, bivariate scatter, correlation plot',
  },
  'bivariate-freq': {
    title: `Bivariate Frequency Table Maker | ${brand}`,
    description:
      'Form a bivariate frequency table from paired data using class boundaries for both variables.',
    keywords: 'bivariate frequency table, two-way frequency table',
  },
  'prob-factorial': {
    title: `Factorial Calculator (n!) | ${brand}`,
    description:
      'Calculate n! = n × (n − 1) × … × 1 with step-by-step expansion for probability arrangements.',
    keywords: 'factorial calculator, n!, arrangements',
  },
  'prob-permutation': {
    title: `Permutation Calculator (nPr) | ${brand}`,
    description: 'Calculate nPr = n! / (n − r)! for arrangements where order matters.',
    keywords: 'permutation calculator, nPr, arrangements',
  },
  'prob-combination': {
    title: `Combination Calculator (nCr) | ${brand}`,
    description: 'Calculate nCr = n! / (r! (n − r)!) for selections where order does not matter.',
    keywords: 'combination calculator, nCr, combinations',
  },
  'prob-sample-space': {
    title: `Sample Space Calculator | ${brand}`,
    description:
      'Find sample space size as the product of outcome counts: S = n₁ × n₂ × … for any number of variables.',
    keywords: 'sample space, outcomes, probability sample space',
  },
  'prob-events': {
    title: `Types of Events in Probability | ${brand}`,
    description:
      'Learn simple, compound, mutually exclusive, and not mutually exclusive events before computing probability.',
    keywords: 'probability events, mutually exclusive, compound event',
  },
  'prob-probability': {
    title: `Probability Calculator P(A) | ${brand}`,
    description:
      'Compute P(A) = event outcomes / sample space, plus compound OR/AND and union formulas for exclusive events.',
    keywords: 'probability calculator, P(A), union probability',
  },
  'prob-conditional': {
    title: `Conditional Probability Calculator | ${brand}`,
    description:
      'Calculate P(A|B) = P(A ∩ B) / P(B) or P(B|A) = P(A ∩ B) / P(A) for dependent events.',
    keywords: 'conditional probability, P(A|B), dependent events',
  },
  'prob-independent': {
    title: `Independent Events Multiplication | ${brand}`,
    description:
      'Multiply probabilities for independent or related events: P(A ∩ B) = P(A)P(B|A) or P(A)P(B).',
    keywords: 'independent events, multiplication rule, P(A∩B)',
  },
};

function collectMenuItems(sections) {
  return sections.flatMap((section) => [
    ...section.items,
    ...(section.subsections?.flatMap((sub) => sub.items) ?? []),
  ]);
}

const allTopicItems = [
  ...collectMenuItems(menuSections),
  ...collectMenuItems(dispersionMenuSections),
  ...collectMenuItems(representationMenuSections),
  ...collectMenuItems(probabilityMenuSections),
  ...collectMenuItems(mathCalculatorMenuSections),
];

export const topicSeo = Object.fromEntries(
  allTopicItems.map((item) => {
    const override = topicSeoOverrides[item.id];
    if (override) return [item.id, override];
    return [
      item.id,
      {
        title: `${item.label} | ${brand}`,
        description: `Interactive ${item.label.toLowerCase()} tool on ${brand} with formulas and step-by-step solutions.`,
        keywords: `${item.label}, statistics calculator, ${brand}`,
      },
    ];
  }),
);

export const TOPIC_PARENT = {
  ...Object.fromEntries(collectMenuItems(menuSections).map((i) => [i.id, 'central-tendency'])),
  ...Object.fromEntries(
    collectMenuItems(dispersionMenuSections).map((i) => [i.id, 'measurement-of-dispersion']),
  ),
  ...Object.fromEntries(
    collectMenuItems(representationMenuSections).map((i) => [i.id, 'representation-of-data']),
  ),
  ...Object.fromEntries(collectMenuItems(probabilityMenuSections).map((i) => [i.id, 'probability'])),
  ...Object.fromEntries(
    collectMenuItems(mathCalculatorMenuSections).map((i) => [i.id, i.id]),
  ),
};

export const DEFAULT_TOPICS = {
  'central-tendency': 'mean-ungrouped',
  'measurement-of-dispersion': 'range-ungrouped',
  'representation-of-data': 'freq-continuous',
  probability: 'prob-factorial',
};

export function resolveSeo(pageId, topicId) {
  const page = pageSeo[pageId] ?? pageSeo.home;
  const topic = topicId ? topicSeo[topicId] : null;

  const title = topic?.title ?? page.title ?? siteSeo.defaultTitle;
  const description = topic?.description ?? page.description ?? siteSeo.defaultDescription;
  const keywords = [topic?.keywords, page.keywords, siteSeo.defaultKeywords]
    .filter(Boolean)
    .join(', ');

  const path =
    topicId && TOPIC_PARENT[topicId] && TOPIC_PARENT[topicId] !== topicId
      ? `/${TOPIC_PARENT[topicId]}/${topicId}`
      : pageId === 'home'
        ? '/'
        : `/${pageId}`;

  return {
    title,
    description,
    keywords,
    canonicalPath: path,
    pageId,
    topicId: topicId ?? null,
  };
}

export function buildJsonLd(seo) {
  const url = `${SITE_ORIGIN}${seo.canonicalPath === '/' ? '/' : seo.canonicalPath}`;
  const graph = [
    {
      '@type': 'WebSite',
      name: siteSeo.name,
      url: SITE_ORIGIN,
      description: siteSeo.defaultDescription,
      publisher: {
        '@type': 'Organization',
        name: siteSeo.name,
        url: SITE_ORIGIN,
        logo: `${SITE_ORIGIN}${siteSeo.ogImage}`,
      },
    },
    {
      '@type': 'WebApplication',
      name: siteSeo.name,
      url: SITE_ORIGIN,
      applicationCategory: 'EducationalApplication',
      operatingSystem: 'Any',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      description: siteSeo.defaultDescription,
    },
    {
      '@type': 'WebPage',
      name: seo.title,
      description: seo.description,
      url,
      isPartOf: { '@type': 'WebSite', name: siteSeo.name, url: SITE_ORIGIN },
    },
  ];

  if (seo.pageId === 'home') {
    graph.push({
      '@type': 'ItemList',
      name: `What You Will Learn on ${siteSeo.name}`,
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Central Tendency',
          url: `${SITE_ORIGIN}/central-tendency/mean-ungrouped`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Measurement of Dispersion',
          url: `${SITE_ORIGIN}/measurement-of-dispersion/range-ungrouped`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'Representation of Data',
          url: `${SITE_ORIGIN}/representation-of-data/freq-continuous`,
        },
        {
          '@type': 'ListItem',
          position: 4,
          name: 'Probability',
          url: `${SITE_ORIGIN}/probability/prob-factorial`,
        },
        {
          '@type': 'ListItem',
          position: 5,
          name: 'Math Calculators',
          url: `${SITE_ORIGIN}/basic-calculator`,
        },
      ],
    });
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  };
}
