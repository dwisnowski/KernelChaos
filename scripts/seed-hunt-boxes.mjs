/**
 * RETIRED (ADR 0026 / 0027). Do not invent placeholder boxes.
 * Review boxes must be visually authored on hidden-object art, or omitted.
 */
console.error(
  "hunt:seed-boxes is retired (ADR 0027).\n" +
    "Ship dense hidden-object art in public/hunt/; add real boxes only when authored.",
);
process.exit(1);
