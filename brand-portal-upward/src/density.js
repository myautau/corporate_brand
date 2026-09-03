// Fill the largest gaps with existing glyphs, without moving or resizing originals.
// Deterministic positions avoid a different composition on every reload.
// These accent positions fill gaps across the moving cycle, not only t=0.
// All 50 original glyphs, artwork, sizes and depth-dependent speeds stay intact.
const balancedAccents = [
  { x: 560, y: 768 }, { x: 80, y: 64 }, { x: 320, y: 64 },
  { x: 400, y: 64 }, { x: 640, y: 320 }, { x: 240, y: 320 },
  { x: 1280, y: 64 }, { x: 1120, y: 384 }, { x: 880, y: 192 },
  { x: 880, y: 384 }, { x: 160, y: 768 }, { x: 1280, y: 640 },
  { x: 240, y: 768 }, { x: 1120, y: 64 },
  { x: 480, y: 384 }, { x: 1120, y: 768 },
];
// The last four accents fill recurring gaps sampled across 120 seconds of motion.
const accentSources = [2, 8, 13, 19, 25, 30, 36, 41, 47, 10, 22, 35, 24, 26, 40, 44];
export function densifySymbols(originals, ratio = .32) {
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
    const fallbackPosition = candidates.splice(bestIndex, 1)[0];
    const useBalancedAccents = originals.length === 50 && count === balancedAccents.length;
    const position = useBalancedAccents
      ? balancedAccents[i] : fallbackPosition;
    const source = originals[useBalancedAccents ? accentSources[i] : Math.floor((i + .5) * originals.length / count)];
    result.push({ ...source, ...position, sourceId: source.id, id: `${source.id}-density-${i}` });
  }
  return result;
}
