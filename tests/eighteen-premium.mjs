import { eighteenPremiumTemplates } from '../src/eighteen-premium-catalog.js';
import { verifyCuratedBatch } from './curated-batch-integration.mjs';

await verifyCuratedBatch({ templates: eighteenPremiumTemplates, category: 'eighteen', expectedIds: ['bordo-gala','oniks-potpis'], artifacts: '/workspace/artifacts/eighteen-oct28/qa' });
