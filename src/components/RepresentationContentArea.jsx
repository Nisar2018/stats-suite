import {
  representationMenuSections,
  representationTopicTitles,
} from '../data/representationMenuConfig';
import { ContinuousFrequencyContent } from './representation/ContinuousFrequencyContent';
import { CategoricalFrequencyContent } from './representation/CategoricalFrequencyContent';
import { OpenDataFrequencyContent } from './representation/OpenDataFrequencyContent';
import { RelativeFrequencyContent } from './representation/RelativeFrequencyContent';
import { CumulativeFrequencyContent } from './representation/CumulativeFrequencyContent';
import { BarDiagramContent } from './representation/BarDiagramContent';
import { GraphsIntroContent } from './representation/GraphsIntroContent';
import { PieGraphContent } from './representation/PieGraphContent';
import { HistogramContent } from './representation/HistogramContent';
import { CumulativeRelativeFrequencyPolygonContent } from './representation/CumulativeRelativeFrequencyPolygonContent';
import { DiscreteCumulativeRelativeFrequencyPolygonContent } from './representation/DiscreteCumulativeRelativeFrequencyPolygonContent';
import { DiscreteCumulativeFrequencyStepPolygonContent } from './representation/DiscreteCumulativeFrequencyStepPolygonContent';
import { FrequencyPolygonContent } from './representation/FrequencyPolygonContent';
import { ScatterPlotContent } from './representation/ScatterPlotContent';
import { BivariateFrequencyContent } from './representation/BivariateFrequencyContent';
import { TopicHeader } from './TopicHeader';

function getBreadcrumb(topicId) {
  for (const section of representationMenuSections) {
    if (section.items.some((item) => item.id === topicId)) {
      return `Representation of Data › ${section.label}`;
    }
  }
  return 'Representation of Data';
}

export function RepresentationContentArea({ activeTopic }) {
  const renderContent = () => {
    switch (activeTopic) {
      case 'freq-continuous':
        return <ContinuousFrequencyContent />;
      case 'freq-categorical':
        return <CategoricalFrequencyContent />;
      case 'freq-open':
        return <OpenDataFrequencyContent />;
      case 'rel-frequency':
        return <RelativeFrequencyContent />;
      case 'cum-frequency':
        return <CumulativeFrequencyContent />;
      case 'graphs-intro':
        return <GraphsIntroContent />;
      case 'bar-simple':
        return <BarDiagramContent variant="bar-simple" />;
      case 'bar-multiple':
        return <BarDiagramContent variant="bar-multiple" />;
      case 'bar-subdivided':
        return <BarDiagramContent variant="bar-subdivided" />;
      case 'pie-graph':
        return <PieGraphContent />;
      case 'histogram-equal':
        return <HistogramContent variant="histogram-equal" />;
      case 'histogram-unequal':
        return <HistogramContent variant="histogram-unequal" />;
      case 'histogram-discrete':
        return <HistogramContent variant="histogram-discrete" />;
      case 'polygon-frequency':
        return <FrequencyPolygonContent />;
      case 'polygon-cf-step-discrete':
        return <DiscreteCumulativeFrequencyStepPolygonContent />;
      case 'polygon-crf':
        return <CumulativeRelativeFrequencyPolygonContent />;
      case 'polygon-crf-discrete':
        return <DiscreteCumulativeRelativeFrequencyPolygonContent />;
      case 'scatter-same':
        return <ScatterPlotContent variant="scatter-same" />;
      case 'scatter-different':
        return <ScatterPlotContent variant="scatter-different" />;
      case 'bivariate-freq':
        return <BivariateFrequencyContent />;
      default:
        return null;
    }
  };

  return (
    <main className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto px-3 py-4 sm:px-5 sm:py-5 md:px-8 md:py-8">
      <article className="mx-auto w-full min-w-0 rounded-xl border-2 border-academic-200 bg-white p-4 shadow-md ring-1 ring-academic-100 sm:p-6 md:p-8 lg:p-10">
        <TopicHeader
          breadcrumb={getBreadcrumb(activeTopic)}
          title={representationTopicTitles[activeTopic]}
        />
        <div className="min-w-0 space-y-6">{renderContent()}</div>
      </article>
    </main>
  );
}
