export const representationMenuSections = [
  {
    id: 'frequency-formation',
    label: 'Formation of Frequency Table',
    items: [
      { id: 'freq-continuous', label: 'Discrete & Continuous Data (Raw Form)' },
      { id: 'freq-categorical', label: 'Categorical Data' },
      { id: 'freq-open', label: 'Open Data (Numerical & Alphabet)' },
    ],
  },
  {
    id: 'relative-frequency',
    label: 'Relative Frequency',
    items: [{ id: 'rel-frequency', label: 'Relative Frequency Distribution' }],
  },
  {
    id: 'cumulative-frequency',
    label: 'Cumulative Frequency',
    items: [{ id: 'cum-frequency', label: 'Cumulative Frequency Distribution' }],
  },
  {
    id: 'bar-diagrams',
    label: 'Bar Diagrams & Graphs',
    items: [
      { id: 'graphs-intro', label: 'Formation of Graphs from Data' },
      { id: 'bar-simple', label: 'Simple Bar Diagram' },
      { id: 'bar-multiple', label: 'Multiple Bar Diagram' },
      { id: 'bar-subdivided', label: 'Sub-divided Bar Diagram' },
    ],
  },
  {
    id: 'pie-histogram',
    label: 'Pie Graph & Histogram',
    items: [
      { id: 'pie-graph', label: 'Pie Graph' },
      { id: 'histogram-equal', label: 'Histogram (Equal Class Width)' },
      { id: 'histogram-unequal', label: 'Histogram (Unequal Class Width)' },
      { id: 'histogram-discrete', label: 'Histogram for Discrete Data' },
    ],
  },
  {
    id: 'polygon',
    label: 'Polygon',
    items: [
      { id: 'polygon-frequency', label: 'Frequency Polygon' },
      { id: 'polygon-cf-step-discrete', label: 'Cumulative Frequency Step Polygon (Discrete)' },
      { id: 'polygon-crf', label: 'Cumulative Relative Frequency Polygon' },
      { id: 'polygon-crf-discrete', label: 'Cumulative Relative Frequency Polygon (Discrete)' },
    ],
  },
  {
    id: 'scatter-plot',
    label: 'Scatter Plot',
    items: [
      { id: 'scatter-same', label: 'Scatter Plot for Same Variable' },
      { id: 'scatter-different', label: 'Scatter Plot of Different Variables' },
      { id: 'bivariate-freq', label: 'Frequency Table from Bivariate Data' },
    ],
  },
];

export const representationTopicTitles = Object.fromEntries(
  representationMenuSections.flatMap((section) =>
    section.items.map((item) => [item.id, item.label]),
  ),
);

export function getRepresentationSectionTopicIds(section) {
  return section.items.map((item) => item.id);
}
