import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import layout from "./symbols.json" with { type: "json" };
import { densifySymbols } from "./density.js";
import { separateGlyphs, glyphFamily, SAME_GLYPH_GAP } from "./glyph-spacing.js";
import { upwardPosition } from "./motion.js";

const originals = densifySymbols(layout).map(s => {
  const svg = readFileSync(new URL(`../${s.src}`, import.meta.url), "utf8");
  const [, , width, height] = svg.match(/viewBox="([^"]+)"/)[1].split(" ").map(Number);
  const alpha = Number(svg.match(/fill-opacity="([^"]+)"/)?.[1] ?? 1);
  return { ...s, svg, width, height, alpha, depth: alpha >= .5 ? 1 : alpha >= .3 ? .55 : .22 };
});
const arranged = separateGlyphs(originals);

test("same visual shapes are recognized across different exports", () => {
  assert.equal(glyphFamily({src:"assets/imgVector109.svg"}), glyphFamily({src:"assets/imgVector110.svg"}));
  assert.equal(glyphFamily({src:"assets/imgVector6.svg"}), glyphFamily({src:"assets/imgVector83.svg"}));
});
test("identical glyphs have horizontally separated trajectories", () => {
  for (let i = 0; i < arranged.length; i++) for (let j = i + 1; j < arranged.length; j++) {
    const a = arranged[i], b = arranged[j];
    if (a.glyphFamily === b.glyphFamily) assert.ok(Math.abs(a.x-b.x) >= SAME_GLYPH_GAP, `${a.id} / ${b.id}`);
  }
});
test("spacing survives different speeds and loop seams over ten minutes", () => {
  for (let t = 0; t <= 600; t += 2) for (let i = 0; i < arranged.length; i++) for (let j = i+1; j < arranged.length; j++) {
    const a = arranged[i], b = arranged[j];
    if (a.glyphFamily === b.glyphFamily) {
      const distance = Math.hypot(a.x-b.x, upwardPosition(a,t)-upwardPosition(b,t));
      assert.ok(distance >= SAME_GLYPH_GAP);
    }
  }
});
test("all slots retain their positions, depth, speed and visual scale", () => {
  assert.equal(arranged.length,originals.length);
  arranged.forEach((s,i) => {
    for (const key of ["id","x","y","alpha","depth"]) assert.equal(s[key], originals[i][key]);
    assert.ok(Math.abs(Math.max(s.width,s.height)-Math.max(originals[i].width,originals[i].height)) < 1e-8);
    const artwork = originals.find(a=>(a.sourceId??a.id)===s.artworkSourceId);
    assert.ok(Math.abs(s.width/s.height-artwork.width/artwork.height) < 1e-8);
  });
});
