#!/usr/bin/env node
// Generate a listening page; --generate also synthesizes both Azure voices.
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ids = [0, 1, 2, 3, 7, 9, 11, 17, 19, 23, 26, 32, 33, 40, 43];
const voices = ['hy-AM-AnahitNeural', 'hy-AM-HaykNeural'];
const args = process.argv.slice(2);
if (args.some(arg => !['--generate', '--force'].includes(arg))) {
  throw new Error('Usage: node scripts/audition-tts.mjs [--generate] [--force]');
}
const labels = JSON.parse(await readFile(path.join(root, 'assets/lables/labelsHy.json'), 'utf8'));
const selected = ids.map(id => labels.find(label => label.id === id));
if (selected.some(label => !label)) throw new Error('An audition label is missing.');
const escape = text => text.replace(/[&<>"']/g, char => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[char]);
const outDir = path.join(root, 'artifacts/tts-audition');
await mkdir(outDir, { recursive: true });
await writeFile(path.join(outDir, 'index.html'), `<!doctype html>
<html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Armenian voice audition</title>
<style>body{font:17px system-ui;margin:32px auto;padding:0 20px;max-width:1050px;color:#172033}table{width:100%;border-collapse:collapse}td,th{padding:16px 8px;text-align:left;border-bottom:1px solid #ddd}audio{max-width:100%;width:280px}.table{overflow:auto}</style>
<h1>Armenian voice audition</h1>
<p>Compare pronunciation, naturalness, and clarity. Include a native Armenian speaker in the review. These are the original labels, including punctuation and abbreviations.</p>
<p>Run <code>npm run tts:audition -- --generate</code> to create the audio before listening. Generation requires Azure credentials. A missing clip will not play.</p>
<div class="table"><table><thead><tr><th>Label</th><th>Anahit</th><th>Hayk</th></tr></thead><tbody>
${selected.map(label => `<tr><td lang="hy">${label.id}: ${escape(label.name)}</td>${voices.map(voice => `<td><audio controls preload="none" aria-label="${escape(`${voice}: ${label.name}`)}" src="${voice}/${label.id}.mp3"></audio></td>`).join('')}</tr>`).join('\n')}
</tbody></table></div></html>`);
console.log(`Listening page: ${path.join(outDir, 'index.html')}`);

if (args.includes('--generate')) {
  if (!process.env.AZURE_SPEECH_KEY || !process.env.AZURE_SPEECH_REGION) {
    throw new Error('Set AZURE_SPEECH_KEY and AZURE_SPEECH_REGION locally before generating.');
  }
  for (const voice of voices) {
    const result = spawnSync(process.execPath, [
      path.join(root, 'scripts/generate-tts.mjs'), '--lang', 'hy', '--ids', ids.join(','),
      '--voice', voice, '--audition', ...(args.includes('--force') ? ['--force'] : []),
    ], { stdio: 'inherit', env: process.env });
    if (result.error) throw result.error;
    if (result.status !== 0) process.exit(result.status ?? 1);
  }
}
