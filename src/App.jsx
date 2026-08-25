import { useCallback, useEffect, useMemo, useState } from 'react';
import { TopNav } from './components/TopNav';
import { Footer } from './components/Footer';
import { HomePage } from './components/HomePage';
import { StaticPage } from './components/StaticPage';
import { MathCalculatorsPage } from './components/MathCalculatorsPage';
import { CentralTendencyPage } from './components/CentralTendencyPage';
import { DispersionPage } from './components/DispersionPage';
import { RepresentationOfDataPage } from './components/RepresentationOfDataPage';
import { ProbabilityPage } from './components/ProbabilityPage';
import { SeoHead } from './components/SeoHead';
import { DEFAULT_TOPICS, resolveSeo } from './data/seoConfig';
import { buildHash, parseHash, replaceHash } from './utils/routing';

function App() {
  const initial = parseHash();
  const [activePage, setActivePage] = useState(initial.pageId);
  const [activeTopic, setActiveTopic] = useState(
    initial.topicId ?? DEFAULT_TOPICS[initial.pageId] ?? null,
  );

  const handleNavigate = useCallback((pageId) => {
    const topic = DEFAULT_TOPICS[pageId] ?? null;
    setActivePage(pageId);
    setActiveTopic(topic);
    window.location.hash = buildHash(pageId, topic);
  }, []);

  const handleTopicChange = useCallback(
    (topicId) => {
      setActiveTopic(topicId);
      replaceHash(activePage, topicId);
    },
    [activePage],
  );

  useEffect(() => {
    const onHashChange = () => {
      const { pageId, topicId } = parseHash();
      setActivePage(pageId);
      setActiveTopic(topicId ?? DEFAULT_TOPICS[pageId] ?? null);
    };

    if (!window.location.hash || window.location.hash === '#') {
      replaceHash(activePage, activeTopic);
    }

    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
    // Only bind once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const seo = useMemo(
    () => resolveSeo(activePage, activeTopic),
    [activePage, activeTopic],
  );

  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return <HomePage onStartLearning={() => handleNavigate('central-tendency')} />;
      case 'central-tendency':
        return (
          <CentralTendencyPage
            initialTopic={activeTopic ?? DEFAULT_TOPICS['central-tendency']}
            onTopicChange={handleTopicChange}
          />
        );
      case 'measurement-of-dispersion':
        return (
          <DispersionPage
            initialTopic={activeTopic ?? DEFAULT_TOPICS['measurement-of-dispersion']}
            onTopicChange={handleTopicChange}
          />
        );
      case 'representation-of-data':
        return (
          <RepresentationOfDataPage
            initialTopic={activeTopic ?? DEFAULT_TOPICS['representation-of-data']}
            onTopicChange={handleTopicChange}
          />
        );
      case 'probability':
        return (
          <ProbabilityPage
            initialTopic={activeTopic ?? DEFAULT_TOPICS.probability}
            onTopicChange={handleTopicChange}
          />
        );
      case 'basic-calculator':
      case 'percentage-calculator':
      case 'finance-calculator':
      case 'mortgage-calculator':
      case 'loan-calculator':
      case 'gwa-calculator':
        return (
          <MathCalculatorsPage activeCalculator={activePage} onNavigate={handleNavigate} />
        );
      case 'about':
      case 'contact':
      case 'privacy':
      case 'terms':
        return <StaticPage pageId={activePage} />;
      default:
        return <HomePage onStartLearning={() => handleNavigate('central-tendency')} />;
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <SeoHead seo={seo} />
      <TopNav activePage={activePage} onNavigate={handleNavigate} />
      <div className="flex flex-1 flex-col">{renderPage()}</div>
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}

export default App;
