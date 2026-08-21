#!/usr/bin/env node
// server.js — the well as an MCP tool, so an AI can drink from it mid-thought.
// Hand-rolled Model Context Protocol over stdio (newline-delimited JSON-RPC
// 2.0) — zero dependencies, works offline. Exposes three tools:
//   well.feed(text|path[, universe])  — pour content into the field
//   well.recall(query[, k, universe]) — grounded passages back out
//   well.ask(question[, universe])    — PRESENT (grounded) or ABSENT (honest)
//
// Register it with Claude Code:
//   claude mcp add well -- node /home/ubuntu/ado/well/mcp/server.js

import { Well } from '../src/well.js';
import { universes } from '../src/store.js';
import { encodeBytes, decodeBytes, bitsPerValue } from '../scale.js';

const PROTOCOL = '2024-11-05';
const send = (msg) => process.stdout.write(JSON.stringify(msg) + '\n');
const ok = (id, result) => send({ jsonrpc: '2.0', id, result });
const err = (id, code, message) => send({ jsonrpc: '2.0', id, error: { code, message } });

const TOOLS = [
  { name: 'well_feed', description: 'Pour content into a universe of the well (unlimited external context). Accepts raw text or a file path.',
    inputSchema: { type: 'object', properties: {
      content: { type: 'string', description: 'text to store, or a file path' },
      universe: { type: 'string', description: 'named field (default "default")' },
      source: { type: 'string', description: 'optional label for provenance' } }, required: ['content'] } },
  { name: 'well_recall', description: 'Draw the nearest grounded passages back out of the field, with scores and whether the field actually holds this (grounded) or is flat here.',
    inputSchema: { type: 'object', properties: {
      query: { type: 'string' }, k: { type: 'number', description: 'how many passages (default 5)' },
      universe: { type: 'string' } }, required: ['query'] } },
  { name: 'well_ask', description: 'Ask the field a question. Returns PRESENT with grounded evidence, or ABSENT when the field has no pole for it — honest abstention, never a confabulated answer.',
    inputSchema: { type: 'object', properties: {
      question: { type: 'string' }, universe: { type: 'string' } }, required: ['question'] } },
  { name: 'well_stats', description: 'What a universe holds, or the list of universes.',
    inputSchema: { type: 'object', properties: { universe: { type: 'string' } } } },
  { name: 'well_scale', description: 'The data-agnostic scale codec: encode text/data down d layers of keyed-residual trits (no floor, a dial) and report bits/value, fidelity, and whether it round-trips exactly. Descend further by raising d.',
    inputSchema: { type: 'object', properties: {
      content: { type: 'string' }, d: { type: 'number', description: 'layers to descend (default 12)' } }, required: ['content'] } },
];

function call(name, args) {
  const U = args.universe || 'default';
  if (name === 'well_feed') return new Well(U).feed(args.content, { source: args.source, now: Date.now() });
  if (name === 'well_recall') return new Well(U).recall(args.query, args.k || 5);
  if (name === 'well_ask') return new Well(U).ask(args.question);
  if (name === 'well_stats') return args.universe ? new Well(U).stats() : { universes: universes() };
  if (name === 'well_scale') {
    const bytes = new TextEncoder().encode(String(args.content || '')); const d = args.d || 12;
    const enc = encodeBytes(bytes, d); const back = decodeBytes(enc);
    let exact = true; for (let i = 0; i < bytes.length; i++) if (bytes[i] !== back[i]) { exact = false; break; }
    return { n: bytes.length, d: enc.layers.length, bitsPerValue: +bitsPerValue(enc).toFixed(2), exact };
  }
  throw new Error('unknown tool: ' + name);
}

let buf = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (d) => {
  buf += d;
  let nl;
  while ((nl = buf.indexOf('\n')) >= 0) {
    const line = buf.slice(0, nl).trim(); buf = buf.slice(nl + 1);
    if (!line) continue;
    let msg; try { msg = JSON.parse(line); } catch { continue; }
    handle(msg);
  }
});

function handle(msg) {
  const { id, method, params } = msg;
  if (method === 'initialize') return ok(id, { protocolVersion: PROTOCOL, capabilities: { tools: {} },
    serverInfo: { name: 'well', version: '0.1.0' } });
  if (method === 'notifications/initialized' || method === 'notifications/cancelled') return; // notifications: no reply
  if (method === 'ping') return ok(id, {});
  if (method === 'tools/list') return ok(id, { tools: TOOLS });
  if (method === 'tools/call') {
    try {
      const result = call(params.name, params.arguments || {});
      return ok(id, { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] });
    } catch (e) { return err(id, -32000, String(e.message || e)); }
  }
  if (id !== undefined) err(id, -32601, 'method not found: ' + method);
}

process.stderr.write('well MCP server ready (stdio)\n');
