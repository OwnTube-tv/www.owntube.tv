/**
 * Generates custom-elements.json, the machine-readable description of the site's elements: attributes, properties,
 * events, slots and CSS parts. Editors and documentation tools read it, and it is regenerated with `npm run analyze`.
 */
export default {
  globs: ["src/elements/**/*.ts"],
  // The manifest describes the elements' public API. The tests are not part of it, and neither is the scaffolding
  // they share — `test-helpers.ts` was otherwise documented alongside the elements as if consumers could use it.
  exclude: ["src/elements/**/*.test.ts", "src/elements/test-helpers.ts"],
  outdir: ".",
  litelement: true,
};
