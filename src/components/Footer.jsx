import { siteConfig, footerNavItems, topNavItems } from '../data/siteConfig';

function LinkList({ items, onNavigate }) {
  return (
    <ul className="mt-3 space-y-2">
      {items.map((item) => (
        <li key={item.id}>
          <button
            type="button"
            onClick={() => onNavigate(item.id)}
            className="text-left text-sm text-academic-600 transition-colors hover:text-blue-900"
          >
            {item.label}
          </button>
        </li>
      ))}
    </ul>
  );
}

export function Footer({ onNavigate }) {
  const year = new Date().getFullYear();
  const statsLinks =
    topNavItems.find((item) => item.id === 'statics-calculation')?.children ?? [];
  const mathLinks =
    topNavItems.find((item) => item.id === 'math-calculators')?.children ?? [];

  return (
    <footer className="mt-auto border-t border-academic-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-1">
            <h3 className="text-lg font-bold text-blue-900">{siteConfig.name}</h3>
            <p className="mt-2 text-sm leading-relaxed text-academic-600">
              {siteConfig.tagline}. Learn central tendency, data representation, frequency
              distributions, and graphs with interactive calculators and step-by-step solutions.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-blue-900">Stats Calculation</h3>
            <LinkList items={statsLinks} onNavigate={onNavigate} />
          </div>

          <div>
            <h3 className="text-lg font-bold text-blue-900">Math Calculator</h3>
            <LinkList items={mathLinks} onNavigate={onNavigate} />
          </div>

          <div>
            <h3 className="text-lg font-bold text-blue-900">Legal</h3>
            <ul className="mt-3 space-y-2">
              {[
                { id: 'about', label: 'About Us' },
                { id: 'contact', label: 'Contact Us' },
                ...footerNavItems,
              ].map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => onNavigate(item.id)}
                    className="text-sm text-academic-600 transition-colors hover:text-blue-900"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-academic-200 pt-6 text-center text-sm text-academic-500">
          <p>
            &copy; {year} {siteConfig.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
