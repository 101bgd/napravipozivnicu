// Public, versioned assets shipped with the site. These IDs are separate from
// private uploads; only this explicit list can resolve to a static asset.
import { birthdayAssets } from './birthday-assets.js';
import { baptismAssets } from './baptism-assets.js';
import { eighteenAssets } from './eighteen-assets.js';
import { weddingAssets } from './wedding-assets.js';
import { firstBirthdayAssets } from './first-birthday-assets.js';
import { babyAssets } from './baby-assets.js';
import { eighteenCollectionAssets } from './eighteen-collection-assets.js';
const base = '/assets/pozivnice/ponocna-elegancija/';
export const midnightAssetIds = {
  background: 'a602e85c-3f52-43b8-a2ed-362f3fb9528a',
  font: 'a8a45639-0d15-4793-a5ea-9c806c035b17',
  thumbnail: 'dd4f312a-b7ce-45db-b30d-96c92c125874',
};
const assets = new Map([
  ...birthdayAssets,
  ...baptismAssets,
  ...eighteenAssets,
  ...weddingAssets,
  ...firstBirthdayAssets,
  ...babyAssets,
  ...eighteenCollectionAssets,
  [midnightAssetIds.background, `${base}pozadina-bd7ed2b4f10e.webp`],
  [midnightAssetIds.font, `${base}great-vibes-sr-7ec0bdb540f9.woff2`],
  [midnightAssetIds.thumbnail, `${base}pregled-7de7cf723b25.webp`],
]);
export const curatedAssetUrl = id => assets.get(id);
