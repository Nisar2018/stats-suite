import { useEffect, useState } from 'react';
import { representationMenuSections, getRepresentationSectionTopicIds } from '../data/representationMenuConfig';
import { Sidebar } from './Sidebar';
import { RepresentationContentArea } from './RepresentationContentArea';

const defaultExpanded = {
  'frequency-formation': true,
  'relative-frequency': false,
  'cumulative-frequency': false,
  'bar-diagrams': false,
  'pie-histogram': false,
  polygon: false,
  'scatter-plot': false,
};

export function RepresentationOfDataPage({
  initialTopic = 'freq-continuous',
  onTopicChange,
}) {
  const [activeTopic, setActiveTopic] = useState(initialTopic);
  const [expandedSections, setExpandedSections] = useState(defaultExpanded);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (initialTopic && initialTopic !== activeTopic) {
      setActiveTopic(initialTopic);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialTopic]);

  const handleToggleSection = (sectionId) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const handleSelectTopic = (topicId) => {
    setActiveTopic(topicId);
    onTopicChange?.(topicId);
    setSidebarOpen(false);

    const section = representationMenuSections.find((s) =>
      s.items.some((item) => item.id === topicId),
    );
    if (section) {
      setExpandedSections((prev) => ({ ...prev, [section.id]: true }));
    }
  };

  return (
    <div className="flex min-h-0 flex-1 bg-gradient-to-br from-academic-100/80 via-academic-50 to-blue-50/40">
      <Sidebar
        sections={representationMenuSections}
        activeTopic={activeTopic}
        expandedSections={expandedSections}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        onToggleSection={handleToggleSection}
        onSelectTopic={handleSelectTopic}
        moduleTitle="Statistics"
        moduleSubtitle="Data Representation"
        sectionLabel="Representation of Data"
        getSectionTopicIds={getRepresentationSectionTopicIds}
      />

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-academic-200 bg-white/95 px-3 py-3 shadow-sm backdrop-blur sm:px-4 md:hidden">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="shrink-0 rounded-md p-2 text-academic-600 hover:bg-academic-100"
            aria-label="Open sidebar"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="min-w-0 truncate font-semibold text-blue-900">Representation of Data</span>
        </div>

        <RepresentationContentArea activeTopic={activeTopic} />
      </div>
    </div>
  );
}
