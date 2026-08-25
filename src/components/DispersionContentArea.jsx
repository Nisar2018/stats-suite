import {
  dispersionMenuSections,
  dispersionTopicTitles,
} from '../data/dispersionMenuConfig';
import { RangeContent } from './dispersion/RangeContent';
import { QuartileDeviationContent } from './dispersion/QuartileDeviationContent';
import { MeanDeviationContent } from './dispersion/MeanDeviationContent';
import { VarianceContent, StandardDeviationContent } from './dispersion/VarianceSdContent';

function getBreadcrumb(topicId) {
  for (const section of dispersionMenuSections) {
    if (section.items.some((item) => item.id === topicId)) {
      return `Measurement of Dispersion › ${section.label}`;
    }
  }
  return 'Measurement of Dispersion';
}

export function DispersionContentArea({ activeTopic }) {
  const renderContent = () => {
    if (activeTopic.startsWith('range-')) {
      return <RangeContent topicId={activeTopic} />;
    }
    if (activeTopic.startsWith('qd-')) {
      return <QuartileDeviationContent topicId={activeTopic} />;
    }
    if (activeTopic.startsWith('md-')) {
      return <MeanDeviationContent topicId={activeTopic} />;
    }
    if (activeTopic.startsWith('variance-')) {
      return <VarianceContent topicId={activeTopic} />;
    }
    if (activeTopic.startsWith('sd-')) {
      return <StandardDeviationContent topicId={activeTopic} />;
    }
    return null;
  };

  return (
    <main className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto px-3 py-4 sm:px-5 sm:py-5 md:px-8 md:py-8">
      <article className="mx-auto w-full min-w-0 rounded-xl border-2 border-academic-200 bg-white p-4 shadow-md ring-1 ring-academic-100 sm:p-6 md:p-8 lg:p-10">
        <p className="mb-1 break-words text-xs font-medium text-blue-900/60 sm:text-sm">
          {getBreadcrumb(activeTopic)}
        </p>
        <h1 className="mb-4 break-words text-xl font-bold leading-tight text-blue-900 sm:mb-6 sm:text-2xl md:text-3xl">
          {dispersionTopicTitles[activeTopic]}
        </h1>
        <div className="min-w-0 space-y-6">{renderContent()}</div>
      </article>
    </main>
  );
}
