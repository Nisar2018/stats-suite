import { useEffect, useState } from 'react';
import { menuSections } from '../data/menuConfig';
import { Sidebar } from './Sidebar';
import { ContentArea } from './ContentArea';
const defaultExpanded = {
  mean: true,
  mode: false,
  median: false,
  quartile: false,
  decile: false,
  percentile: false,
  'geometric-mean': false,
  'harmonic-mean': false,
};

export function CentralTendencyPage({ initialTopic = 'mean-ungrouped', onTopicChange }) {
  const [activeTopic, setActiveTopic] = useState(initialTopic);
  const [expandedSections, setExpandedSections] = useState(defaultExpanded);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (initialTopic && initialTopic !== activeTopic) {
      setActiveTopic(initialTopic);
    }
    // Sync from URL/hash only when parent topic changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialTopic]);

  const handleToggleSection = (sectionId) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const getSectionId = (topicId) => {
    if (
      topicId.startsWith('geom-mean') ||
      topicId.startsWith('harm-mean') ||
      topicId.startsWith('mean')
    ) {
      return 'mean';
    }
    if (topicId.startsWith('quartile')) return 'quartile';
    if (topicId.startsWith('decile')) return 'decile';
    if (topicId.startsWith('percentile')) return 'percentile';
    if (topicId.startsWith('median')) return 'median';
    if (topicId.startsWith('mode')) return 'mode';
    return topicId.split('-')[0];
  };

  const getSubsectionId = (topicId) => {
    if (topicId.startsWith('geom-mean')) return 'geometric-mean';
    if (topicId.startsWith('harm-mean')) return 'harmonic-mean';
    return null;
  };

  const handleSelectTopic = (topicId) => {
    setActiveTopic(topicId);
    onTopicChange?.(topicId);
    setSidebarOpen(false);

    const sectionId = getSectionId(topicId);
    const subsectionId = getSubsectionId(topicId);
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: true,
      ...(subsectionId ? { [subsectionId]: true } : {}),
    }));
  };

  return (
    <div className="flex min-h-0 flex-1 bg-gradient-to-br from-academic-100/80 via-academic-50 to-blue-50/40">
      <Sidebar
        sections={menuSections}
        activeTopic={activeTopic}
        expandedSections={expandedSections}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        onToggleSection={handleToggleSection}
        onSelectTopic={handleSelectTopic}
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
          <span className="min-w-0 truncate font-semibold text-blue-900">Central Tendency</span>
        </div>

        <ContentArea activeTopic={activeTopic} />
      </div>
    </div>
  );
}