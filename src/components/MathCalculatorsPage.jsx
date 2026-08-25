import { useState } from 'react';
import {
  getMathCalculatorSectionTopicIds,
  mathCalculatorLabels,
  mathCalculatorMenuSections,
} from '../data/mathCalculatorMenuConfig';
import { Sidebar } from './Sidebar';
import { BasicCalculatorContent } from './calculators/BasicCalculatorContent';
import { PercentageCalculatorContent } from './calculators/PercentageCalculatorContent';
import { FinanceCalculatorContent } from './calculators/FinanceCalculatorContent';
import { MortgageCalculatorContent } from './calculators/MortgageCalculatorContent';
import { LoanCalculatorContent } from './calculators/LoanCalculatorContent';
import { GWACalculatorContent } from './calculators/GWACalculatorContent';

const defaultExpanded = { 'math-calculators': true };

export function MathCalculatorsPage({ activeCalculator, onNavigate }) {
  const [expandedSections, setExpandedSections] = useState(defaultExpanded);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const pageLabel = mathCalculatorLabels[activeCalculator] ?? 'Math Calculators';

  const handleToggleSection = (sectionId) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const handleSelectTopic = (topicId) => {
    onNavigate(topicId);
    setSidebarOpen(false);
  };

  const renderContent = () => {
    if (activeCalculator === 'basic-calculator') {
      return <BasicCalculatorContent />;
    }

    if (activeCalculator === 'percentage-calculator') {
      return <PercentageCalculatorContent />;
    }

    if (activeCalculator === 'finance-calculator') {
      return <FinanceCalculatorContent />;
    }

    if (activeCalculator === 'mortgage-calculator') {
      return <MortgageCalculatorContent />;
    }

    if (activeCalculator === 'loan-calculator') {
      return <LoanCalculatorContent />;
    }

    if (activeCalculator === 'gwa-calculator') {
      return <GWACalculatorContent />;
    }

    return null;
  };

  return (
    <div className="flex min-h-0 flex-1 bg-gradient-to-br from-academic-100/80 via-academic-50 to-blue-50/40">
      <Sidebar
        sections={mathCalculatorMenuSections}
        activeTopic={activeCalculator}
        expandedSections={expandedSections}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        onToggleSection={handleToggleSection}
        onSelectTopic={handleSelectTopic}
        moduleTitle="Math"
        moduleSubtitle="Calculators"
        sectionLabel="Math Calculators"
        getSectionTopicIds={getMathCalculatorSectionTopicIds}
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
          <span className="min-w-0 truncate font-semibold text-blue-900">{pageLabel}</span>
        </div>

        <nav
          className="border-b border-academic-200 bg-white px-4 py-2 text-xs text-academic-600 sm:px-6"
          aria-label="Breadcrumb"
        >
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <button
                type="button"
                onClick={() => onNavigate('home')}
                className="text-blue-800 transition-colors hover:underline"
              >
                Home
              </button>
            </li>
            <li aria-hidden="true">/</li>
            <li className="font-semibold text-blue-900">{pageLabel}</li>
          </ol>
        </nav>

        <main className="flex-1 overflow-y-auto">{renderContent()}</main>
      </div>
    </div>
  );
}
