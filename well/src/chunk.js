// chunk.js — text goes into the field in bites the field can hold. We split
// on paragraph and sentence boundaries, then pack to a target size so each
// chunk is a coherent unit of meaning, not a fixed byte window.

export function chunk(text, { target = 700, max = 1200 } = {}) {
  const paras = String(text).replace(/\r/g, '').split(/\n{2,}/).map(p => p.trim()).filter(Boolean);
  const out = [];
  for (const p of paras) {
    if (p.length <= max) { pushPacked(out, p, target, max); continue; }
    // long paragraph — split on sentence ends
    let buf = '';
    for (const sent of p.split(/(?<=[.!?])\s+/)) {
      if ((buf + ' ' + sent).length > max && buf) { out.push(buf.trim()); buf = sent; }
      else buf = buf ? buf + ' ' + sent : sent;
    }
    if (buf.trim()) pushPacked(out, buf.trim(), target, max);
  }
  return out.filter(Boolean);
}

// pack small paragraphs together up to target, so a chunk is a real unit
function pushPacked(out, piece, target, max) {
  const last = out[out.length - 1];
  if (last && last.length + piece.length + 1 <= target) out[out.length - 1] = last + '\n' + piece;
  else out.push(piece);
}
