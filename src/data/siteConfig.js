export const topNavItems = [
  {
    id: 'statics-calculation',
    label: 'Statics Calculation',
    children: [
      { id: 'central-tendency', label: 'Central Tendency Measurement' },
      { id: 'measurement-of-dispersion', label: 'Measurement of Dispersion' },
      { id: 'representation-of-data', label: 'Representation of Data' },
      { id: 'probability', label: 'Probability' },
    ],
  },
  {
    id: 'math-calculators',
    label: 'Math Calculators',
    children: [
      { id: 'basic-calculator', label: 'Basic Calculator' },
      { id: 'percentage-calculator', label: 'Percentage Calculator' },
      { id: 'finance-calculator', label: 'Finance Calculator' },
      { id: 'mortgage-calculator', label: 'Mortgage Calculator' },
      { id: 'loan-calculator', label: 'Loan Calculator' },
      { id: 'gwa-calculator', label: 'GWA Calculator' },
    ],
  },
  { id: 'about', label: 'About Us' },
  { id: 'contact', label: 'Contact Us' },
];

export const footerNavItems = [
  { id: 'privacy', label: 'Privacy Policy' },
  { id: 'terms', label: 'Terms of Use' },
];

export const siteConfig = {
  name: 'StatsSuite',
  tagline: 'Interactive Statistics Learning',
  logo: '/images/logo_statssuite.png',
  heroBanner: '/images/Hero banner StatsSuite.jpg',
};

/** Flatten dropdown groups for footer / link lists */
export function flattenNavItems(items = topNavItems) {
  return items.flatMap((item) => (item.children ? item.children : [item]));
}

export function isNavItemActive(item, activePage) {
  if (item.children) {
    return item.children.some((child) => child.id === activePage);
  }
  return item.id === activePage;
}
