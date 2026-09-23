/**
 * Generates custom-elements.json, the machine-readable description of the site's elements: attributes, properties,
 * events, slots and CSS parts. Editors and documentation tools read it, and it is regenerated with `npm run analyze`.
 */
export default {
  globs: ["src/elements/**/*.ts"],
  exclude: ["src/elements/**/*.test.ts"],
  outdir: ".",
  litelement: true,
};
