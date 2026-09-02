// Families describe visual shapes, not asset filenames: the same glyph has
// separate Figma exports for different opacity, size and blur treatments.
const families = {
  bar: [1, 3, 6, 33, 36, 47, 49, 55, 56, 57, 81, 83, 85],
  dash: [4, 58, 59],
  fork: [8, 9, 70],
  openLeft: [10, 11, 74],
  openRight: [96],
  corner: [45, 78, 79, 100],
  slash: [50, 52, 54, 82],
  crossbar: [61, 86],
  bowl: [65],
  loop: [68, 89],
  arch: [69, 91, 93],
  reverseR: [76, 97, 102, 103, 105],
  step: [98],
  hook: [101],
  stem: [107],
  triangle: [109, 110],
  p: [113],
};
const familyByAsset = new Map(Object.entries(families).flatMap(([family, numbers]) =>
  numbers.map(number => [`assets/imgVector${number}.svg`, family])));

export const SAME_GLYPH_GAP = 180;

export function glyphFamily(symbol) {
  return familyByAsset.get(symbol.src) ?? symbol.src;
}

export function separateGlyphs(symbols) {
  const pool = new Map();
  for (const symbol of symbols) {
    const family = glyphFamily(symbol);
    if (!pool.has(family)) pool.set(family, []);
    pool.get(family).push(symbol);
  }
  const lastX = new Map();
  const result = [...symbols];
  const order = symbols.map((s, i) => i).sort((a, b) => symbols[a].x - symbols[b].x || a - b);
  for (const index of order) {
    const slot = symbols[index];
    let family = glyphFamily(slot);
    if (slot.x - (lastX.get(family) ?? -Infinity) < SAME_GLYPH_GAP) {
      // Prefer the family used farthest away, so repeats cannot catch up later.
      family = [...pool.keys()].sort((a, b) => (lastX.get(a) ?? -Infinity) - (lastX.get(b) ?? -Infinity))
        .find(candidate => slot.x - (lastX.get(candidate) ?? -Infinity) >= SAME_GLYPH_GAP);
      if (!family) throw new Error("Not enough distinct glyphs for the requested spacing");
    }
    lastX.set(family, slot.x);
    if (family === glyphFamily(slot)) {
      result[index] = { ...slot, glyphFamily: family, artworkSourceId: slot.sourceId ?? slot.id };
      continue;
    }
    const artwork = pool.get(family).reduce((best, item) =>
      Math.abs(item.alpha - slot.alpha) < Math.abs(best.alpha - slot.alpha) ? item : best);
    const scale = Math.max(slot.width, slot.height) / Math.max(artwork.width, artwork.height);
    result[index] = { ...slot, glyphFamily: family, artworkSourceId: artwork.sourceId ?? artwork.id,
      svg: artwork.svg, width: artwork.width * scale, height: artwork.height * scale };
  }
  return result;
}
