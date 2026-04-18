#!/usr/bin/env node
/**
 * Genera el CV en PDF a partir de src/assets/data/profile.json.
 * Usa Playwright (Chromium headless) para renderizar HTML y exportar A4.
 * Output: public/cv-gaspar-rodriguez.pdf
 *
 * Uso:
 *   npm run cv
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const PROFILE_PATH = join(ROOT, 'src/assets/data/profile.json');
const OUTPUT_PATH = join(ROOT, 'public/cv-gaspar-rodriguez.pdf');

// ========================================================================
// 1. Cargar datos
// ========================================================================
const profile = JSON.parse(readFileSync(PROFILE_PATH, 'utf-8'));

// ========================================================================
// 2. Helpers
// ========================================================================
const fmtDate = (iso, isCurrent) => {
  if (isCurrent) return 'Present';
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

const getFirstParagraph = (desc) => (desc ? desc.split('\n\n')[0] : '');
const getAchievements = (desc) => {
  if (!desc) return [];
  const parts = desc.split('\n\n');
  if (parts.length < 2) return [];
  return parts[1]
    .split('\n')
    .filter((l) => l.trim().startsWith('-'))
    .map((l) => l.trim().substring(1).trim());
};

const escapeHtml = (s = '') =>
  String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

// ========================================================================
// 3. Construir HTML con estética Art-Decó
// ========================================================================
const experienceHtml = (profile.experience || [])
  .map((exp) => {
    const achievements = getAchievements(exp.description);
    return `
      <article class="exp">
        <header class="exp-header">
          <h3>${escapeHtml(exp.title)}</h3>
          <span class="exp-company">${escapeHtml(exp.company)}</span>
          <time>${fmtDate(exp.startDate)} — ${fmtDate(exp.endDate, exp.isCurrent)}</time>
        </header>
        <p class="exp-desc">${escapeHtml(getFirstParagraph(exp.description))}</p>
        ${
          achievements.length
            ? `<ul class="exp-achievements">${achievements
                .map((a) => `<li>${escapeHtml(a)}</li>`)
                .join('')}</ul>`
            : ''
        }
        <div class="exp-skills">${(exp.skills || [])
          .slice(0, 8)
          .map((s) => `<span>${escapeHtml(s)}</span>`)
          .join('')}</div>
      </article>`;
  })
  .join('');

const educationHtml = (profile.education || [])
  .map(
    (ed) => `
      <article class="edu">
        <h3>${escapeHtml(ed.degree || ed.fieldOfStudy || '')}</h3>
        <span class="edu-school">${escapeHtml(ed.school || '')}</span>
        <time>${fmtDate(ed.startDate)} — ${fmtDate(ed.endDate)}</time>
      </article>`
  )
  .join('');

const certsHtml = (profile.certifications || [])
  .slice(0, 8)
  .map(
    (c) => `
      <li>
        <strong>${escapeHtml(c.name)}</strong>
        <span>${escapeHtml(c.issuingOrganization)} · ${fmtDate(c.issueDate)}</span>
      </li>`
  )
  .join('');

const html = /* html */ `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>${escapeHtml(profile.fullName)} — CV</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;900&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&display=swap">
    <style>
      :root {
        --cream: #f5e6d3;
        --cream-light: #fff8f0;
        --gold: #9a7b2d;
        --gold-light: #c9a962;
        --bronze: #6b5a3e;
        --black: #0d0d0d;
        --black-soft: #2a2a2a;
      }
      * { box-sizing: border-box; margin: 0; padding: 0; }
      html, body {
        background: var(--cream-light);
        color: var(--black);
        font-family: 'Libre Baskerville', Georgia, serif;
        font-size: 10.5pt;
        line-height: 1.55;
      }
      body { padding: 20mm 18mm; }
      h1, h2, h3, .display { font-family: 'Cinzel', serif; }

      /* Header "film title" */
      .header {
        text-align: center;
        border-top: 3px double var(--gold);
        border-bottom: 3px double var(--gold);
        padding: 14pt 0;
        margin-bottom: 18pt;
      }
      .header .year {
        font-family: 'Cinzel', serif;
        font-size: 9pt;
        letter-spacing: 0.3em;
        color: var(--gold);
        border: 1px solid var(--gold);
        display: inline-block;
        padding: 2pt 10pt;
        margin-bottom: 6pt;
      }
      .header h1 {
        font-size: 28pt;
        letter-spacing: 0.15em;
        font-weight: 900;
        color: var(--black);
      }
      .header .accent { color: var(--gold); }
      .header .headline {
        font-family: 'Playfair Display', serif;
        font-style: italic;
        font-size: 12pt;
        color: var(--black-soft);
        margin-top: 6pt;
      }
      .header .contact {
        font-family: 'Cinzel', serif;
        font-size: 8.5pt;
        letter-spacing: 0.12em;
        color: var(--bronze);
        margin-top: 8pt;
      }
      .header .contact span + span::before { content: ' · '; color: var(--gold); }

      /* Section titles */
      h2 {
        font-size: 13pt;
        letter-spacing: 0.2em;
        color: var(--gold);
        text-align: center;
        margin: 18pt 0 10pt;
        position: relative;
      }
      h2::before, h2::after {
        content: '';
        display: inline-block;
        width: 40pt;
        height: 1px;
        background: var(--gold);
        vertical-align: middle;
        margin: 0 8pt;
      }

      /* Summary */
      .summary {
        font-style: italic;
        text-align: center;
        color: var(--black-soft);
        max-width: 160mm;
        margin: 0 auto 6pt;
      }

      /* Experience */
      .exp { margin-bottom: 14pt; page-break-inside: avoid; }
      .exp-header {
        border-bottom: 1px dashed var(--gold);
        padding-bottom: 4pt;
        margin-bottom: 5pt;
      }
      .exp-header h3 {
        font-size: 12pt;
        font-weight: 600;
        letter-spacing: 0.08em;
      }
      .exp-company {
        display: inline-block;
        font-family: 'Cinzel', serif;
        font-size: 9pt;
        letter-spacing: 0.12em;
        color: var(--gold);
      }
      .exp-header time {
        float: right;
        font-family: 'Cinzel', serif;
        font-size: 8.5pt;
        color: var(--bronze);
      }
      .exp-desc { margin-bottom: 4pt; }
      .exp-achievements { padding-left: 14pt; margin-bottom: 4pt; }
      .exp-achievements li { margin-bottom: 2pt; font-size: 10pt; }
      .exp-achievements li::marker { color: var(--gold); content: '▸ '; }
      .exp-skills { margin-top: 3pt; }
      .exp-skills span {
        display: inline-block;
        font-family: 'Cinzel', serif;
        font-size: 7.5pt;
        letter-spacing: 0.08em;
        border: 1px solid var(--bronze);
        color: var(--black-soft);
        padding: 1pt 5pt;
        margin: 1pt 2pt 1pt 0;
      }

      /* Education */
      .edu { margin-bottom: 8pt; }
      .edu h3 { font-size: 11pt; }
      .edu-school { color: var(--gold); font-family: 'Cinzel', serif; font-size: 9pt; letter-spacing: 0.1em; }
      .edu time { float: right; font-family: 'Cinzel', serif; font-size: 8.5pt; color: var(--bronze); }

      /* Certifications */
      .certs { list-style: none; }
      .certs li { margin-bottom: 4pt; font-size: 9.5pt; }
      .certs strong { display: block; }
      .certs span { color: var(--bronze); font-family: 'Cinzel', serif; font-size: 8.5pt; letter-spacing: 0.1em; }

      /* Footer */
      .footer {
        margin-top: 14pt;
        padding-top: 10pt;
        border-top: 3px double var(--gold);
        text-align: center;
        font-family: 'Cinzel', serif;
        font-size: 8pt;
        letter-spacing: 0.3em;
        color: var(--gold);
      }
    </style>
  </head>
  <body>
    <header class="header">
      <div class="year">MCMXCII · Career start: ${new Date(profile.experience?.[profile.experience.length - 1]?.startDate || Date.now()).getFullYear()}</div>
      <h1>
        <span>${escapeHtml(profile.firstName?.toUpperCase() || '')}</span>
        <span class="accent">${escapeHtml(profile.lastName?.toUpperCase() || '')}</span>
      </h1>
      <div class="headline">${escapeHtml(profile.headline || '')}</div>
      <div class="contact">
        ${profile.email ? `<span>${escapeHtml(profile.email)}</span>` : ''}
        ${profile.location?.city ? `<span>${escapeHtml(profile.location.city)}, ${escapeHtml(profile.location.country || '')}</span>` : ''}
        ${profile.linkedInUrl ? `<span>linkedin.com/in/${escapeHtml(profile.vanityName || '')}</span>` : ''}
      </div>
    </header>

    ${profile.summary ? `<p class="summary">&ldquo; ${escapeHtml(profile.summary)} &rdquo;</p>` : ''}

    <h2>Professional Credits</h2>
    ${experienceHtml}

    ${educationHtml ? `<h2>Education</h2>${educationHtml}` : ''}

    ${certsHtml ? `<h2>Credentials</h2><ul class="certs">${certsHtml}</ul>` : ''}

    <footer class="footer">★ END OF REEL ★ FIN ★</footer>
  </body>
</html>`;

// ========================================================================
// 4. Renderizar con Chromium headless y exportar PDF
// ========================================================================
console.log('[cv-pdf] Launching Chromium…');
const browser = await chromium.launch();
const page = await browser.newPage();
await page.setContent(html, { waitUntil: 'networkidle' });
await page.emulateMedia({ media: 'print' });

console.log(`[cv-pdf] Writing ${OUTPUT_PATH}`);
await page.pdf({
  path: OUTPUT_PATH,
  format: 'A4',
  printBackground: true,
  margin: { top: '0mm', bottom: '0mm', left: '0mm', right: '0mm' },
});

await browser.close();

// Snapshot HTML para debug (fuera de public/)
const DEBUG_PATH = join(ROOT, 'scripts/.cv-debug.html');
writeFileSync(DEBUG_PATH, html, 'utf-8');
console.log(`[cv-pdf] Debug HTML: ${DEBUG_PATH}`);
console.log('[cv-pdf] Done.');
