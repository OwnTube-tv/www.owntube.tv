# Custom elements

The site's interactive UI is built as [Lit](https://lit.dev) custom elements, one file per element with an `ot-` prefix. `index.ts` imports them all and is loaded once from `RootLayout.astro`, so every page ships a single module script (6.7 kB gzipped, Lit included).

Run `npm run analyze` to regenerate [`custom-elements.json`](../../custom-elements.json), the machine-readable version of everything below.

## The rule these elements follow

**Content stays in the light DOM; the elements own the chrome.**

Astro renders the site to static HTML. Anything an element created inside its shadow root would exist only after JavaScript ran — invisible to crawlers, and missing for a visitor whose script failed to load. So the navigation links, the app artwork, the descriptions and every store link are rendered by Astro and projected through slots. The elements add the parts that only make sense with scripting: a modal panel, focus management, a platform recommendation.

Two consequences worth knowing before changing them:

- **Document CSS does not reach into a shadow root.** Tailwind's utilities and its preflight stop at the boundary, which is why each element carries its own `box-sizing` reset and writes plain CSS. Slotted content is the exception: it lives in the light DOM and keeps its Tailwind classes.
- **CSS custom properties do cross the boundary.** They are the theming channel, together with `::part()`.

## `<ot-mobile-menu>`

Navigation drawer for small screens. The panel is a native `<dialog>` opened with `showModal()`, so the platform provides the `dialog` role, `aria-modal`, the top layer, `::backdrop`, Escape handling, and an inert page behind it.

### Attributes and properties

| Attribute | Property | Type      | Default  | Description                                                   |
| --------- | -------- | --------- | -------- | ------------------------------------------------------------- |
| `open`    | `open`   | `boolean` | `false`  | Whether the menu is open. Reflected, so CSS can use `[open]`. |
| `label`   | `label`  | `string`  | `"Menu"` | Accessible name of the dialog.                                |

### Events

| Event           | Detail | When             |
| --------------- | ------ | ---------------- |
| `ot-menu-open`  | —      | The menu opened. |
| `ot-menu-close` | —      | The menu closed. |

Both bubble and are `composed`, so they cross the shadow boundary and can be listened for on `document`. Neither is dispatched while the element renders for the first time.

### Slots

| Slot        | Content                                                                                                               |
| ----------- | --------------------------------------------------------------------------------------------------------------------- |
| `trigger`   | The button that opens the menu. The element keeps `aria-haspopup`, `aria-expanded` and `aria-controls` in sync on it. |
| _(default)_ | The navigation shown in the panel, typically a `<nav>` with links.                                                    |

### CSS parts

| Part     | Element                                                             |
| -------- | ------------------------------------------------------------------- |
| `dialog` | The full-screen dialog, whose backdrop is styled with `::backdrop`. |
| `panel`  | The sliding panel on the right.                                     |

### Accessibility notes

- Focus moves to the close button when the menu opens and returns to the trigger when it closes.
- Tab and Shift+Tab wrap inside the panel. A modal dialog stops the page behind it from taking focus, but it does not trap Tab, so the element collects the focusable elements from both trees — the close button lives in the shadow root, the links are slotted — and turns around at the ends.
- `aria-controls` points at the slotted navigation, and the element generates an id when the consumer has not set one: an IDREF cannot cross the shadow boundary, so it has to target light-DOM content.
- Both `cancel` and `close` are handled, because a browser may close a modal dialog on Escape without a cancelable `cancel` event.
- Crossing the `md` breakpoint closes the menu. An open modal inside a `display: none` host would show nothing while leaving the page inert.

### Usage

```html
<ot-mobile-menu class="md:hidden">
  <button slot="trigger" class="p-2" aria-label="Open menu">…</button>
  <nav class="flex flex-col space-y-8 mt-8">
    <a href="/apps/">Apps</a>
  </nav>
</ot-mobile-menu>
```

## `<ot-app-card>`

Card for one featured app. It owns the card surface and points out the store link that matches the visitor's platform.

### Attributes and properties

| Attribute         | Property         | Type                            | Default  | Description                                                                                                                                         |
| ----------------- | ---------------- | ------------------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`            | `name`           | `string`                        | `""`     | Name of the app, reported in the link-click event.                                                                                                  |
| `web-link`        | `webLink`        | `string`                        | `""`     | Link to the web version.                                                                                                                            |
| `google-link`     | `googleLink`     | `string`                        | `""`     | Link to Google Play.                                                                                                                                |
| `testflight-link` | `testflightLink` | `string`                        | `""`     | Link to TestFlight.                                                                                                                                 |
| `github-repo`     | `githubRepo`     | `string`                        | `""`     | Link to the source repository.                                                                                                                      |
| `platform`        | `platform`       | `"ios" \| "android" \| "other"` | detected | The visitor's platform. Detected from the user agent and reflected; set it to override, which is what the tests do rather than faking a user agent. |

### Events

| Event               | Detail                                                                           | When                                                                                |
| ------------------- | -------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `ot-app-link-click` | `{ name: string, platform: "web" \| "ios" \| "android" \| "source" \| "other" }` | A link inside the card was clicked. `platform` is the destination, not the visitor. |

### Slots

| Slot        | Content                                                                           |
| ----------- | --------------------------------------------------------------------------------- |
| `image`     | Artwork at the top of the card.                                                   |
| _(default)_ | Icon, name, source link and descriptions.                                         |
| `links`     | The store buttons. The recommendation badge is rendered directly above this slot. |

### CSS parts

| Part    | Element                                               |
| ------- | ----------------------------------------------------- |
| `body`  | The padded column below the artwork.                  |
| `badge` | The "recommended for…" badge above the store buttons. |

### How the recommendation works

The element owns the **state**, the page owns the **styling**. On the matching link it sets `aria-current="true"` and a `data-ot-recommended` attribute; `HomeContent.astro` styles that attribute with a Tailwind `data-[ot-recommended]:` variant. The same split as `::part()`: the component exposes a hook, the consumer decides how it looks.

Every link stays rendered and reachable whatever the platform. The recommendation adds emphasis; it never filters.

### Usage

```html
<ot-app-card name="Blender Tube" web-link="…" google-link="…" testflight-link="…" github-repo="…">
  <img slot="image" src="…" alt="Blender Tube" />
  <h3>Blender Tube</h3>
  <p>…</p>
  <div slot="links" class="flex flex-col gap-2">
    <a href="…" class="w-fit data-[ot-recommended]:outline-2">…</a>
  </div>
</ot-app-card>
```

## Tests

`npm test` runs the suites in `*.test.ts` next to each element, in a real Chromium through Playwright. jsdom is not an option here: shadow DOM, slot assignment, focus across the shadow boundary and the top layer either behave differently there or are missing, and the axe checks need a real accessibility tree.

The tests exercise the public contract — attributes, properties, events, ARIA and focus — not the markup inside the shadow root, so the chrome stays free to change.
