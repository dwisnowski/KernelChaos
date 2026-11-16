/**
 * RETIRED as a scene pipeline (ADR 0027).
 * Sticker-board compositing was rejected — Picture Hunt uses dense hidden-object illustrations.
 * Author scenes by generating seek-and-find art into public/hunt/<id>.jpg, then run hunt:coverage.
 */
console.error(
  "hunt:compose sticker boards are retired (ADR 0027).\n" +
    "Generate dense hidden-object illustrations into public/hunt/<id>.jpg, then: npm run hunt:coverage",
);
process.exit(1);
