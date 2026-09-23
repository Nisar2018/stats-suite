import { useEffect } from 'react';
import { buildJsonLd, SITE_ORIGIN, siteSeo } from '../data/seoConfig';

function upsertMeta(attr, key, content) {
  if (!content) return;
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertLink(rel, href, attrs = {}) {
  if (!href) return;
  const sizeKey = attrs.sizes ? `[sizes="${attrs.sizes}"]` : '';
  const typeKey = attrs.type ? `[type="${attrs.type}"]` : '';
  let el = document.head.querySelector(`link[rel="${rel}"]${sizeKey}${typeKey}`);
  if (!el && attrs.sizes) {
    el = document.head.querySelector(`link[rel="${rel}"][sizes="${attrs.sizes}"]`);
  }
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
  Object.entries(attrs).forEach(([key, value]) => {
    if (value != null) el.setAttribute(key, value);
  });
}

function upsertJsonLd(data) {
  const id = 'statssuite-jsonld';
  let el = document.getElementById(id);
  if (!el) {
    el = document.createElement('script');
    el.id = id;
    el.type = 'application/ld+json';
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

/**
 * Applies page SEO: title, description, keywords, robots, Open Graph,
 * Twitter cards, canonical URL, and JSON-LD structured data.
 */
export function SeoHead({ seo }) {
  useEffect(() => {
    if (!seo) return;

    document.title = seo.title;

    upsertMeta('name', 'description', seo.description);
    upsertMeta('name', 'keywords', seo.keywords);
    upsertMeta('name', 'author', siteSeo.author);
    upsertMeta('name', 'robots', 'index, follow, max-image-preview:large');
    upsertMeta('name', 'googlebot', 'index, follow');
    upsertMeta('name', 'theme-color', '#1e3a5f');

    const canonicalUrl = `${SITE_ORIGIN}${seo.canonicalPath === '/' ? '/' : seo.canonicalPath}`;
    const ogImage = `${SITE_ORIGIN}${siteSeo.ogImage}`;

    upsertLink('canonical', canonicalUrl);
    upsertLink('icon', `${SITE_ORIGIN}/favicon.ico`, { sizes: 'any' });
    upsertLink('icon', `${SITE_ORIGIN}/favicon-48x48.png?v=20260923`, {
      type: 'image/png',
      sizes: '48x48',
    });
    upsertLink('icon', `${SITE_ORIGIN}/favicon-192x192.png?v=20260923`, {
      type: 'image/png',
      sizes: '192x192',
    });
    upsertLink('apple-touch-icon', `${SITE_ORIGIN}/apple-touch-icon.png?v=20260923`, {
      sizes: '180x180',
    });

    upsertMeta('property', 'og:type', siteSeo.type);
    upsertMeta('property', 'og:site_name', siteSeo.name);
    upsertMeta('property', 'og:locale', siteSeo.locale);
    upsertMeta('property', 'og:title', seo.title);
    upsertMeta('property', 'og:description', seo.description);
    upsertMeta('property', 'og:url', canonicalUrl);
    upsertMeta('property', 'og:image', ogImage);
    upsertMeta('property', 'og:image:width', '512');
    upsertMeta('property', 'og:image:height', '512');
    upsertMeta('property', 'og:image:type', 'image/png');
    upsertMeta('property', 'og:image:alt', 'MyStatCalculator logo');

    upsertMeta('name', 'twitter:card', siteSeo.twitterCard);
    upsertMeta('name', 'twitter:title', seo.title);
    upsertMeta('name', 'twitter:description', seo.description);
    upsertMeta('name', 'twitter:image', ogImage);

    upsertJsonLd(buildJsonLd(seo));
  }, [seo]);

  return null;
}
