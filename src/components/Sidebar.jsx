import { getSectionTopicIds as defaultGetSectionTopicIds } from '../data/menuConfig';

function ChevronIcon({ expanded }) {
  return (
    <svg
      className={`h-4 w-4 shrink-0 transition-transform duration-300 ${expanded ? 'rotate-90' : ''}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}

function TopicButton({ item, isActive, onSelectTopic, indent = 'ml-5' }) {
  return (
    <li>
      <button
        type="button"
        onClick={() => onSelectTopic(item.id)}
        className={`${indent} mt-0.5 w-[calc(100%-1.25rem)] rounded-lg px-3 py-2 text-left text-sm transition-colors duration-200 ${
          isActive
            ? 'border-l-4 border-blue-500 bg-blue-50 font-semibold text-blue-800'
            : 'border-l-4 border-transparent text-academic-600 hover:bg-academic-50 hover:text-academic-800'
        }`}
        aria-current={isActive ? 'page' : undefined}
      >
        {item.label}
      </button>
    </li>
  );
}

export function Sidebar({
  sections,
  activeTopic,
  expandedSections,
  sidebarOpen,
  onToggleSidebar,
  onToggleSection,
  onSelectTopic,
  moduleTitle = 'Statistics',
  moduleSubtitle = 'Central Tendency',
  sectionLabel = 'Central Tendency Measurement',
  getSectionTopicIds = defaultGetSectionTopicIds,
}) {
  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 top-16 z-20 bg-black/30 md:hidden"
          onClick={onToggleSidebar}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed bottom-0 left-0 top-16 z-30 flex w-72 shrink-0 flex-col border-r border-academic-200 bg-white shadow-lg transition-transform duration-300 ease-in-out md:static md:top-auto md:h-auto md:translate-x-0 md:shadow-none ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-academic-200 px-5 py-4">
          <div>
            <h1 className="text-lg font-bold text-blue-900">{moduleTitle}</h1>
            <p className="text-xs font-medium text-blue-900/60">{moduleSubtitle}</p>
          </div>
          <button
            type="button"
            onClick={onToggleSidebar}
            className="rounded-md p-1.5 text-academic-500 hover:bg-academic-100 md:hidden"
            aria-label="Close sidebar"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Main navigation">
          <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-academic-400">
            {sectionLabel}
          </p>

          <ul className="space-y-1">
            {sections.map((section) => {
              const isExpanded = expandedSections[section.id];
              const sectionTopicIds = getSectionTopicIds(section);
              const hasActiveChild = sectionTopicIds.includes(activeTopic);

              return (
                <li key={section.id}>
                  <button
                    type="button"
                    onClick={() => onToggleSection(section.id)}
                    className={`flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-semibold transition-colors duration-200 ${
                      hasActiveChild
                        ? 'bg-academic-100 text-academic-800'
                        : 'text-academic-700 hover:bg-academic-50'
                    }`}
                    aria-expanded={isExpanded}
                  >
                    <ChevronIcon expanded={isExpanded} />
                    {section.label}
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <ul className="pb-1">
                      {section.items.map((item) => (
                        <TopicButton
                          key={item.id}
                          item={item}
                          isActive={activeTopic === item.id}
                          onSelectTopic={onSelectTopic}
                        />
                      ))}

                      {section.subsections?.map((subsection) => {
                        const isSubExpanded = expandedSections[subsection.id];
                        const subsectionHasActive = subsection.items.some(
                          (item) => item.id === activeTopic,
                        );

                        return (
                          <li key={subsection.id} className="mt-1">
                            <button
                              type="button"
                              onClick={() => onToggleSection(subsection.id)}
                              className={`ml-5 flex w-[calc(100%-1.25rem)] items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-semibold transition-colors duration-200 ${
                                subsectionHasActive
                                  ? 'bg-academic-100 text-academic-800'
                                  : 'text-academic-700 hover:bg-academic-50'
                              }`}
                              aria-expanded={isSubExpanded}
                            >
                              <ChevronIcon expanded={isSubExpanded} />
                              {subsection.label}
                            </button>

                            <div
                              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                isSubExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                              }`}
                            >
                              <ul className="pb-1">
                                {subsection.items.map((item) => (
                                  <TopicButton
                                    key={item.id}
                                    item={item}
                                    isActive={activeTopic === item.id}
                                    onSelectTopic={onSelectTopic}
                                    indent="ml-9"
                                  />
                                ))}
                              </ul>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
}
