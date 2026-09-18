import { DEFAULT_TOPICS, TOPIC_PARENT, pageSeo } from '../data/seoConfig';

const VALID_PAGES = new Set(Object.keys(pageSeo));

/**
 * Parse a path (pathname or legacy hash) into { pageId, topicId }.
 * Examples: /  → home
 *           /about → about
 *           /central-tendency/mean-ungrouped → page + topic
 *           #/about (legacy) → about
 */
export function parseRoute(path = window.location.pathname) {
  let raw = (path || '').trim();

  // Legacy hash URLs: #/about or #/central-tendency/mean-ungrouped
  if (raw.startsWith('#')) {
    raw = raw.replace(/^#\/?/, '');
  } else {
    raw = raw.replace(/^\//, '');
  }

  raw = raw.trim();
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
    return { pageId: TOPIC_PARENT[topicId], topicId };
  }

  if (topicId && !TOPIC_PARENT[topicId] && !DEFAULT_TOPICS[pageId]) {
    return { pageId, topicId: null };
  }

  return { pageId, topicId };
}

/** Prefer pathname; fall back to legacy hash if present. */
export function parseLocation() {
  const hash = window.location.hash || '';
  if (hash.startsWith('#/') || hash === '#') {
    return parseRoute(hash);
  }
  return parseRoute(window.location.pathname);
}

export function buildPath(pageId, topicId = null) {
  if (!pageId || pageId === 'home') return '/';

  const defaultTopic = DEFAULT_TOPICS[pageId];
  if (defaultTopic) {
    const topic = topicId && TOPIC_PARENT[topicId] === pageId ? topicId : defaultTopic;
    return `/${pageId}/${topic}`;
  }

  return `/${pageId}`;
}

export function replacePath(pageId, topicId = null) {
  const next = buildPath(pageId, topicId);
  if (window.location.pathname !== next || window.location.hash) {
    window.history.replaceState(null, '', next);
  }
}

export function pushPath(pageId, topicId = null) {
  const next = buildPath(pageId, topicId);
  if (window.location.pathname !== next || window.location.hash) {
    window.history.pushState(null, '', next);
  }
}

/** Redirect old #/… bookmarks to clean paths once. */
export function migrateHashToPath() {
  const hash = window.location.hash || '';
  if (!hash.startsWith('#/') && hash !== '#') return false;

  const { pageId, topicId } = parseRoute(hash);
  replacePath(pageId, topicId ?? DEFAULT_TOPICS[pageId] ?? null);
  return true;
}
