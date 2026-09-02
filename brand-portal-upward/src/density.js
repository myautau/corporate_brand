// Fill the largest gaps with existing glyphs, without moving or resizing originals.
// Deterministic positions avoid a different composition on every reload.
export function densifySymbols(originals, ratio = .18) {
  if (!originals.length) return [];
  const result = [...originals];
  const candidates = [];
  for (let y = 64; y <= 768; y += 80) {
    for (let x = 80; x <= 1360; x += 128) candidates.push({ x, y });
  }
  const count = Math.min(candidates.length, Math.round(originals.length * ratio));
  for (let i = 0; i < count; i++) {
    let bestIndex = 0;
    let bestDistance = -1;
    for (let j = 0; j < candidates.length; j++) {
      const c = candidates[j];
      const distance = Math.min(...result.map((s) => Math.hypot(c.x - s.x, c.y - s.y)));
      if (distance > bestDistance) { bestDistance = distance; bestIndex = j; }
    }
    const position = candidates.splice(bestIndex, 1)[0];
    const source = originals[Math.floor((i + .5) * originals.length / count)];
    result.push({ ...source, ...position, sourceId: source.id, id: `${source.id}-density-${i}` });
  }
  return result;
}
