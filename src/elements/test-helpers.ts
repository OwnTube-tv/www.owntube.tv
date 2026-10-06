/**
 * Helpers for the component tests.
 *
 * Component tests load an element on its own, not the site, so `src/index.css` and its `--ot-*` tokens are not
 * there. A fixture therefore plays the part of the consuming page and supplies the tokens itself — which is also
 * the more honest test: it checks the element's theming contract rather than one particular stylesheet.
 */

/** Mirrors the dark token set in src/index.css. */
export const DARK_TOKENS: Record<string, string> = {
  "--ot-color-background": "hsl(222.2 84% 4.9%)",
  "--ot-color-foreground": "hsl(210 40% 98%)",
  "--ot-color-gray-600": "oklch(70.7% 0.022 261.325)",
  "--ot-color-backdrop": "rgb(0 0 0 / 0.7)",
};

/** Turns a token map into an inline style, for use on a wrapper element around the component under test. */
export function tokenStyle(tokens: Record<string, string>): string {
  return Object.entries(tokens)
    .map(([name, value]) => `${name}: ${value}`)
    .join("; ");
}
