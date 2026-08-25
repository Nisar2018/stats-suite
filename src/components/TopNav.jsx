import { useState } from 'react';
import { siteConfig, topNavItems, isNavItemActive } from '../data/siteConfig';

function ChevronDown({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

function NavDropdown({ item, activePage, onNavigate }) {
  const [open, setOpen] = useState(false);
  const isActive = isNavItemActive(item, activePage);

  const handleChildClick = (pageId) => {
    onNavigate(pageId);
    setOpen(false);
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
          isActive
            ? 'bg-white/20 text-white'
            : 'text-blue-100 hover:bg-white/10 hover:text-white'
        }`}
        aria-expanded={open}
        aria-haspopup="true"
      >
        {item.label}
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 min-w-[240px] pt-1">
          <ul
            className="overflow-hidden rounded-lg border border-academic-200 bg-white py-1 shadow-lg"
            role="menu"
          >
            {item.children.map((child) => (
              <li key={child.id} role="none">
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => handleChildClick(child.id)}
                  className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
                    activePage === child.id
                      ? 'bg-blue-50 font-semibold text-blue-900'
                      : 'text-academic-700 hover:bg-academic-50 hover:text-blue-900'
                  }`}
                >
                  {child.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function MobileNavGroup({ item, activePage, onNavigate }) {
  const [expanded, setExpanded] = useState(isNavItemActive(item, activePage));
  const isActive = isNavItemActive(item, activePage);

  return (
    <li>
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        className={`flex w-full items-center justify-between rounded-md px-3 py-2.5 text-left text-sm font-medium transition-colors ${
          isActive
            ? 'bg-white/20 text-white'
            : 'text-blue-100 hover:bg-white/10 hover:text-white'
        }`}
        aria-expanded={expanded}
      >
        {item.label}
        <ChevronDown className={`h-4 w-4 transition-transform ${expanded ? 'rotate-180' : ''}`} />
      </button>
      {expanded && (
        <ul className="mt-1 space-y-1 border-l border-white/20 pl-3">
          {item.children.map((child) => (
            <li key={child.id}>
              <button
                type="button"
                onClick={() => onNavigate(child.id)}
                className={`w-full rounded-md px-3 py-2 text-left text-sm transition-colors ${
                  activePage === child.id
                    ? 'bg-white/20 font-semibold text-white'
                    : 'text-blue-100 hover:bg-white/10 hover:text-white'
                }`}
              >
                {child.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

export function TopNav({ activePage, onNavigate }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNavigate = (page) => {
    onNavigate(page);
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-navy shadow-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
        <button
          type="button"
          onClick={() => handleNavigate('home')}
          className="flex shrink-0 items-center gap-3 rounded-md transition-opacity hover:opacity-90"
          aria-label="Go to home page"
        >
          <img
            src={siteConfig.logo}
            alt={`${siteConfig.name} logo`}
            className="h-10 w-auto object-contain md:h-12"
            onError={(e) => {
              const target = e.currentTarget;
              target.style.display = 'none';
              const fallback = target.nextElementSibling;
              if (fallback) fallback.style.display = 'flex';
            }}
          />
          <span
            className="hidden h-10 w-10 items-center justify-center rounded-full bg-white/10 text-lg font-bold text-white md:flex"
            style={{ display: 'none' }}
            aria-hidden="true"
          >
            Σ
          </span>
          <span className="hidden text-lg font-bold text-white sm:inline">{siteConfig.name}</span>
        </button>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main menu">
          {topNavItems.map((item) =>
            item.children ? (
              <NavDropdown
                key={item.id}
                item={item}
                activePage={activePage}
                onNavigate={handleNavigate}
              />
            ) : (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavigate(item.id)}
                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  activePage === item.id
                    ? 'bg-white/20 text-white'
                    : 'text-blue-100 hover:bg-white/10 hover:text-white'
                }`}
                aria-current={activePage === item.id ? 'page' : undefined}
              >
                {item.label}
              </button>
            ),
          )}
        </nav>

        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          className="rounded-md p-2 text-white hover:bg-white/10 lg:hidden"
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {mobileOpen && (
        <nav
          className="border-t border-white/10 px-4 py-3 lg:hidden"
          aria-label="Mobile menu"
        >
          <ul className="space-y-1">
            {topNavItems.map((item) =>
              item.children ? (
                <MobileNavGroup
                  key={item.id}
                  item={item}
                  activePage={activePage}
                  onNavigate={handleNavigate}
                />
              ) : (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => handleNavigate(item.id)}
                    className={`w-full rounded-md px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                      activePage === item.id
                        ? 'bg-white/20 text-white'
                        : 'text-blue-100 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                </li>
              ),
            )}
          </ul>
        </nav>
      )}
    </header>
  );
}
