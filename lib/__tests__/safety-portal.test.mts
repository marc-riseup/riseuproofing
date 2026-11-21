import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { SAFETY_DOCUMENTS } from '../safety-docs/data.ts';
import { SAFETY_PORTAL_PASSWORD, generateSafetyToken } from '../safety-docs/auth.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const FILES_DIR = path.resolve(__dirname, '../safety-docs/files');

test('SAFETY_DOCUMENTS has exactly 8 documents matching requirements', () => {
  assert.equal(SAFETY_DOCUMENTS.length, 8);

  const enDocs = SAFETY_DOCUMENTS.filter(d => d.lang === 'en');
  const esDocs = SAFETY_DOCUMENTS.filter(d => d.lang === 'es');
  assert.equal(enDocs.length, 4);
  assert.equal(esDocs.length, 4);

  const enTitles = enDocs.map(d => `${d.code} ${d.titleEn}`);
  assert.deepEqual(enTitles, [
    'RU SAF 00 Injury and Illness Prevention Program (IIPP)',
    'RU SAF 10 Emergency Action and Fire Prevention Plan',
    'RU SAF 11 Hazard Communication Program',
    'RU SAF 12 Silica Exposure Control Plan',
  ]);

  const esTitles = esDocs.map(d => `${d.code} ${d.titleEs}`);
  assert.deepEqual(esTitles, [
    'RU SAF 00 ES Programa de Prevención de Lesiones y Enfermedades',
    'RU SAF 10 ES Plan de Acción en Emergencias y Prevención de Incendios',
    'RU SAF 11 ES Programa de Comunicación de Peligros',
    'RU SAF 12 ES Plan de Control de Exposición a la Sílice',
  ]);
});

test('All 8 safety PDF files exist on disk with valid PDF-1.4 headers', () => {
  for (const doc of SAFETY_DOCUMENTS) {
    const filePath = path.join(FILES_DIR, doc.filename);
    assert.ok(fs.existsSync(filePath), `File exists: ${doc.filename}`);
    const stat = fs.statSync(filePath);
    assert.ok(stat.size > 2000, `File ${doc.filename} has size > 2KB`);

    const header = Buffer.alloc(8);
    const fd = fs.openSync(filePath, 'r');
    fs.readSync(fd, header, 0, 8, 0);
    fs.closeSync(fd);
    assert.ok(header.toString('utf-8').startsWith('%PDF-1.4'), `File ${doc.filename} is valid PDF-1.4`);
  }
});

test('Safety portal password and HMAC token generation function as required', () => {
  assert.equal(SAFETY_PORTAL_PASSWORD, 'tejaazul26');
  const token = generateSafetyToken();
  assert.ok(typeof token === 'string' && token.length === 64);
  // Re-computing token yields deterministic HMAC
  assert.equal(generateSafetyToken(), token);
});

test('Robots configuration disallows /team/ route', async () => {
  const robotsModule = await import('../../app/robots.ts');
  const robots = robotsModule.default();
  const rules = Array.isArray(robots.rules) ? robots.rules : [robots.rules];
  const disallows = rules.flatMap((r: { disallow?: string | string[] }) => (Array.isArray(r.disallow) ? r.disallow : [r.disallow || '']));
  assert.ok(disallows.includes('/team/'), 'robots.ts must disallow /team/');
});
