import { CATEGORY_CONTENT } from './seo-content.js';

export const LATEST_SECTION_ID = 'najnovije-pozivnice';
const publishedTime = template => Date.parse(template.updatedAt || '') || 0;

// Catalog order breaks ties for designs published in the same batch.
// The input contains public versions only, so drafts never displace a card.
export function latestTemplates(catalog = []) {
  const newest = new Map();
  for (const template of catalog) {
    if (!CATEGORY_CONTENT[template.category]) continue;
    const previous = newest.get(template.category);
    if (!previous || publishedTime(template) > publishedTime(previous)) newest.set(template.category, template);
  }
  return [...newest.values()].sort((a, b) => publishedTime(b) - publishedTime(a));
}
