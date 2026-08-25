export const probabilityMenuSections = [
  {
    id: 'arrangements',
    label: 'Arrangements',
    items: [
      { id: 'prob-factorial', label: 'Factorial' },
      { id: 'prob-permutation', label: 'Permutation' },
      { id: 'prob-combination', label: 'Combination' },
    ],
  },
  {
    id: 'sample-space',
    label: 'Sample Space',
    items: [{ id: 'prob-sample-space', label: 'Sample Space' }],
  },
  {
    id: 'events',
    label: 'Events',
    items: [{ id: 'prob-events', label: 'Types of Events' }],
  },
  {
    id: 'probability',
    label: 'Probability',
    items: [{ id: 'prob-probability', label: 'Probability' }],
  },
  {
    id: 'conditional-probability',
    label: 'Conditional Probability',
    items: [{ id: 'prob-conditional', label: 'Conditional Probability' }],
  },
  {
    id: 'independent-events',
    label: 'Independent Events',
    items: [{ id: 'prob-independent', label: 'Multiplication of Independent Events' }],
  },
];

export const probabilityTopicTitles = Object.fromEntries(
  probabilityMenuSections.flatMap((section) =>
    section.items.map((item) => [item.id, item.label]),
  ),
);

export function getProbabilitySectionTopicIds(section) {
  return section.items.map((item) => item.id);
}
