export const IMAGE_METADATA_UPDATED_AT = '2026-10-21T00:00:00Z';
const labels = { first: 'Pozivnica za 1. rođendan', eighteen: 'Pozivnica za 18. rođendan', birthday: 'Pozivnica za rođendan', wedding: 'Pozivnica za venčanje', baptism: 'Pozivnica za krštenje', baby: 'Pozivnica za rođenje deteta' };
export const templateImageAlt = template => String(template.imageAlt || '').trim() || `${labels[template.category] || 'Pozivnica'} „${template.name}“`;
