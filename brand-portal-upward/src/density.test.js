import test from "node:test";
import assert from "node:assert/strict";
import layout from "./symbols.json" with { type: "json" };
import { densifySymbols } from "./density.js";

test("density adds twelve accents without changing original glyphs", () => {
  const snapshot = JSON.stringify(layout);
  const result = densifySymbols(layout);
  assert.equal(result.length, 62);
  assert.deepEqual(result.slice(0, layout.length), layout);
  assert.equal(JSON.stringify(layout), snapshot);
  assert.equal(new Set(result.map(s => s.id)).size, result.length);
});
test("new glyphs reuse exact artwork, dimensions and depth styles", () => {
  for (const extra of densifySymbols(layout).slice(layout.length)) {
    const source = layout.find(s => s.id === extra.sourceId);
    for (const key of ["src", "w", "h", "px", "py", "depth"]) assert.equal(extra[key], source[key]);
    assert.ok(extra.x >= 80 && extra.x <= 1360 && extra.y >= 64 && extra.y <= 768);
  }
});
test("composition is stable across reloads and handles empty data", () => {
  assert.deepEqual(densifySymbols(layout), densifySymbols(layout));
  assert.deepEqual(densifySymbols([]), []);
});
