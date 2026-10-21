import { GUIDES, GUIDE_HUB } from './guide-catalog.js';
export function guidePageMeta(guide, siteUrl) {
  const url = `${siteUrl}${guide.path}`, index = guide.id === GUIDE_HUB.id;
  const image = `${siteUrl}/social-preview.png`;
  const organization = { '@type': 'Organization', '@id': `${siteUrl}/#organization`, name: 'Napravi pozivnicu', url: `${siteUrl}/`, logo: { '@type': 'ImageObject', url: `${siteUrl}/favicon.svg` } };
  const graph = [
    { '@type': 'WebSite', '@id': `${siteUrl}/#website`, url: `${siteUrl}/`, name: 'Napravi pozivnicu', inLanguage: 'sr-Latn' },
    { '@type': index ? 'CollectionPage' : 'WebPage', '@id': `${url}#page`, url, name: guide.seoTitle, description: guide.description, inLanguage: 'sr-Latn', isPartOf: { '@id': `${siteUrl}/#website` }, mainEntity: { '@id': `${url}#${index ? 'guides' : 'article'}` } },
    { '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Početna', item: `${siteUrl}/` },
      { '@type': 'ListItem', position: 2, name: 'Vodiči', item: `${siteUrl}/vodici/` },
      ...(!index ? [{ '@type': 'ListItem', position: 3, name: guide.title, item: url }] : []),
    ] },
  ];
  if (index) graph.push({ '@type': 'ItemList', '@id': `${url}#guides`, name: guide.title, numberOfItems: GUIDES.length, itemListElement: GUIDES.map((item, i) => ({ '@type': 'ListItem', position: i + 1, name: item.title, url: `${siteUrl}${item.path}` })) });
  else graph.push(organization, { '@type': 'Article', '@id': `${url}#article`, headline: guide.title, description: guide.description, url, mainEntityOfPage: { '@id': `${url}#page` }, inLanguage: 'sr-Latn', datePublished: guide.publishedAt, dateModified: guide.updatedAt, author: { '@id': organization['@id'] }, publisher: { '@id': organization['@id'] }, image: [image], articleSection: 'Vodiči za pozivnice' });
  return { title: guide.seoTitle, description: guide.description, url, image, imageAlt: 'Napravi pozivnicu — besplatne pozivnice za tvoju proslavu', structured: { '@context': 'https://schema.org', '@graph': graph }, ogType: index ? 'website' : 'article', publishedAt: index ? null : guide.publishedAt, updatedAt: index ? null : guide.updatedAt };
}
