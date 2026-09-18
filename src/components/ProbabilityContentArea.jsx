import {
  probabilityMenuSections,
  probabilityTopicTitles,
} from '../data/probabilityMenuConfig';
import {
  FactorialContent,
  PermutationContent,
  CombinationContent,
} from './probability/ArrangementsContent';
import { SampleSpaceContent } from './probability/SampleSpaceContent';
import { EventsContent } from './probability/EventsContent';
import { ProbabilityCalcContent } from './probability/ProbabilityCalcContent';
import { ConditionalProbabilityContent } from './probability/ConditionalProbabilityContent';
import { IndependentEventsContent } from './probability/IndependentEventsContent';
import { TopicHeader } from './TopicHeader';

function getBreadcrumb(topicId) {
  for (const section of probabilityMenuSections) {
    if (section.items.some((item) => item.id === topicId)) {
      return `Probability › ${section.label}`;
    }
  }
  return 'Probability';
}

export function ProbabilityContentArea({ activeTopic }) {
  const renderContent = () => {
    switch (activeTopic) {
      case 'prob-factorial':
        return <FactorialContent />;
      case 'prob-permutation':
        return <PermutationContent />;
      case 'prob-combination':
        return <CombinationContent />;
      case 'prob-sample-space':
        return <SampleSpaceContent />;
      case 'prob-events':
        return <EventsContent />;
      case 'prob-probability':
        return <ProbabilityCalcContent />;
      case 'prob-conditional':
        return <ConditionalProbabilityContent />;
      case 'prob-independent':
        return <IndependentEventsContent />;
      default:
        return null;
    }
  };

  return (
    <main className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto px-3 py-4 sm:px-5 sm:py-5 md:px-8 md:py-8">
      <article className="mx-auto w-full min-w-0 rounded-xl border-2 border-academic-200 bg-white p-4 shadow-md ring-1 ring-academic-100 sm:p-6 md:p-8 lg:p-10">
        <TopicHeader
          breadcrumb={getBreadcrumb(activeTopic)}
          title={probabilityTopicTitles[activeTopic]}
        />
        <div className="min-w-0 space-y-6">{renderContent()}</div>
      </article>
    </main>
  );
}
