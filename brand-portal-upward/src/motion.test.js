import test from "node:test";
import assert from "node:assert/strict";
import { letterTarget, upwardPosition, LOOP_DISTANCE, LOOP_MARGIN } from "./motion.js";

const letter = { x: 1080, y: 400, depth: 1 };
const rect = { width: 1440, height: 800 };
test("upward motion starts at the Figma position and moves continuously", () => {
  assert.equal(upwardPosition(letter, 0), letter.y);
  assert.equal(upwardPosition(letter, 2), letter.y - 96);
  assert.equal(upwardPosition({ ...letter, depth: .22 }, 2), letter.y - 55.440000000000055);
});
test("a full cycle returns to the same position", () => {
  assert.ok(Math.abs(upwardPosition(letter, LOOP_DISTANCE / 48) - letter.y) < 1e-9);
});
test("loop seam lies beyond both screen edges", () => {
  const seamTime = (letter.y + LOOP_MARGIN) / 48;
  assert.ok(upwardPosition(letter, seamTime - .001) < -95);
  assert.ok(upwardPosition(letter, seamTime + .001) > 895);
});
test("coordinates remain bounded over long sessions and pause preserves progress", () => {
  for (const t of [0, 30, 120, 86400, 1e7]) {
    const y = upwardPosition(letter, t);
    assert.ok(y >= -96 && y < 896);
    assert.equal(upwardPosition(letter, t), y);
  }
});
test("cursor focuses the glyph at its original center", () => {
  const target = letterTarget(letter, { x: 1080, y: 400 }, rect, 1, true, false);
  assert.equal(target.focus, 1);
  assert.equal(target.x, 4.5);
  assert.equal(target.y, 0);
});
test("distant planes move less than foreground", () => {
  const far = letterTarget({ ...letter, depth: .22 }, { x: 1080, y: 400 }, rect, 1, true, false);
  assert.equal(far.x, .99);
});
test("pointer leave restores the exact Figma rest state", () => {
  assert.deepEqual(letterTarget(letter, { x: 1080, y: 400 }, rect, 1, false, false), { focus: 0, x: 0, y: 0 });
});
test("reduced motion keeps focus but removes displacement", () => {
  assert.deepEqual(letterTarget(letter, { x: 1080, y: 400 }, rect, 1, true, true), { focus: 1, x: 0, y: 0 });
});
test("cursor mapping follows independently resized viewport coordinates", () => {
  const target = letterTarget(letter, { x: 540, y: 600 }, { width: 720, height: 1200 }, .5, true, false);
  assert.equal(target.focus, 1);
  assert.equal(target.x, 2.25);
});
