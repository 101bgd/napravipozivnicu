// Metadata only; artwork and typefaces are loaded with the editor.
import metadata from '../content/first-birthday-extra-20261029/metadata.json' with { type: 'json' };
import { firstBirthdayExtraAssetIds as ids, firstBirthdayExtraAssets } from './first-birthday-extra-assets.js';
import { buildTemplateTitle } from './template-titles.js';
export const firstBirthdayExtraTemplates = metadata.map(({ source, bg, ...item }) => ({
  ...item, seoTitle: buildTemplateTitle(item), style: 'custom', hasPhoto: false,
  thumbnail: firstBirthdayExtraAssets.get(ids.designs[item.id].thumbnail), updatedAt: ids.updatedAt,
}));
