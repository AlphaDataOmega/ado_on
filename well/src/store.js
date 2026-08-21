// store.js — where a universe persists. Each universe is a named field on
// disk. The field is now stored COMPRESSED: each chunk's dense embedding is
// folded down the scale (scale.js) to depth WELL_D and packed as trits, so a
// universe on disk is a fraction of the float size — and WELL_D is the
// recall/size dial. Old sparse universes are migrated on load by re-embedding
// from their stored text.

import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';
import { denseEmbed, packEnc, unpackEnc } from './dense.js';
import { encode, decode } from '../scale.js';

export function wellHome() { return process.env.WELL_HOME || join(homedir(), '.well'); }
export function depth() { const d = parseInt(process.env.WELL_D || '8', 10); return Number.isFinite(d) && d > 0 ? d : 8; }
function uniPath(universe) { return join(wellHome(), (universe || 'default') + '.well.json'); }

export function load(universe = 'default') {
  const p = uniPath(universe);
  if (!existsSync(p)) return { universe, chunks: [], meta: { created: null, fed: 0, d: depth() } };
  const raw = JSON.parse(readFileSync(p, 'utf8'));
  for (const c of raw.chunks) {
    if (c.enc) c.vec = decode(unpackEnc(c.enc));      // decompress the stored field
    else c.vec = denseEmbed(c.text);                  // migrate an old sparse chunk from its text
  }
  return raw;
}

export function save(store) {
  const dir = wellHome(); if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  const d = store.meta.d || depth();
  const out = { universe: store.universe, meta: store.meta,
    chunks: store.chunks.map(c => ({ id: c.id, text: c.text, source: c.source,
      enc: c.enc || packEnc(encode(c.vec, d)) })) };
  writeFileSync(uniPath(store.universe), JSON.stringify(out));
}

export function addChunks(store, texts, source, now) {
  let base = store.chunks.length; const d = store.meta.d || depth();
  for (const text of texts) {
    const vec = denseEmbed(text);
    store.chunks.push({ id: 'c' + (base++), text, source: source || null, vec,
      enc: packEnc(encode(vec, d)) });     // fold to the scale at store time
  }
  store.meta.fed = (store.meta.fed || 0) + texts.length;
  store.meta.d = d;
  if (!store.meta.created) store.meta.created = now ?? null;
  return texts.length;
}

export function universes() {
  const dir = wellHome(); if (!existsSync(dir)) return [];
  return readdirSync(dir).filter(f => f.endsWith('.well.json')).map(f => f.replace('.well.json', ''));
}
