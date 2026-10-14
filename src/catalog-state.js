import { templates as builtinTemplates } from './templates.js';
let payload;
try { payload = JSON.parse(document.querySelector('#catalog-data')?.textContent || '{}'); } catch { payload = {}; }
export const templates = Array.isArray(payload.templates) ? payload.templates : builtinTemplates;
export const initialCategory = payload.category || 'all';
export const pageType = payload.pageType || 'catalog';
