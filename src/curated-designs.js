import { midnightEleganceDesign } from '../content/wedding-batch/ponocna-elegancija.mjs';
import { curatedTemplates } from './curated-catalog.js';
import { midnightAssetIds } from './curated-assets.js';

export function curatedDesign(id) {
  const metadata = curatedTemplates.find(template => template.id === id);
  if (!metadata) return null;
  return {
    ...midnightEleganceDesign({ backgroundId: midnightAssetIds.background, scriptFontId: midnightAssetIds.font }),
    ...metadata,
    thumbnailId: midnightAssetIds.thumbnail,
    builtinSource: id,
  };
}
