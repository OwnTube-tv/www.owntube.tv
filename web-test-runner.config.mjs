import { esbuildPlugin } from "@web/dev-server-esbuild";
import { playwrightLauncher } from "@web/test-runner-playwright";
import { sendKeysPlugin } from "@web/test-runner-commands/plugins";

/**
 * Component tests run in a real Chromium, not in jsdom: the elements rely on shadow DOM, slot assignment,
 * focus across the shadow boundary and the top layer, none of which jsdom implements faithfully.
 *
 * @type {import("@web/test-runner").TestRunnerConfig}
 */
export default {
  files: "src/elements/**/*.test.ts",
  nodeResolve: true,
  // sendKeysPlugin lets tests press real keys (Tab, Shift+Tab, Escape) instead of dispatching synthetic events,
  // which is the only way to verify focus order and the focus trap.
  plugins: [esbuildPlugin({ ts: true, target: "auto" }), sendKeysPlugin()],
  browsers: [playwrightLauncher({ product: "chromium" })],
};
