import { firstBirthdayExtraTemplates } from '../src/first-birthday-extra-catalog.js';
import { verifyCuratedBatch } from './curated-batch-integration.mjs';

await verifyCuratedBatch({ templates: firstBirthdayExtraTemplates, category: 'first', expectedIds: ['prva-morska-plovidba','labudicev-prvi-ples'], artifacts: '/workspace/artifacts/birthday-oct29/qa' });
