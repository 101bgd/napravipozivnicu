import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';
import { publicTemplates } from '../src/curated-catalog.js';
import { CATEGORY_CONTENT } from '../src/seo-content.js';
import { templateTitle } from '../src/template-titles.js';
import { birthdayTemplates } from '../src/birthday-catalog.js';
import { baptismTemplates } from '../src/baptism-catalog.js';
import { eighteenTemplates } from '../src/eighteen-catalog.js';
import { eighteenCollectionTemplates } from '../src/eighteen-collection-catalog.js';
import { INFO_PAGES, CONTACT_EMAIL } from '../src/info-content.js';
import { weddingTemplates } from '../src/wedding-catalog.js';
import { firstBirthdayTemplates } from '../src/first-birthday-catalog.js';
import { babyTemplates } from '../src/baby-catalog.js';

const root = fileURLToPath(new URL('../', import.meta.url));
const origin = 'http://127.0.0.1:5178';
const server = spawn(process.execPath, [
  fileURLToPath(new URL('../node_modules/vite/bin/vite.js', import.meta.url)),
  'preview', '--host', '127.0.0.1', '--port', '5178', '--strictPort',
], { cwd: root, stdio: ['ignore', 'pipe', 'pipe'] });
let output = '', browser;
server.stdout.on('data', data => output += data);
server.stderr.on('data', data => output += data);

try {
  let ready = false;
  for (let i = 0; i < 100; i++) {
    if (server.exitCode !== null) throw new Error(output);
    try { if ((await fetch(origin)).ok) { ready = true; break; } } catch {}
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  assert.ok(ready, 'Production preview did not start');
  browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium',
    args: ['--no-sandbox'],
  });

  const noJs = await browser.newContext({ javaScriptEnabled: false });
  const staticPage = await noJs.newPage();
  await staticPage.goto(origin);
  assert.match(await staticPage.locator('h1').innerText(), /Mali poziv[\s\S]*Veliki trenutak/i);
  assert.equal(await staticPage.locator('.hero-cta').getAttribute('href'), '/pozivnice/');
  assert.equal(await staticPage.locator('.faq details').count(), 5);
  assert.equal(await staticPage.locator('#template-grid').count(), 0, 'The landing page should lead to a dedicated catalog');
  await staticPage.locator('.hero-cta').click();
  await staticPage.waitForURL(`${origin}/pozivnice/`);
  assert.equal(await staticPage.locator('.template-card h3').count(), publicTemplates.length);
  assert.equal(await staticPage.locator('h1').count(), 1);
  assert.equal(await staticPage.locator('link[rel="canonical"]').getAttribute('href'), 'https://napravipozivnicu.com/pozivnice/');
  await staticPage.goto(`${origin}/pozivnice-za-rodjendan/`);
  assert.match(await staticPage.locator('h1').innerText(), /Pozivnice za rođendan/i);
  assert.equal(await staticPage.locator('.template-card h3').count(), publicTemplates.filter(t => t.category === 'birthday').length);
  await staticPage.goto(`${origin}/pozivnice-za-krstenje/`);
  assert.equal(await staticPage.locator('.template-card h3').count(), publicTemplates.filter(t => t.category === 'baptism').length);
  for (const baptism of baptismTemplates) {
    await staticPage.goto(`${origin}/pozivnice/${baptism.slug}/`);
    assert.equal(await staticPage.title(), baptism.seoTitle);
    assert.equal(await staticPage.locator('.detail-preview img').getAttribute('alt'), baptism.imageAlt);
    assert.equal(await staticPage.locator('link[rel="canonical"]').getAttribute('href'), `https://napravipozivnicu.com/pozivnice/${baptism.slug}/`);
  }
  await staticPage.goto(`${origin}/pozivnice-za-18-rodjendan/`);
  assert.match(await staticPage.locator('h1').innerText(), /18\. rođendan/);
  assert.equal(await staticPage.title(), CATEGORY_CONTENT.eighteen.seoTitle);
  assert.equal(await staticPage.locator('.template-card h3').count(), publicTemplates.filter(template => template.category === 'eighteen').length);
  for (const template of [...eighteenTemplates, ...eighteenCollectionTemplates]) {
    await staticPage.goto(`${origin}/pozivnice/${template.slug}/`);
    assert.equal(await staticPage.locator('h1').innerText(), templateTitle(template));
    assert.equal(await staticPage.title(), template.seoTitle);
    assert.equal(await staticPage.locator('meta[name="description"]').getAttribute('content'), template.description);
    assert.equal(await staticPage.locator('.detail-preview img').getAttribute('alt'), template.imageAlt);
    assert.equal(await staticPage.locator('link[rel="canonical"]').getAttribute('href'), `https://napravipozivnicu.com/pozivnice/${template.slug}/`);
    assert.equal(await staticPage.locator('.ad-placement[hidden]').count(), 1);
  }
  await staticPage.goto(`${origin}/pozivnice-za-vencanje/`);
  assert.match(await staticPage.locator('h1').innerText(), /venčanje/);
  assert.equal(await staticPage.locator('.template-card h3').count(), publicTemplates.filter(t => t.category === 'wedding').length);
  for (const template of weddingTemplates) {
    await staticPage.goto(`${origin}/pozivnice/${template.slug}/`);
    assert.equal(await staticPage.locator('h1').innerText(), templateTitle(template));
    assert.equal(await staticPage.title(), template.seoTitle);
    assert.equal(await staticPage.locator('.detail-preview img').getAttribute('alt'), template.imageAlt);
    assert.equal(await staticPage.locator('link[rel="canonical"]').getAttribute('href'), `https://napravipozivnicu.com/pozivnice/${template.slug}/`);
  }
  await staticPage.goto(`${origin}/pozivnice-za-prvi-rodjendan/`);
  assert.equal(await staticPage.locator('h1').innerText(), CATEGORY_CONTENT.first.title);
  assert.equal(await staticPage.title(), CATEGORY_CONTENT.first.seoTitle);
  assert.equal(await staticPage.locator('.template-card h3').count(), publicTemplates.filter(t => t.category === 'first').length);
  for (const template of firstBirthdayTemplates) {
    await staticPage.goto(`${origin}/pozivnice/${template.slug}/`);
    assert.equal(await staticPage.locator('h1').innerText(), templateTitle(template));
    assert.equal(await staticPage.title(), template.seoTitle);
    assert.equal(await staticPage.locator('meta[name="description"]').getAttribute('content'), template.description);
    assert.equal(await staticPage.locator('.detail-preview img').getAttribute('alt'), template.imageAlt);
    assert.equal(await staticPage.locator('link[rel="canonical"]').getAttribute('href'), `https://napravipozivnicu.com/pozivnice/${template.slug}/`);
    assert.equal(await staticPage.locator('.ad-placement[hidden]').count(), 1);
  }
  await staticPage.goto(`${origin}/pozivnice-za-rodjenje-deteta/`);
  assert.equal(await staticPage.locator('h1').innerText(), 'Pozivnice za rođenje deteta');
  assert.equal(await staticPage.title(), CATEGORY_CONTENT.baby.seoTitle);
  assert.equal(await staticPage.locator('.template-card h3').count(), publicTemplates.filter(template => template.category === 'baby').length);
  for (const template of babyTemplates) {
    await staticPage.goto(`${origin}/pozivnice/${template.slug}/`);
    assert.equal(await staticPage.title(), template.seoTitle);
    assert.equal(await staticPage.locator('h1').innerText(), templateTitle(template));
    assert.equal(await staticPage.locator('meta[name="description"]').getAttribute('content'), template.description);
    assert.equal(await staticPage.locator('.detail-preview img').getAttribute('alt'), template.imageAlt);
    assert.equal(await staticPage.locator('link[rel="canonical"]').getAttribute('href'), `https://napravipozivnicu.com/pozivnice/${template.slug}/`);
  }
  for (const infoPage of INFO_PAGES) {
    await staticPage.locator(`footer a[href="${infoPage.path}"]`).click();
    await staticPage.waitForURL(`${origin}${infoPage.path}`);
    assert.equal(await staticPage.locator('h1').innerText(), infoPage.title);
    assert.equal(await staticPage.title(), `${infoPage.title} — Napravi pozivnicu`);
    assert.equal(await staticPage.locator('meta[name="description"]').getAttribute('content'), infoPage.description);
    assert.equal(await staticPage.locator('link[rel="canonical"]').getAttribute('href'), `https://napravipozivnicu.com${infoPage.path}`);
    assert.equal(await staticPage.locator('main').count(), 1);
    assert.equal(await staticPage.locator('#template-grid').count(), 0);
    assert.equal(await staticPage.locator(`.info-nav a[aria-current="page"]`).getAttribute('href'), infoPage.path);
    const infoGraph = JSON.parse(await staticPage.locator('script[type="application/ld+json"]').textContent())['@graph'];
    assert.ok(infoGraph.some(item => item['@type'] === infoPage.schemaType && item.url === `https://napravipozivnicu.com${infoPage.path}`));
    assert.ok(infoGraph.some(item => item['@type'] === 'BreadcrumbList'));
    assert.ok(await staticPage.locator('main').innerText().then(text => text.includes(CONTACT_EMAIL)));
    if (infoPage.id === 'privacy') {
      assert.match(await staticPage.locator('main').innerText(), /localStorage/);
      assert.match(await staticPage.locator('main').innerText(), /Na javnim stranicama učitavamo Google AdSense kod/);
    }
    if (infoPage.id === 'contact') {
      assert.equal(await staticPage.locator('.contact-email').getAttribute('href'), `mailto:${CONTACT_EMAIL}`);
      assert.equal(await staticPage.locator('.contact-email').innerText(), CONTACT_EMAIL);
      assert.equal(await staticPage.locator('form').count(), 0);
    }
  }
  await noJs.close();

  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = [], scripts = new Set();
  page.on('pageerror', error => errors.push(error.message));
  page.on('request', request => {
    const path = new URL(request.url()).pathname;
    if (path.endsWith('.js')) scripts.add(path);
  });
  const initialScriptSize = async label => {
    assert.equal([...scripts].some(path => /editor-|jspdf/.test(path)), false,
      `Editor and PDF code must not load with the ${label}`);
    let bytes = 0;
    for (const path of scripts) bytes += gzipSync(await fs.readFile(`${root}dist${path}`)).length;
    assert.ok(bytes < 10_000, `${label} initial JS gzip budget exceeded: ${bytes} bytes`);
    return bytes;
  };
  await page.goto(origin);
  await page.evaluate(() => document.fonts.ready);
  const landingGzip = await initialScriptSize('landing');
  scripts.clear();
  await page.locator('.hero-cta').click();
  await page.waitForURL(`${origin}/pozivnice/`);
  await page.evaluate(() => document.fonts.ready);
  const catalogGzip = await initialScriptSize('catalog');
  assert.equal(await page.locator('[data-canvas]').count(), 0, 'All catalog previews must be indexable static images');
  for (const img of await page.locator('.template-card img').all()) {
    await img.scrollIntoViewIfNeeded();
    await img.evaluate(img => img.decode());
    assert.ok(await img.evaluate(img => img.naturalWidth === 500 && img.naturalHeight === 700));
  }
  const bloomImage = page.locator('[data-template="bloom"] img');
  const originalThumbnail = await bloomImage.getAttribute('src');
  await page.locator('#search').fill('Nezno cvece');
  await page.locator('#search').fill('');
  assert.equal(await bloomImage.getAttribute('src'), originalThumbnail, 'Filtering must preserve the versioned preview URL');

  await page.locator('[data-template="bloom"]').first().click();
  await page.waitForFunction(() => document.querySelector('#editor')?.open);
  assert.ok([...scripts].some(path => /editor-/.test(path)));
  assert.equal([...scripts].some(path => /jspdf/.test(path)), false);
  const finishDrawing = () => page.evaluate(() => new Promise(resolve =>
    requestAnimationFrame(() => requestAnimationFrame(resolve))));
  await finishDrawing();
  const initialPreview = await page.locator('#editor-canvas').evaluate(canvas => canvas.toDataURL());
  const names = page.locator('input[name="names"]');
  const initialNames = await names.inputValue();
  await names.fill('Probni tekst');
  await finishDrawing();
  assert.notEqual(await page.locator('#editor-canvas').evaluate(canvas => canvas.toDataURL()), initialPreview);
  await names.fill(initialNames);
  await finishDrawing();
  assert.equal(await page.locator('#editor-canvas').evaluate(canvas => canvas.toDataURL()), initialPreview,
    'Repeated draws must not accumulate transforms or leave old text behind');
  await page.keyboard.press('Escape');

  // The shipped wedding design must work without a database or an admin upload.
  await page.goto(`${origin}/pozivnice/ponocna-elegancija/`);
  assert.equal(await page.locator('h1').innerText(), templateTitle(publicTemplates.find(t => t.id === 'ponocna-elegancija')));
  assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), 'https://napravipozivnicu.com/pozivnice/ponocna-elegancija/');
  const metadata = JSON.parse(await page.locator('script[type="application/ld+json"]').textContent());
  assert.ok(metadata['@graph'].some(item => item['@type'] === 'ImageObject'));
  const design = await (await fetch(`${origin}/api/templates/ponocna-elegancija`)).json();
  assert.equal(design.layers.filter(layer => layer.type === 'photo').length, 0);
  await page.locator('[data-open-template]').click();
  await page.waitForFunction(() => document.querySelector('#editor')?.open);
  assert.equal(await page.locator('#tab-photo').isVisible(), false);
  assert.equal(await page.locator('#panel-text [name]').count(), 11);
  assert.ok(await page.evaluate(family => [...document.fonts].some(font => font.family === family && font.status === 'loaded'), design.fonts[0].family));
  await page.locator('input[name="bride"]').fill('Anđela');
  await page.locator('input[name="groom"]').fill('Đorđe');
  const weddingDownload = page.waitForEvent('download');
  await page.locator('.export-png').click();
  await (await weddingDownload).saveAs('/tmp/napravi-wedding-published.png');
  const weddingPng = await fs.readFile('/tmp/napravi-wedding-published.png');
  assert.equal(weddingPng.readUInt32BE(16), 1500); assert.equal(weddingPng.readUInt32BE(20), 2100);
  await page.keyboard.press('Escape');
  console.log('PASS: shipped wedding design, stable SEO URL, custom font, no photo field, editable names with Serbian diacritics and actual PNG export.');
  for (const birthday of birthdayTemplates) {
    await page.goto(`${origin}/pozivnice/${birthday.slug}/`);
    assert.equal(await page.locator('h1').innerText(), templateTitle(birthday));
    assert.equal(await page.title(), birthday.seoTitle);
    assert.equal(await page.locator('meta[name="description"]').getAttribute('content'), birthday.description);
    assert.equal(await page.locator('.detail-preview img').getAttribute('alt'), birthday.imageAlt);
    const layout = await (await fetch(`${origin}/api/templates/${birthday.id}`)).json();
    assert.equal(layout.layers.some(layer => layer.type === 'photo'), false);
    await page.locator('[data-open-template]').click();
    await page.waitForFunction(() => document.querySelector('#editor')?.open);
    assert.equal(await page.locator('#tab-photo').isVisible(), false);
    await page.locator('input[name="names"]').fill('Đorđe');
    await page.locator('input[name="age"]').fill('7');
    await page.locator('input[name="location"]').fill('Igraonica Čarolija, Niš');
    for (const font of layout.fonts) assert.ok(await page.evaluate(family => [...document.fonts].some(face => face.family === family && face.status === 'loaded'), font.family));
    const pngDownload = page.waitForEvent('download'); await page.locator('.export-png').click();
    await (await pngDownload).saveAs(`/tmp/${birthday.id}-export.png`);
    const pngBytes = await fs.readFile(`/tmp/${birthday.id}-export.png`);
    assert.equal(pngBytes.readUInt32BE(16), 1500); assert.equal(pngBytes.readUInt32BE(20), 2100);
    const pdfDownload = page.waitForEvent('download'); await page.locator('.export-pdf').click();
    await (await pdfDownload).saveAs(`/tmp/${birthday.id}-export.pdf`);
    const pdfBytes = await fs.readFile(`/tmp/${birthday.id}-export.pdf`);
    assert.ok(pdfBytes.toString('latin1').startsWith('%PDF'));
    const box = pdfBytes.toString('latin1').match(/\/MediaBox \[0 0 ([\d.]+) ([\d.]+)\]/);
    assert.ok(box && Math.abs(Number(box[1])-360)<.001 && Math.abs(Number(box[2])-504)<.001);
    assert.ok(await page.locator('#editor').evaluate(dialog => dialog.scrollWidth <= dialog.clientWidth));
    await page.keyboard.press('Escape');
  }
  const map = await fs.readFile(`${root}dist/sitemap.xml`, 'utf8');
  for (const birthday of birthdayTemplates) assert.ok(map.includes(`/pozivnice/${birthday.slug}/`));
  for (const id of ['olive', 'vows', 'confetti', 'garden', 'little-sun', 'moon']) assert.equal(map.includes(`/pozivnice/${id}/`), false);
  console.log('PASS: four birthday designs have unique SEO text, descriptive image alt, editable age/name, loaded fonts, no photo slot, mobile layouts and valid PNG/PDF downloads; removed examples are absent from the sitemap.');
  for (const baptism of baptismTemplates) {
    assert.ok(map.includes(`/pozivnice/${baptism.slug}/`));
    await page.goto(`${origin}/pozivnice/${baptism.slug}/`);
    assert.equal(await page.locator('h1').innerText(), templateTitle(baptism));
    assert.equal(await page.locator('meta[name="description"]').getAttribute('content'), baptism.description);
    assert.equal(await page.locator('meta[property="og:image:alt"]').getAttribute('content'), baptism.imageAlt);
    const graph = JSON.parse(await page.locator('script[type="application/ld+json"]').textContent())['@graph'];
    assert.ok(graph.some(item => item['@type'] === 'ImageObject' && item.caption === baptism.imageAlt));
    const layout = await (await fetch(`${origin}/api/templates/${baptism.id}`)).json();
    assert.equal(layout.layers.some(layer => layer.type === 'photo'), false);
    // Observe actual painted text, including the formatted month, rather than
    // testing an isolated formatter that might not be used by the editor.
    await page.evaluate(() => {
      window.drawnEditorText = [];
      const original = CanvasRenderingContext2D.prototype.fillText;
      CanvasRenderingContext2D.prototype.fillText = function(text, ...args) {
        if (this.canvas.id === 'editor-canvas') window.drawnEditorText.push(text);
        return original.call(this, text, ...args);
      };
    });
    await page.locator('[data-open-template]').click();
    await page.waitForFunction(() => document.querySelector('#editor')?.open);
    await finishDrawing();
    assert.equal(await page.locator('#tab-photo').isVisible(), false);
    for (const layer of layout.layers.filter(layer => layer.type === 'text' && layer.editable && layer.text.includes('\n'))) {
      assert.equal(await page.locator(`#panel-text textarea[name="${layer.field}"]`).inputValue(), layer.text,
        'Multiline invitation text must remain editable without joining words');
    }
    const cyrillic = layout.locale === 'sr-Cyrl-RS';
    assert.ok(await page.evaluate(month => window.drawnEditorText.some(text => text.includes(month)), cyrillic ? 'новембар' : 'novembar'));
    await page.locator('input[name="names"]').fill(cyrillic ? 'Ђорђе' : 'Đorđe');
    await page.locator('[name="location"]').fill(cyrillic ? 'Храм Светог Ђорђа, Ниш' : 'Hram Svetog Đorđa, Niš');
    await page.locator('input[name="celebration"]').fill(cyrillic ? 'Ресторан Љиљан' : 'Restoran Ljiljan');
    await page.locator('input[name="celebration_time"]').fill('14:30');
    for (const font of layout.fonts.filter(font => layout.layers.some(layer => layer.family === font.family))) {
      assert.ok(await page.evaluate(family => [...document.fonts].some(face => face.family === family && face.status === 'loaded'), font.family));
    }
    await page.locator('[data-panel="style"]').click();
    assert.equal(await page.locator('select[name="locale"]').inputValue(), layout.locale);
    await finishDrawing();
    const beforeScriptChange = await page.locator('#editor-canvas').evaluate(canvas => canvas.toDataURL());
    const otherLocale = cyrillic ? 'sr-Latn-RS' : 'sr-Cyrl-RS';
    await page.evaluate(() => window.drawnEditorText = []);
    await page.locator('select[name="locale"]').selectOption(otherLocale);
    await finishDrawing();
    assert.ok(await page.evaluate(month => window.drawnEditorText.some(text => text.includes(month)), cyrillic ? 'novembar' : 'новембар'));
    assert.notEqual(await page.locator('#editor-canvas').evaluate(canvas => canvas.toDataURL()), beforeScriptChange);
    await page.locator('.save-draft').click();
    await page.keyboard.press('Escape');
    await page.locator('[data-open-template]').click();
    await page.waitForFunction(() => document.querySelector('#editor')?.open);
    await page.locator('[data-panel="style"]').click();
    assert.equal(await page.locator('select[name="locale"]').inputValue(), otherLocale, 'Date script is restored with the local draft');
    await page.locator('.reset-design').click();
    assert.equal(await page.locator('select[name="locale"]').inputValue(), layout.locale);
    const pngDownload = page.waitForEvent('download'); await page.locator('.export-png').click();
    await (await pngDownload).saveAs(`/tmp/${baptism.id}-export.png`);
    const png = await fs.readFile(`/tmp/${baptism.id}-export.png`);
    assert.equal(png.readUInt32BE(16), 1500); assert.equal(png.readUInt32BE(20), 2100);
    const pdfDownload = page.waitForEvent('download'); await page.locator('.export-pdf').click();
    await (await pdfDownload).saveAs(`/tmp/${baptism.id}-export.pdf`);
    const pdf = (await fs.readFile(`/tmp/${baptism.id}-export.pdf`)).toString('latin1');
    assert.ok(pdf.startsWith('%PDF'));
    const box = pdf.match(/\/MediaBox \[0 0 ([\d.]+) ([\d.]+)\]/);
    assert.ok(box && Math.abs(Number(box[1]) - 360) < .001 && Math.abs(Number(box[2]) - 504) < .001);
    assert.ok(await page.locator('#editor').evaluate(dialog => dialog.scrollWidth <= dialog.clientWidth));
    await page.keyboard.press('Escape');
  }
  console.log('PASS: four baptism designs have crawlable SEO pages, image metadata, Cyrillic/Latin fonts and date switching, editable ceremony/reception, local drafts, no photo slot and valid mobile PNG/PDF downloads.');
  for (const template of eighteenTemplates) {
    assert.ok(map.includes(`/pozivnice/${template.slug}/`));
    await page.setViewportSize({ width: 320, height: 740 });
    const backgroundRequests = [];
    const watchBackgrounds = request => { if (request.url().includes('/punoletstvo/') && request.url().includes('-pozadina-')) backgroundRequests.push(request.url()); };
    page.on('request', watchBackgrounds);
    await page.goto(`${origin}/pozivnice/${template.slug}/`);
    assert.equal(await page.locator('h1').innerText(), templateTitle(template));
    assert.equal(await page.locator('meta[name="description"]').getAttribute('content'), template.description);
    assert.equal(await page.locator('meta[property="og:image:alt"]').getAttribute('content'), template.imageAlt);
    assert.equal(await page.locator('meta[name="twitter:image:alt"]').getAttribute('content'), template.imageAlt);
    const graph = JSON.parse(await page.locator('script[type="application/ld+json"]').textContent())['@graph'];
    assert.ok(graph.some(item => item['@type'] === 'ImageObject' && item.caption === template.imageAlt));
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    assert.deepEqual(backgroundRequests, [], 'Full invitation backgrounds load only after opening the editor');
    const layout = await (await fetch(`${origin}/api/templates/${template.id}`)).json();
    assert.equal(layout.category, 'eighteen');
    assert.equal(layout.layers.some(layer => layer.type === 'photo'), false);
    await page.locator('[data-open-template]').click();
    await page.waitForFunction(() => document.querySelector('#editor')?.open);
    await finishDrawing();
    assert.equal(await page.locator('#tab-photo').isVisible(), false);
    assert.equal(await page.locator('input[name="age"]').inputValue(), '18');
    for (const font of layout.fonts) assert.ok(await page.evaluate(family => [...document.fonts].some(face => face.family === family && face.status === 'loaded'), font.family));
    if (template.id === 'disko-sjaj') assert.ok(await page.evaluate(() => document.fonts.check('700 120px "DM Sans"', '18')));
    const before = await page.locator('#editor-canvas').evaluate(canvas => canvas.toDataURL());
    await page.locator('input[name="names"]').fill('Đorđe');
    await page.locator('[name="location"]').fill('Restoran Čarolija, Niš');
    await page.locator('input[name="rsvp"]').fill('Potvrdi dolazak do 1. novembra.');
    await page.locator('textarea[name="note"]').fill('Osamnaest želja.\nProslavi ih sa mnom!');
    await finishDrawing();
    assert.notEqual(await page.locator('#editor-canvas').evaluate(canvas => canvas.toDataURL()), before);
    await page.locator('.save-draft').click();
    await page.keyboard.press('Escape');
    await page.locator('[data-open-template]').click();
    await page.waitForFunction(() => document.querySelector('#editor')?.open);
    assert.equal(await page.locator('input[name="names"]').inputValue(), 'Đorđe');
    assert.equal(await page.locator('input[name="rsvp"]').inputValue(), 'Potvrdi dolazak do 1. novembra.');
    const pngDownload = page.waitForEvent('download'); await page.locator('.export-png').click();
    await (await pngDownload).saveAs(`/tmp/${template.id}-export.png`);
    const png = await fs.readFile(`/tmp/${template.id}-export.png`);
    assert.equal(png.readUInt32BE(16), 1500); assert.equal(png.readUInt32BE(20), 2100);
    const pdfDownload = page.waitForEvent('download'); await page.locator('.export-pdf').click();
    await (await pdfDownload).saveAs(`/tmp/${template.id}-export.pdf`);
    const pdf = (await fs.readFile(`/tmp/${template.id}-export.pdf`)).toString('latin1');
    assert.ok(pdf.startsWith('%PDF'));
    const box = pdf.match(/\/MediaBox \[0 0 ([\d.]+) ([\d.]+)\]/);
    assert.ok(box && Math.abs(Number(box[1]) - 360) < .001 && Math.abs(Number(box[2]) - 504) < .001);
    assert.ok(await page.locator('#editor').evaluate(dialog => dialog.scrollWidth <= dialog.clientWidth));
    await page.keyboard.press('Escape');
    page.off('request', watchBackgrounds);
  }
  console.log('PASS: three eighteenth-birthday designs have crawlable pages, distinct SEO/image metadata, lazy backgrounds, loaded fonts, editable names/RSVP, local drafts, no photo slot and valid PNG/PDF exports at 320px.');
  for (const template of eighteenCollectionTemplates) {
    assert.ok(map.includes(`/pozivnice/${template.slug}/`));
    await page.setViewportSize({ width: 320, height: 740 });
    const backgrounds = [];
    const watch = request => { if (request.url().includes('/punoletstvo-kolekcija/') && request.url().includes('-pozadina-')) backgrounds.push(request.url()); };
    page.on('request', watch);
    await page.goto(`${origin}/pozivnice/${template.slug}/`);
    assert.equal(await page.locator('meta[property="og:image:alt"]').getAttribute('content'), template.imageAlt);
    assert.equal(await page.locator('meta[name="twitter:image:alt"]').getAttribute('content'), template.imageAlt);
    const graph = JSON.parse(await page.locator('script[type="application/ld+json"]').textContent())['@graph'];
    assert.ok(graph.some(item => item['@type'] === 'ImageObject' && item.caption === template.imageAlt));
    assert.ok(graph.some(item => item['@type'] === 'BreadcrumbList'));
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    assert.deepEqual(backgrounds, [], 'Eighteenth-birthday detail pages use thumbnails before opening the editor');
    assert.equal(await page.locator('.ad-placement[hidden]').count(), 1);
    const layout = await (await fetch(`${origin}/api/templates/${template.id}`)).json();
    assert.equal(layout.category, 'eighteen');
    assert.equal(layout.layers.some(layer => layer.type === 'photo'), false);
    // Observe the text actually drawn, including letter-spaced names, instead
    // of checking only the form values before export.
    await page.evaluate(() => {
      window.drawnCollectionText = [];
      const original = CanvasRenderingContext2D.prototype.fillText;
      CanvasRenderingContext2D.prototype.fillText = function(text, ...args) {
        if (this.canvas.id === 'editor-canvas') window.drawnCollectionText.push(String(text));
        return original.call(this, text, ...args);
      };
    });
    await page.locator('[data-open-template]').click();
    await page.waitForFunction(() => document.querySelector('#editor')?.open);
    await finishDrawing();
    assert.ok(backgrounds.length > 0, 'The full background loads when opening the editor');
    assert.equal(await page.locator('#tab-photo').isVisible(), false);
    assert.equal(await page.locator('input[name="age"]').inputValue(), '18');
    for (const font of layout.fonts) assert.ok(await page.evaluate(family => [...document.fonts].some(face => face.family === family && face.status === 'loaded'), font.family));
    for (const layer of layout.layers.filter(layer => layer.type === 'text' && layer.editable && layer.text.includes('\n'))) {
      assert.equal(await page.locator(`#panel-text textarea[name="${layer.field}"]`).inputValue(), layer.text);
    }
    const before = await page.locator('#editor-canvas').evaluate(canvas => canvas.toDataURL());
    await page.locator('input[name="names"]').fill('Đorđe');
    await page.locator('input[name="date"]').fill('2027-05-15');
    await page.locator('input[name="time"]').fill('20:30');
    await page.locator('textarea[name="location"]').fill('Restoran Čarolija\nCvetna 8, Niš');
    await page.locator('[name="rsvp"]').fill('Potvrdi dolazak do 8. maja.');
    await page.locator('textarea[name="note"]').fill('Osamnaest želja.\nProslavi ih sa mnom!');
    await finishDrawing();
    assert.notEqual(await page.locator('#editor-canvas').evaluate(canvas => canvas.toDataURL()), before);
    assert.ok(await page.evaluate(() => window.drawnCollectionText.join('').toLocaleLowerCase('sr').includes('đorđe')),
      'Serbian diacritics must reach the canvas renderer');
    await page.locator('.save-draft').click(); await page.keyboard.press('Escape');
    await page.locator('[data-open-template]').click(); await page.waitForFunction(() => document.querySelector('#editor')?.open);
    assert.equal(await page.locator('input[name="names"]').inputValue(), 'Đorđe');
    assert.equal(await page.locator('textarea[name="location"]').inputValue(), 'Restoran Čarolija\nCvetna 8, Niš');
    assert.equal(await page.locator('textarea[name="note"]').inputValue(), 'Osamnaest želja.\nProslavi ih sa mnom!');
    assert.equal(await page.locator('[name="rsvp"]').inputValue(), 'Potvrdi dolazak do 8. maja.');
    const pngDownload = page.waitForEvent('download'); await page.locator('.export-png').click();
    await (await pngDownload).saveAs(`/tmp/eighteen-collection-${template.id}.png`);
    const png = await fs.readFile(`/tmp/eighteen-collection-${template.id}.png`);
    assert.equal(png.readUInt32BE(16), 1500); assert.equal(png.readUInt32BE(20), 2100);
    const pdfDownload = page.waitForEvent('download'); await page.locator('.export-pdf').click();
    await (await pdfDownload).saveAs(`/tmp/eighteen-collection-${template.id}.pdf`);
    const pdf = (await fs.readFile(`/tmp/eighteen-collection-${template.id}.pdf`)).toString('latin1');
    assert.ok(pdf.startsWith('%PDF'));
    const box = pdf.match(/\/MediaBox \[0 0 ([\d.]+) ([\d.]+)\]/);
    assert.ok(box && Math.abs(Number(box[1]) - 360) < .001 && Math.abs(Number(box[2]) - 504) < .001);
    assert.ok(await page.locator('#editor').evaluate(dialog => dialog.scrollWidth <= dialog.clientWidth));
    await page.keyboard.press('Escape'); page.off('request', watch);
  }
  console.log('PASS: nine new eighteenth-birthday designs have crawlable SEO pages, image metadata, lazy full backgrounds, loaded fonts, rendered Serbian diacritics, editable multiline locations/notes, local drafts, no photo field, ad placements and real PNG/PDF downloads at 320px.');
  for (const template of weddingTemplates) {
    assert.ok(map.includes(`/pozivnice/${template.slug}/`));
    await page.setViewportSize({ width: 320, height: 740 });
    const backgroundRequests = [];
    const watch = request => { if (request.url().includes('/vencanje/') && request.url().includes('-pozadina-')) backgroundRequests.push(request.url()); };
    page.on('request', watch);
    await page.goto(`${origin}/pozivnice/${template.slug}/`);
    assert.equal(await page.locator('meta[name="description"]').getAttribute('content'), template.description);
    assert.equal(await page.locator('meta[property="og:image:alt"]').getAttribute('content'), template.imageAlt);
    assert.equal(await page.locator('meta[name="twitter:image:alt"]').getAttribute('content'), template.imageAlt);
    const graph = JSON.parse(await page.locator('script[type="application/ld+json"]').textContent())['@graph'];
    assert.ok(graph.some(item => item['@type'] === 'ImageObject' && item.caption === template.imageAlt));
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    assert.deepEqual(backgroundRequests, [], 'Gallery and detail use thumbnails instead of full wedding backgrounds');
    const layout = await (await fetch(`${origin}/api/templates/${template.id}`)).json();
    assert.equal(layout.category, 'wedding'); assert.equal(layout.layers.some(layer => layer.type === 'photo'), false);
    await page.locator('[data-open-template]').click();
    await page.waitForFunction(() => document.querySelector('#editor')?.open);
    await finishDrawing();
    assert.equal(await page.locator('#tab-photo').isVisible(), false);
    for (const font of layout.fonts) assert.ok(await page.evaluate(family => [...document.fonts].some(face => face.family === family && face.status === 'loaded'), font.family));
    const before = await page.locator('#editor-canvas').evaluate(canvas => canvas.toDataURL());
    await page.locator('input[name="bride"]').fill('Anđela');
    await page.locator('input[name="groom"]').fill('Đorđe');
    await page.locator('input[name="date"]').fill('2027-08-28');
    await page.locator('input[name="ceremony_time"]').fill('15:30');
    await page.locator('input[name="ceremony_location"]').fill('Crkva Svetog Đorđa, Niš');
    await page.locator('input[name="time"]').fill('18:30');
    await page.locator('input[name="location"]').fill('Restoran Čarolija, Niš');
    await page.locator('input[name="rsvp"]').fill('Potvrda dolaska do 1. avgusta.');
    await finishDrawing();
    assert.notEqual(await page.locator('#editor-canvas').evaluate(canvas => canvas.toDataURL()), before);
    await page.locator('.save-draft').click(); await page.keyboard.press('Escape');
    await page.locator('[data-open-template]').click(); await page.waitForFunction(() => document.querySelector('#editor')?.open);
    assert.equal(await page.locator('input[name="bride"]').inputValue(), 'Anđela');
    assert.equal(await page.locator('input[name="groom"]').inputValue(), 'Đorđe');
    assert.equal(await page.locator('input[name="ceremony_time"]').inputValue(), '15:30');
    const pngDownload = page.waitForEvent('download'); await page.locator('.export-png').click();
    await (await pngDownload).saveAs(`/tmp/wedding-${template.id}.png`);
    const png = await fs.readFile(`/tmp/wedding-${template.id}.png`);
    assert.equal(png.readUInt32BE(16), 1500); assert.equal(png.readUInt32BE(20), 2100);
    const pdfDownload = page.waitForEvent('download'); await page.locator('.export-pdf').click();
    await (await pdfDownload).saveAs(`/tmp/wedding-${template.id}.pdf`);
    const pdf = (await fs.readFile(`/tmp/wedding-${template.id}.pdf`)).toString('latin1');
    assert.ok(pdf.startsWith('%PDF'));
    const box = pdf.match(/\/MediaBox \[0 0 ([\d.]+) ([\d.]+)\]/);
    assert.ok(box && Math.abs(Number(box[1]) - 360) < .001 && Math.abs(Number(box[2]) - 504) < .001);
    assert.ok(await page.locator('#editor').evaluate(dialog => dialog.scrollWidth <= dialog.clientWidth));
    await page.keyboard.press('Escape'); page.off('request', watch);
  }
  console.log('PASS: eight wedding designs have crawlable SEO pages, image metadata, lazy backgrounds, loaded fonts, independently editable names/ceremony/reception/RSVP, local drafts and valid PNG/PDF exports at 320px without photo fields.');
  for (const template of firstBirthdayTemplates) {
    assert.ok(map.includes(`/pozivnice/${template.slug}/`));
    await page.setViewportSize({ width: 320, height: 740 });
    const backgrounds = [];
    const watch = request => { if (request.url().includes('/prvi-rodjendan/') && request.url().includes('-pozadina-')) backgrounds.push(request.url()); };
    page.on('request', watch);
    await page.goto(`${origin}/pozivnice/${template.slug}/`);
    assert.equal(await page.locator('meta[property="og:image:alt"]').getAttribute('content'), template.imageAlt);
    assert.equal(await page.locator('meta[name="twitter:image:alt"]').getAttribute('content'), template.imageAlt);
    const graph = JSON.parse(await page.locator('script[type="application/ld+json"]').textContent())['@graph'];
    assert.ok(graph.some(item => item['@type'] === 'ImageObject' && item.caption === template.imageAlt));
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    assert.deepEqual(backgrounds, [], 'First-birthday detail must use the small thumbnail');
    assert.equal(await page.locator('.ad-placement[hidden]').count(), 1);
    const layout = await (await fetch(`${origin}/api/templates/${template.id}`)).json();
    assert.equal(layout.category, 'first'); assert.equal(layout.layers.some(layer => layer.type === 'photo'), false);
    assert.equal(layout.fonts.length, 2); assert.equal(layout.layers.find(layer => layer.field === 'age').text, '1.');
    await page.locator('[data-open-template]').click(); await page.waitForFunction(() => document.querySelector('#editor')?.open);
    await finishDrawing(); assert.equal(await page.locator('#tab-photo').isVisible(), false);
    for (const font of layout.fonts) assert.ok(await page.evaluate(family => [...document.fonts].some(face => face.family === family && face.status === 'loaded'), font.family));
    const before = await page.locator('#editor-canvas').evaluate(canvas => canvas.toDataURL());
    await page.locator('input[name="names"]').fill('Anđela');
    await page.locator('input[name="date"]').fill('2027-05-15');
    await page.locator('input[name="time"]').fill('16:30');
    await page.locator('input[name="location"]').fill('Igraonica Čarolija, Niš');
    await page.locator('input[name="rsvp"]').fill('Potvrdite dolazak do 1. maja.');
    await page.locator('textarea[name="note"]').fill('Jedna svećica i mnogo osmeha!\nProslavi sa mnom moj prvi rođendan.');
    await finishDrawing(); assert.notEqual(await page.locator('#editor-canvas').evaluate(canvas => canvas.toDataURL()), before);
    await page.locator('.save-draft').click(); await page.keyboard.press('Escape');
    await page.locator('[data-open-template]').click(); await page.waitForFunction(() => document.querySelector('#editor')?.open);
    assert.equal(await page.locator('input[name="names"]').inputValue(), 'Anđela');
    assert.equal(await page.locator('input[name="date"]').inputValue(), '2027-05-15');
    assert.equal(await page.locator('input[name="location"]').inputValue(), 'Igraonica Čarolija, Niš');
    const pngDownload = page.waitForEvent('download'); await page.locator('.export-png').click();
    await (await pngDownload).saveAs(`/tmp/first-birthday-${template.id}.png`);
    const png = await fs.readFile(`/tmp/first-birthday-${template.id}.png`);
    assert.equal(png.readUInt32BE(16), 1500); assert.equal(png.readUInt32BE(20), 2100);
    const pdfDownload = page.waitForEvent('download'); await page.locator('.export-pdf').click();
    await (await pdfDownload).saveAs(`/tmp/first-birthday-${template.id}.pdf`);
    const pdf = (await fs.readFile(`/tmp/first-birthday-${template.id}.pdf`)).toString('latin1');
    assert.ok(pdf.startsWith('%PDF'));
    const box = pdf.match(/\/MediaBox \[0 0 ([\d.]+) ([\d.]+)\]/);
    assert.ok(box && Math.abs(Number(box[1]) - 360) < .001 && Math.abs(Number(box[2]) - 504) < .001);
    assert.ok(await page.locator('#editor').evaluate(dialog => dialog.scrollWidth <= dialog.clientWidth));
    await page.keyboard.press('Escape'); page.off('request', watch);
  }
  console.log('PASS: ten first-birthday designs have crawlable pages, unique SEO/image metadata, shared local fonts, lazy backgrounds, editable details, local drafts, valid PNG/PDF exports at 320px, no photo slot and a global ad placement on every page.');
  for (const template of babyTemplates) {
    assert.ok(map.includes(`/pozivnice/${template.slug}/`));
    await page.setViewportSize({ width: 320, height: 740 });
    const backgrounds = [];
    const watch = request => { if (request.url().includes('/rodjenje-deteta/') && request.url().includes('-pozadina-')) backgrounds.push(request.url()); };
    page.on('request', watch);
    await page.goto(`${origin}/pozivnice/${template.slug}/`);
    assert.equal(await page.locator('meta[property="og:image:alt"]').getAttribute('content'), template.imageAlt);
    assert.equal(await page.locator('meta[name="twitter:image:alt"]').getAttribute('content'), template.imageAlt);
    const graph = JSON.parse(await page.locator('script[type="application/ld+json"]').textContent())['@graph'];
    assert.ok(graph.some(item => item['@type'] === 'ImageObject' && item.caption === template.imageAlt));
    assert.ok(graph.some(item => item['@type'] === 'BreadcrumbList'));
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    assert.deepEqual(backgrounds, [], 'Birth invitation pages use thumbnails before the editor opens');
    assert.equal(await page.locator('.ad-placement[hidden]').count(), 1);
    const layout = await (await fetch(`${origin}/api/templates/${template.id}`)).json();
    assert.equal(layout.category, 'baby'); assert.equal(layout.layers.some(layer => layer.type === 'photo'), false);
    await page.locator('[data-open-template]').click(); await page.waitForFunction(() => document.querySelector('#editor')?.open);
    await finishDrawing(); assert.equal(await page.locator('#tab-photo').isVisible(), false);
    for (const font of layout.fonts) assert.ok(await page.evaluate(family => [...document.fonts].some(face => face.family === family && face.status === 'loaded'), font.family));
    for (const layer of layout.layers.filter(layer => layer.text.includes('\n'))) assert.equal(await page.locator(`#panel-text textarea[name="${layer.field}"]`).inputValue(), layer.text);
    const before = await page.locator('#editor-canvas').evaluate(canvas => canvas.toDataURL());
    await page.locator('input[name="names"]').fill('Anđela');
    await page.locator('input[name="date"]').fill('2027-05-15');
    await page.locator('input[name="time"]').fill('16:30');
    await page.locator('[name="location"]').fill('Restoran Čarolija\nCvetna 8, Niš');
    await page.locator('input[name="rsvp"]').fill('Javite nam do 8. maja.');
    await page.locator('textarea[name="note"]').fill('Stigla je naša mala radost.\nProslavimo zajedno!');
    await finishDrawing(); assert.notEqual(await page.locator('#editor-canvas').evaluate(canvas => canvas.toDataURL()), before);
    await page.locator('.save-draft').click(); await page.keyboard.press('Escape');
    await page.locator('[data-open-template]').click(); await page.waitForFunction(() => document.querySelector('#editor')?.open);
    assert.equal(await page.locator('input[name="names"]').inputValue(), 'Anđela');
    assert.equal(await page.locator('[name="location"]').inputValue(), 'Restoran Čarolija\nCvetna 8, Niš');
    const pngDownload = page.waitForEvent('download'); await page.locator('.export-png').click();
    await (await pngDownload).saveAs(`/tmp/baby-${template.id}.png`);
    const png = await fs.readFile(`/tmp/baby-${template.id}.png`);
    assert.equal(png.readUInt32BE(16), 1500); assert.equal(png.readUInt32BE(20), 2100);
    const pdfDownload = page.waitForEvent('download'); await page.locator('.export-pdf').click();
    await (await pdfDownload).saveAs(`/tmp/baby-${template.id}.pdf`);
    const pdf = (await fs.readFile(`/tmp/baby-${template.id}.pdf`)).toString('latin1');
    assert.ok(pdf.startsWith('%PDF'));
    const box = pdf.match(/\/MediaBox \[0 0 ([\d.]+) ([\d.]+)\]/);
    assert.ok(box && Math.abs(Number(box[1]) - 360) < .001 && Math.abs(Number(box[2]) - 504) < .001);
    assert.ok(await page.locator('#editor').evaluate(dialog => dialog.scrollWidth <= dialog.clientWidth));
    await page.keyboard.press('Escape'); page.off('request', watch);
  }
  console.log('PASS: six birth invitation designs have crawlable pages, distinct SEO/image metadata, lazy backgrounds, local fonts, editable multiline details, saved drafts, valid mobile PNG/PDF downloads, no photo field and one global ad placement per page.');
  for (const infoPage of INFO_PAGES) {
    assert.ok(map.includes(`<loc>https://napravipozivnicu.com${infoPage.path}</loc>`));
    await page.goto(`${origin}${infoPage.path}`);
    for (const width of [320, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${infoPage.title} must fit at ${width}px`);
      assert.equal(await page.locator('.info-nav a[aria-current="page"]').count(), 1);
    }
    if (infoPage.id === 'contact') {
      await page.setViewportSize({ width: 320, height: 900 });
      await page.screenshot({ path: '/tmp/napravi-contact-mobile.png', fullPage: true });
    }
  }
  console.log('PASS: privacy/about/contact work without JS, footer navigation, visible mailto contact, unique SEO and structured page types, sitemap and 320–1440px layouts.');
  assert.deepEqual(errors, []);

  console.log(`PASS: landing/catalog/category HTML without JS, ${landingGzip}/${catalogGzip} bytes landing/catalog initial JS gzip (<10 KB each), lazy editor/PDF, all scrolled previews, filter cache, repeatable editor drawing.`);
} finally {
  await browser?.close();
  server.kill('SIGTERM');
}
