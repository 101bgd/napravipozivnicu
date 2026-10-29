import { templates as examples } from './templates.js';
import { curatedAssetUrl, midnightAssetIds } from './curated-assets.js';
import { birthdayTemplates } from './birthday-catalog.js';
import { birthdayCollectionTemplates } from './birthday-collection-catalog.js';
import { baptismTemplates } from './baptism-catalog.js';
import { eighteenTemplates } from './eighteen-catalog.js';
import { weddingTemplates } from './wedding-catalog.js';
import { firstBirthdayTemplates } from './first-birthday-catalog.js';
import { babyTemplates } from './baby-catalog.js';
import { eighteenCollectionTemplates } from './eighteen-collection-catalog.js';
import { firstBirthdayExtraTemplates } from './first-birthday-extra-catalog.js';
import { eighteenPremiumTemplates } from './eighteen-premium-catalog.js';
import { robiTemplates } from './robi-catalog.js';

// Metadata only: full layouts and font files load when the editor opens.
export const curatedTemplates = [...firstBirthdayExtraTemplates, ...eighteenPremiumTemplates, ...robiTemplates, ...firstBirthdayTemplates, ...birthdayCollectionTemplates, ...birthdayTemplates, ...baptismTemplates, ...eighteenCollectionTemplates, ...eighteenTemplates, ...weddingTemplates, ...babyTemplates, {
  id: 'ponocna-elegancija',
  slug: 'ponocna-elegancija',
  name: 'Ponoćna elegancija', motif: 'sa plavim cvećem i zlatom', seoTitle: 'Pozivnica za venčanje sa plavim cvećem i zlatom — Ponoćna elegancija',
  category: 'wedding',
  style: 'custom',
  description: 'Elegantna pozivnica za svadbu sa tamnoplavim cvećem, zlatnim detaljima i kaligrafskim imenima. Uredi tekst bez fotografije i preuzmi besplatan PNG ili PDF.',
  thumbnail: curatedAssetUrl(midnightAssetIds.thumbnail),
  imageAlt: 'Pozivnica za venčanje sa plavim i belim cvećem, zlatnim grančicama i dijagonalno raspoređenim imenima mladenaca',
  hasPhoto: false,
  updatedAt: '2026-10-15T00:00:00Z',
}];
export const publicTemplates = [...curatedTemplates, ...examples];
