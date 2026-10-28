// Metadata only. Full artwork, text layers and fonts load with the editor.
import metadata from '../content/eighteen-premium-20261028/metadata.json' with { type: 'json' };
import { eighteenPremiumAssetIds as ids, eighteenPremiumAssets } from './eighteen-premium-assets.js';
import { buildTemplateTitle } from './template-titles.js';
export const eighteenPremiumTemplates = metadata.map(({ source, bg, ...item }) => ({
  ...item, seoTitle: buildTemplateTitle(item), style: 'custom', hasPhoto: false,
  thumbnail: eighteenPremiumAssets.get(ids.designs[item.id].thumbnail), updatedAt: ids.updatedAt,
}));
