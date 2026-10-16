import { midnightEleganceDesign } from '../content/wedding-batch/ponocna-elegancija.mjs';
import { curatedTemplates } from './curated-catalog.js';
import { midnightAssetIds } from './curated-assets.js';
import { birthdayAssetIds } from './birthday-assets.js';
import { birthdayDesign } from '../content/birthday-batch/designs.mjs';
import { baptismAssetIds } from './baptism-assets.js';
import { baptismDesign } from '../content/baptism-batch/designs.mjs';
import { eighteenAssetIds } from './eighteen-assets.js';
import { eighteenDesign } from '../content/eighteen-batch/designs.mjs';
import { weddingAssetIds } from './wedding-assets.js';
import { weddingDesign } from '../content/wedding-collection/designs.mjs';
import { firstBirthdayAssetIds } from './first-birthday-assets.js';
import { firstBirthdayDesign } from '../content/first-birthday-batch/designs.mjs';

const batches = [
  { assets: birthdayAssetIds, build: birthdayDesign },
  { assets: baptismAssetIds, build: baptismDesign },
  { assets: eighteenAssetIds, build: eighteenDesign },
  { assets: weddingAssetIds, build: weddingDesign },
  { assets: firstBirthdayAssetIds, build: firstBirthdayDesign },
];

export function curatedDesign(id) {
  const metadata = curatedTemplates.find(template => template.id === id);
  if (!metadata) return null;
  const batch = batches.find(item => item.assets.designs[id]);
  const assets = batch?.assets.designs[id] || midnightAssetIds;
  const design = batch
    ? batch.build(id, { backgroundId: assets.background, fontIds: batch.assets.fonts })
    : midnightEleganceDesign({ backgroundId: midnightAssetIds.background, scriptFontId: midnightAssetIds.font });
  return {
    ...design,
    ...metadata,
    thumbnailId: assets.thumbnail,
    builtinSource: id,
  };
}
