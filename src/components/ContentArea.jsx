import { MeanContent } from './MeanContent';
import { GeometricMeanContent } from './GeometricMeanContent';
import { HarmonicMeanContent } from './HarmonicMeanContent';
import { ModeContent } from './ModeContent';
import { MedianContent } from './MedianContent';
import { QuartileContent } from './QuartileContent';
import { DecileContent } from './DecileContent';
import { PercentileContent } from './PercentileContent';
import { TopicHeader } from './TopicHeader';

const topicTitles = {
  'mean-ungrouped': 'Mean of Ungrouped Data (Without Table)',
  'mean-ungrouped-table': 'Mean of Ungrouped Data (With Table)',
  'mean-grouped': 'Mean of Grouped Data',
  'mean-frequency': 'Mean of Data Given in Frequency Table',
  'mean-weighted': 'Weighted Mean',
  'geom-mean-ungrouped': 'Geometric Mean of Ungrouped Data',
  'geom-mean-grouped': 'Geometric Mean of Grouped Data',
  'harm-mean-ungrouped': 'Harmonic Mean of Ungrouped Data',
  'harm-mean-grouped': 'Harmonic Mean of Grouped Data',
  'mode-ungrouped': 'Mode of Ungrouped Data',
  'mode-frequency': 'Mode of Data Given in Frequency Table',
  'median-ungrouped': 'Median of Ungrouped Data',
  'median-frequency': 'Median of Data Given in Frequency Table',
  'quartile-ungrouped': 'Quartiles of Ungrouped Data',
  'quartile-grouped': 'Quartiles of Grouped Data',
  'decile-ungrouped': 'Decile of Ungrouped Data',
  'decile-frequency': 'Decile of Data Given in Frequency Table',
  'percentile-ungrouped': 'Percentile of Ungrouped Data',
  'percentile-frequency': 'Percentile of Data Given in Frequency Table',
};

function getBreadcrumb(topicId) {
  if (topicId.startsWith('geom-mean')) return 'Central Tendency › Mean › Geometric Mean';
  if (topicId.startsWith('harm-mean')) return 'Central Tendency › Mean › Harmonic Mean';
  if (topicId.startsWith('mean')) return 'Central Tendency › Mean';
  if (topicId.startsWith('mode')) return 'Central Tendency › Mode';
  if (topicId.startsWith('median')) return 'Central Tendency › Median';
  if (topicId.startsWith('quartile')) return 'Central Tendency › Quartile';
  if (topicId.startsWith('decile')) return 'Central Tendency › Decile';
  if (topicId.startsWith('percentile')) return 'Central Tendency › Percentile';
  return 'Central Tendency';
}

export function ContentArea({ activeTopic }) {
  const renderContent = () => {
    if (activeTopic.startsWith('geom-mean')) {
      return <GeometricMeanContent topicId={activeTopic} />;
    }
    if (activeTopic.startsWith('harm-mean')) {
      return <HarmonicMeanContent topicId={activeTopic} />;
    }
    if (activeTopic.startsWith('mean')) {
      return <MeanContent topicId={activeTopic} />;
    }
    if (activeTopic.startsWith('mode')) {
      return <ModeContent topicId={activeTopic} />;
    }
    if (activeTopic.startsWith('median')) {
      return <MedianContent topicId={activeTopic} />;
    }
    if (activeTopic.startsWith('quartile')) {
      return <QuartileContent topicId={activeTopic} />;
    }
    if (activeTopic.startsWith('decile')) {
      return <DecileContent topicId={activeTopic} />;
    }
    if (activeTopic.startsWith('percentile')) {
      return <PercentileContent topicId={activeTopic} />;
    }
    return null;
  };

  return (
    <main className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto px-3 py-4 sm:px-5 sm:py-5 md:px-8 md:py-8">
      <article className="mx-auto w-full min-w-0 rounded-xl border-2 border-academic-200 bg-white p-4 shadow-md ring-1 ring-academic-100 sm:p-6 md:p-8 lg:p-10">
        <TopicHeader breadcrumb={getBreadcrumb(activeTopic)} title={topicTitles[activeTopic]} />
        <div className="min-w-0 space-y-6">{renderContent()}</div>
      </article>
    </main>
  );
}
