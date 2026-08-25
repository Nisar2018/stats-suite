export const dispersionMenuSections = [
  {
    id: 'range',
    label: 'Range',
    items: [
      { id: 'range-ungrouped', label: 'Range of Ungrouped Data' },
      { id: 'range-grouped', label: 'Range of Grouped Data' },
      { id: 'range-coefficient', label: 'Coefficient of Range' },
    ],
  },
  {
    id: 'quartile-deviation',
    label: 'Quartile Deviation',
    items: [
      { id: 'qd-ungrouped', label: 'Quartile Deviation (Ungrouped Data)' },
      { id: 'qd-grouped', label: 'Quartile Deviation (Grouped Data)' },
      { id: 'qd-coefficient-ungrouped', label: 'Coefficient of Quartile Deviation (Ungrouped Data)' },
      { id: 'qd-coefficient-grouped', label: 'Coefficient of Quartile Deviation (Grouped Data)' },
    ],
  },
  {
    id: 'mean-deviation',
    label: 'Mean Deviation',
    items: [
      { id: 'md-mean-ungrouped', label: 'Mean Deviation from Mean (Ungrouped)' },
      { id: 'md-mean-grouped', label: 'Mean Deviation from Mean (Grouped)' },
      { id: 'md-median-ungrouped', label: 'Mean Deviation from Median (Ungrouped)' },
      { id: 'md-median-grouped', label: 'Mean Deviation from Median (Grouped)' },
      { id: 'md-mode-ungrouped', label: 'Mean Deviation from Mode (Ungrouped)' },
      { id: 'md-mode-grouped', label: 'Mean Deviation from Mode (Grouped)' },
      { id: 'md-coeff-mean', label: 'Mean Coefficient of Dispersion' },
      { id: 'md-coeff-median', label: 'Median Coefficient of Dispersion' },
    ],
  },
  {
    id: 'variance',
    label: 'Variance',
    items: [
      { id: 'variance-ungrouped', label: 'Variance of Ungrouped Data' },
      { id: 'variance-grouped', label: 'Variance of Grouped Data' },
      { id: 'variance-coefficient', label: 'Coefficient of Variance' },
    ],
  },
  {
    id: 'standard-deviation',
    label: 'Standard Deviation',
    items: [
      { id: 'sd-ungrouped', label: 'Standard Deviation (Ungrouped Data)' },
      { id: 'sd-grouped', label: 'Standard Deviation (Grouped Data)' },
      { id: 'sd-coefficient', label: 'Coefficient of S.D' },
    ],
  },
];

export const dispersionTopicTitles = Object.fromEntries(
  dispersionMenuSections.flatMap((section) =>
    section.items.map((item) => [item.id, item.label]),
  ),
);

export function getDispersionSectionTopicIds(section) {
  return section.items.map((item) => item.id);
}
