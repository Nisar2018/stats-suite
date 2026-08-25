import { DEFAULT_TOPICS, TOPIC_PARENT, pageSeo } from '../data/seoConfig';

const VALID_PAGES = new Set(Object.keys(pageSeo));

/**
 * Parse location.hash into { pageId, topicId }.
 * Examples: #/  → home
 *           #/about → about
 *           #/central-tendency/mean-ungrouped → page + topic
 */
export function parseHash(hash = window.location.hash) {
  const raw = (hash || '').replace(/^#\/?/, '').trim();
  if (!raw) {
    return { pageId: 'home', topicId: null };
  }

  const parts = raw.split('/').filter(Boolean);
  const pageId = parts[0];
  const topicId = parts[1] ?? null;

  if (!VALID_PAGES.has(pageId)) {
    return { pageId: 'home', topicId: null };
  }

  if (topicId && TOPIC_PARENT[topicId] && TOPIC_PARENT[topicId] !== pageId) {
    // Topic belongs to a different module — trust topic parent.
    return { pageId: TOPIC_PARENT[topicId], topicId };
  }

  if (topicId && !TOPIC_PARENT[topicId] && !DEFAULT_TOPICS[pageId]) {
    return { pageId, topicId: null };
  }

  return { pageId, topicId };
}

export function buildHash(pageId, topicId = null) {
  if (!pageId || pageId === 'home') return '#/';

  const defaultTopic = DEFAULT_TOPICS[pageId];
  if (defaultTopic) {
    const topic = topicId && TOPIC_PARENT[topicId] === pageId ? topicId : defaultTopic;
    return `#/${pageId}/${topic}`;
  }

  return `#/${pageId}`;
}

export function replaceHash(pageId, topicId = null) {
  const next = buildHash(pageId, topicId);
  if (window.location.hash !== next) {
    window.history.replaceState(null, '', next);
  }
}
