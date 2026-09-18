import { esbuildPlugin } from "@web/dev-server-esbuild";
import { playwrightLauncher } from "@web/test-runner-playwright";

/**
 * Component tests run in a real Chromium, not in jsdom: the elements rely on shadow DOM, slot assignment,
 * focus across the shadow boundary and the top layer, none of which jsdom implements faithfully.
 *
 * @type {import("@web/test-runner").TestRunnerConfig}
 */
export default {
  files: "src/elements/**/*.test.ts",
  nodeResolve: true,
  plugins: [esbuildPlugin({ ts: true, target: "auto" })],
  browsers: [playwrightLauncher({ product: "chromium" })],
};
