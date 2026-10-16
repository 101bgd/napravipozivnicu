export const categories = [
  { id: 'all', label: 'Sve pozivnice', icon: 'grid' },
  { id: 'first', label: '1. rođendan', icon: 'cake' },
  { id: 'eighteen', label: '18. rođendan', icon: 'sparkles' },
  { id: 'birthday', label: 'Rođendani', icon: 'gift' },
  { id: 'wedding', label: 'Venčanje', icon: 'heart' },
  { id: 'baptism', label: 'Krštenje', icon: 'leaf' },
  { id: 'baby', label: 'Rođenje deteta', icon: 'star' },
];
// Ugrađeni primeri. Novi šabloni se dodaju kroz /admin/sabloni/.
export const templates = [
  { id: 'midnight', name: 'Zlatnih osamnaest', category: 'eighteen', style: 'night', bg: '#29392f', ink: '#eee5cd', accent: '#c4ab76', title: 'Vreme je za slavlje', names: 'Milica', note: 'Jedna posebna noć i ljudi koje volim.\nProslavite sa mnom moj 18. rođendan.' },
  { id: 'bloom', name: 'Nežno cveće', category: 'baptism', style: 'floral', bg: '#faf3ef', ink: '#896c68', accent: '#cfa99b', title: 'Pozivnica za krštenje', names: 'Sofija', note: 'Sa ljubavlju vas pozivamo\nda podelite radost ovog posebnog dana.' },
  { id: 'bow', name: 'Mala mašna', category: 'baby', style: 'bow', bg: '#eef1f3', ink: '#596f7e', accent: '#abbfce', title: 'Stigla je naša najveća radost', names: 'Dobro došao, Vuk', note: 'Jedne male ruke ispunile su naš svet.\nDođite da proslavimo novi početak.' },
  { id: 'rose', name: 'Puder i zlato', category: 'eighteen', style: 'confetti', bg: '#f4e7e4', ink: '#976f68', accent: '#bf9990', title: 'Moja posebna noć', names: 'Sara', note: 'Osamnaest želja i jedna nezaboravna proslava.\nVidimo se na mom rođendanu!' },
  { id: 'blessing', name: 'Mali blagoslov', category: 'baptism', style: 'minimal', bg: '#f6f2e9', ink: '#8b7e66', accent: '#bdb092', title: 'Jedan poseban dan', names: 'Petar', note: 'Pozivamo vas na krštenje našeg Petra.\nVaše prisustvo upotpuniće našu radost.' },
  { id: 'peach', name: 'Najlepši početak', category: 'baby', style: 'sun', bg: '#faf0e8', ink: '#9d7760', accent: '#dbb59a', title: 'Naš svet je postao lepši', names: 'Dobro došla, Mila', note: 'Mala devojčica, beskrajno velika ljubav.\nProslavimo zajedno njen dolazak.' },
];
export const defaultData = t => t.style === 'custom' ? { bg: t.bg, locale: t.locale || 'sr-Latn-RS', photoX: 50, photoY: 50, photoZoom: 100, ...Object.fromEntries(t.layers.filter(l => l.type === 'text').map(l => [l.field, l.text])) } : ({ title: t.title, names: t.names, note: t.note, date: '2026-11-14', time: '17:00', location: t.category === 'wedding' ? 'Restoran Garden, Beograd' : 'Restoran Magnolia, Beograd', photoX: 50, photoY: 50, photoZoom: 100, font: 'serif', bg: t.bg });
