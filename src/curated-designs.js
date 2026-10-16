import { midnightEleganceDesign } from '../content/wedding-batch/ponocna-elegancija.mjs';
import { curatedTemplates } from './curated-catalog.js';
import { midnightAssetIds } from './curated-assets.js';
import { birthdayAssetIds } from './birthday-assets.js';
import { birthdayDesign } from '../content/birthday-batch/designs.mjs';

export function curatedDesign(id) {
  const metadata = curatedTemplates.find(template => template.id === id);
  if (!metadata) return null;
  const birthday = birthdayAssetIds.designs[id];
  const design = birthday
    ? birthdayDesign(id, { backgroundId: birthday.background, fontIds: birthdayAssetIds.fonts })
    : midnightEleganceDesign({ backgroundId: midnightAssetIds.background, scriptFontId: midnightAssetIds.font });
  return {
    ...design,
    ...metadata,
    thumbnailId: birthday?.thumbnail || midnightAssetIds.thumbnail,
    builtinSource: id,
  };
}
