export const menuSections = [
  {
    id: 'mean',
    label: 'Mean',
    items: [
      { id: 'mean-ungrouped', label: 'Mean of Ungrouped Data (Without Table)' },
      { id: 'mean-ungrouped-table', label: 'Mean of Ungrouped Data (With Table)' },
      { id: 'mean-grouped', label: 'Mean of Grouped Data' },
      { id: 'mean-frequency', label: 'Mean of Data Given in Frequency Table' },
      { id: 'mean-weighted', label: 'Weighted Mean' },
    ],
    subsections: [
      {
        id: 'geometric-mean',
        label: 'Geometric Mean',
        items: [
          { id: 'geom-mean-ungrouped', label: 'Geometric Mean of Ungrouped Data' },
          { id: 'geom-mean-grouped', label: 'Geometric Mean of Grouped Data' },
        ],
      },
      {
        id: 'harmonic-mean',
        label: 'Harmonic Mean',
        items: [
          { id: 'harm-mean-ungrouped', label: 'Harmonic Mean of Ungrouped Data' },
          { id: 'harm-mean-grouped', label: 'Harmonic Mean of Grouped Data' },
        ],
      },
    ],
  },
  {
    id: 'mode',
    label: 'Mode',
    items: [
      { id: 'mode-ungrouped', label: 'Mode of Ungrouped Data' },
      { id: 'mode-frequency', label: 'Mode of Data Given in Frequency Table' },
    ],
  },
  {
    id: 'median',
    label: 'Median',
    items: [
      { id: 'median-ungrouped', label: 'Median of Ungrouped Data' },
      { id: 'median-frequency', label: 'Median of Data Given in Frequency Table' },
    ],
  },
  {
    id: 'quartile',
    label: 'Quartile',
    items: [
      { id: 'quartile-ungrouped', label: 'Quartiles of Ungrouped Data' },
      { id: 'quartile-grouped', label: 'Quartiles of Grouped Data' },
    ],
  },
  {
    id: 'decile',
    label: 'Decile',
    items: [
      { id: 'decile-ungrouped', label: 'Decile of Ungrouped Data' },
      { id: 'decile-frequency', label: 'Decile of Data Given in Frequency Table' },
    ],
  },
  {
    id: 'percentile',
    label: 'Percentile',
    items: [
      { id: 'percentile-ungrouped', label: 'Percentile of Ungrouped Data' },
      { id: 'percentile-frequency', label: 'Percentile of Data Given in Frequency Table' },
    ],
  },
];

export function getSectionTopicIds(section) {
  const mainIds = section.items.map((item) => item.id);
  const subsectionIds =
    section.subsections?.flatMap((sub) => sub.items.map((item) => item.id)) ?? [];
  return [...mainIds, ...subsectionIds];
}
