// Shared by HTML metadata, invitation headings and the protected template studio.
export const TITLE_METADATA_UPDATED_AT = '2026-10-21T00:00:00Z';
export const INVITATION_LABELS = {
  first: 'Pozivnica za 1. rođendan',
  eighteen: 'Pozivnica za 18. rođendan',
  birthday: 'Pozivnica za dečiji rođendan',
  wedding: 'Pozivnica za venčanje',
  baptism: 'Pozivnica za krštenje',
  baby: 'Pozivnica za rođenje deteta',
};
const clean = value => typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : '';
export function buildTemplateTitle(template) {
  const label = INVITATION_LABELS[template.category] || 'Pozivnica';
  const name = clean(template.name).slice(0, 100), motif = clean(template.motif).slice(0, 100);
  const suffix = name ? ` — ${name}` : '';
  const available = Math.max(0, 150 - label.length - suffix.length - 1);
  const detail = motif.length > available ? motif.slice(0, available).replace(/\s+\S*$/, '') : motif;
  return `${label}${detail ? ` ${detail}` : ''}${suffix}`;
}
export const templateTitle = template => clean(template.seoTitle).slice(0, 150) || buildTemplateTitle(template);
