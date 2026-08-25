import { useEffect, useState } from 'react';
import {
  probabilityMenuSections,
  getProbabilitySectionTopicIds,
} from '../data/probabilityMenuConfig';
import { Sidebar } from './Sidebar';
import { ProbabilityContentArea } from './ProbabilityContentArea';

const defaultExpanded = {
  arrangements: true,
  'sample-space': false,
  events: false,
  probability: false,
  'conditional-probability': false,
  'independent-events': false,
};

export function ProbabilityPage({ initialTopic = 'prob-factorial', onTopicChange }) {
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

    const section = probabilityMenuSections.find((s) =>
      s.items.some((item) => item.id === topicId),
    );
    if (section) {
      setExpandedSections((prev) => ({ ...prev, [section.id]: true }));
    }
  };

  return (
    <div className="flex min-h-0 flex-1 bg-gradient-to-br from-academic-100/80 via-academic-50 to-blue-50/40">
      <Sidebar
        sections={probabilityMenuSections}
        activeTopic={activeTopic}
        expandedSections={expandedSections}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        onToggleSection={handleToggleSection}
        onSelectTopic={handleSelectTopic}
        moduleTitle="Statistics"
        moduleSubtitle="Probability"
        sectionLabel="Probability"
        getSectionTopicIds={getProbabilitySectionTopicIds}
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
          <span className="min-w-0 truncate font-semibold text-blue-900">Probability</span>
        </div>

        <ProbabilityContentArea activeTopic={activeTopic} />
      </div>
    </div>
  );
}
