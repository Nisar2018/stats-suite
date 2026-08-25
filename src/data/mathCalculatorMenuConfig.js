export const mathCalculatorMenuSections = [
  {
    id: 'math-calculators',
    label: 'Calculators',
    items: [
      { id: 'basic-calculator', label: 'Basic Calculator' },
      { id: 'percentage-calculator', label: 'Percentage Calculator' },
      { id: 'finance-calculator', label: 'Finance Calculator' },
      { id: 'mortgage-calculator', label: 'Mortgage Calculator' },
      { id: 'loan-calculator', label: 'Loan Calculator' },
      { id: 'gwa-calculator', label: 'GWA Calculator' },
    ],
  },
];

export function getMathCalculatorSectionTopicIds(section) {
  return section.items.map((item) => item.id);
}

export const mathCalculatorLabels = Object.fromEntries(
  mathCalculatorMenuSections[0].items.map((item) => [item.id, item.label]),
);
