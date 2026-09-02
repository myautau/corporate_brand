export const LOOP_MARGIN = 96;
export const LOOP_DISTANCE = 800 + LOOP_MARGIN * 2;

// The wrap is wholly outside the viewport, including the largest glyph and blur.
// Speeds are design pixels / second, independent of refresh rate and viewport size.
export function upwardPosition(letter, elapsedSeconds) {
  const speed = 22 + 26 * letter.depth;
  const phase = letter.y + LOOP_MARGIN - elapsedSeconds * speed;
  return ((phase % LOOP_DISTANCE + LOOP_DISTANCE) % LOOP_DISTANCE) - LOOP_MARGIN;
}

export function letterTarget(letter, pointer, rect, scale, active, reducedMotion) {
  const distance = Math.hypot(pointer.x - letter.x / 1440 * rect.width, pointer.y - letter.y / 800 * rect.height);
  const reach = Math.max(110, 185 * scale);
  const focus = active ? Math.exp(-Math.pow(distance / reach, 2)) : 0;
  const nx = active ? (pointer.x / rect.width - .5) * 2 : 0;
  const ny = active ? (pointer.y / rect.height - .5) * 2 : 0;
  return { focus, x: reducedMotion ? 0 : nx * 9 * letter.depth * scale,
    y: reducedMotion ? 0 : ny * 7 * letter.depth * scale };
}
