import { templates as examples } from './templates.js';
import { curatedAssetUrl, midnightAssetIds } from './curated-assets.js';
import { birthdayTemplates } from './birthday-catalog.js';
import { baptismTemplates } from './baptism-catalog.js';
import { eighteenTemplates } from './eighteen-catalog.js';
import { weddingTemplates } from './wedding-catalog.js';
import { firstBirthdayTemplates } from './first-birthday-catalog.js';

// Metadata only: full layouts and font files load when the editor opens.
export const curatedTemplates = [...firstBirthdayTemplates, ...birthdayTemplates, ...baptismTemplates, ...eighteenTemplates, ...weddingTemplates, {
  id: 'ponocna-elegancija',
  slug: 'ponocna-elegancija',
  name: 'Ponoćna elegancija',
  category: 'wedding',
  style: 'custom',
  description: 'Elegantna pozivnica za svadbu sa tamnoplavim cvećem, zlatnim detaljima i kaligrafskim imenima. Uredi tekst bez fotografije i preuzmi besplatan PNG ili PDF.',
  thumbnail: curatedAssetUrl(midnightAssetIds.thumbnail),
  imageAlt: 'Pozivnica za venčanje Ponoćna elegancija sa plavim i belim cvećem, zlatnim grančicama i dijagonalno raspoređenim imenima mladenaca',
  hasPhoto: false,
  updatedAt: '2026-10-15T00:00:00Z',
}];
export const publicTemplates = [...curatedTemplates, ...examples];
