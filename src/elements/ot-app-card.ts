import { LitElement, css, html } from "lit";
import type { PropertyValues } from "lit";

/** The visitor's platform, as far as the store links are concerned. */
export type VisitorPlatform = "ios" | "android" | "other";

/** Which destination a clicked link points at. */
export type LinkPlatform = "web" | "ios" | "android" | "source" | "other";

const PLATFORM_LABELS: Record<VisitorPlatform, string> = {
  ios: "Recommended for your iPhone or iPad",
  android: "Recommended for your Android device",
  other: "",
};

/** Reads the platform from the user agent. iPadOS reports itself as a Mac, but with touch points. */
function detectPlatform(): VisitorPlatform {
  const ua = navigator.userAgent;
  if (/android/i.test(ua)) return "android";
  if (/iphone|ipad|ipod/i.test(ua) || (/macintosh/i.test(ua) && navigator.maxTouchPoints > 1)) return "ios";
  return "other";
}

/**
 * Card for one featured app.
 *
 * The content — artwork, icon, name, description and the store links — is rendered by Astro and stays in the light
 * DOM, so it is in the page source for crawlers and keeps working without JavaScript. The card surface stays there
 * too, on the host and the wrappers around the slotted content, so the card looks finished before any script runs.
 * The element enhances it: it points out the store link that matches the visitor's platform and reports link clicks.
 *
 * Every link stays rendered and reachable whatever the platform; the recommendation is an addition, never a filter.
 *
 * @tagname ot-app-card
 *
 * @slot image - Artwork shown at the top of the card, above the body.
 * @slot - Body of the card: icon, name, source link and descriptions.
 * @slot links - The store links, kept last in the body.
 *
 * @fires ot-app-link-click - A link in the card was clicked. `detail` carries the app `name` and the `platform` the
 *   link points at, ready for analytics.
 *
 * @csspart badge - The "recommended for…" badge above the store links.
 *
 * @cssprop [--ot-color-foreground=hsl(222.2 84% 4.9%)] - Text colour, inherited by the slotted content.
 * @cssprop [--ot-color-orange=#ff5722] - Badge background.
 * @cssprop [--ot-color-dark=#1a1a1a] - Badge text, dark on the brand orange for contrast.
 * @cssprop [--ot-space=0.25rem] - Spacing unit; the badge's inset is six of them, matching the page's padding.
 */
export class OtAppCard extends LitElement {
  static override properties = {
    name: { type: String },
    webLink: { type: String, attribute: "web-link" },
    googleLink: { type: String, attribute: "google-link" },
    testflightLink: { type: String, attribute: "testflight-link" },
    githubRepo: { type: String, attribute: "github-repo" },
    platform: { type: String, reflect: true },
  };

  static override styles = css`
    *,
    *::before,
    *::after {
      box-sizing: border-box;
    }

    /*
      The card surface — background, radius, shadow and padding — stays in the light DOM, on the host and on the
      wrappers around the slotted content. It therefore paints together with the server-rendered HTML instead of
      appearing when the element upgrades, which is what a visitor on a slow connection sees, and all a visitor
      without JavaScript ever gets. The element only adds what needs scripting.

      Display is part of that: the element sets none, so the page's own layout — "flex flex-col" on the site — is in
      force from the first paint instead of changing under the visitor when the element upgrades.
    */
    :host {
      color: var(--ot-color-foreground, hsl(222.2 84% 4.9%));
    }

    .badge {
      align-self: flex-start;
      /* The badge sits between two padded light-DOM wrappers, so it carries the same inset itself. */
      margin: 0 calc(var(--ot-space, 0.25rem) * 6) calc(var(--ot-space, 0.25rem) * 2);
      padding: calc(var(--ot-space, 0.25rem) * 0.5) calc(var(--ot-space, 0.25rem) * 2);
      background: var(--ot-color-orange, #ff5722);
      color: var(--ot-color-dark, #1a1a1a);
      border-radius: 9999px;
      font-size: 0.75rem;
      line-height: 1rem;
      font-weight: 600;
    }
  `;

  /** Name of the app, used for the link-click event and for accessible names. */
  declare name: string;

  /** Link to the web version of the app. */
  declare webLink: string;

  /** Link to the app on Google Play. */
  declare googleLink: string;

  /** Link to the app on TestFlight. */
  declare testflightLink: string;

  /** Link to the app's source repository. */
  declare githubRepo: string;

  /**
   * The visitor's platform. Detected from the user agent, and reflected to the attribute so it can be read — or
   * overridden, which is what the tests do rather than pretending to be another device.
   */
  declare platform: VisitorPlatform;

  constructor() {
    super();
    this.name = "";
    this.webLink = "";
    this.googleLink = "";
    this.testflightLink = "";
    this.githubRepo = "";
    this.platform = detectPlatform();
  }

  override render() {
    // The badge is the label on a recommendation, so it says nothing unless there is a link to recommend: the link
    // attributes default to the empty string, and an app without a TestFlight build is a question of time.
    const label = this.#recommendedHref ? PLATFORM_LABELS[this.platform] : "";
    return html`
      <slot name="image"></slot>
      <slot @click=${this.#onLinkClick}></slot>
      ${label ? html`<p class="badge" part="badge">${label}</p>` : null}
      <slot name="links" @click=${this.#onLinkClick} @slotchange=${this.#markRecommendedLink}></slot>
    `;
  }

  override updated(changed: PropertyValues<this>) {
    if (changed.has("platform") || changed.has("googleLink") || changed.has("testflightLink")) {
      this.#markRecommendedLink();
    }
  }

  /** The store link this visitor is most likely to want, if any. */
  get #recommendedHref(): string {
    if (this.platform === "ios") return this.testflightLink;
    if (this.platform === "android") return this.googleLink;
    return "";
  }

  /** Links live in the light DOM, so the element marks them up rather than styling them from the shadow root. */
  #markRecommendedLink = () => {
    const recommended = this.#absolute(this.#recommendedHref);
    for (const link of this.#links()) {
      const isRecommended = recommended !== "" && link.href === recommended;
      link.toggleAttribute("data-ot-recommended", isRecommended);
      if (isRecommended) {
        link.setAttribute("aria-current", "true");
      } else {
        link.removeAttribute("aria-current");
      }
    }
  };

  #onLinkClick = (event: Event) => {
    const link = event.composedPath().find((node): node is HTMLAnchorElement => node instanceof HTMLAnchorElement);
    if (!link) return;

    this.dispatchEvent(
      new CustomEvent("ot-app-link-click", {
        bubbles: true,
        composed: true,
        detail: { name: this.name, platform: this.#platformOf(link.href) },
      })
    );
  };

  #links(): HTMLAnchorElement[] {
    const slot = this.renderRoot.querySelector<HTMLSlotElement>('slot[name="links"]');
    return (slot?.assignedElements({ flatten: true }) ?? []).flatMap((element) =>
      element instanceof HTMLAnchorElement ? [element] : [...element.querySelectorAll<HTMLAnchorElement>("a[href]")]
    );
  }

  #platformOf(href: string): LinkPlatform {
    if (href === this.#absolute(this.webLink)) return "web";
    if (href === this.#absolute(this.testflightLink)) return "ios";
    if (href === this.#absolute(this.googleLink)) return "android";
    if (href === this.#absolute(this.githubRepo)) return "source";
    return "other";
  }

  /** Anchors report absolute hrefs, so the attributes have to be resolved the same way before comparing. */
  #absolute(href: string): string {
    if (!href) return "";
    try {
      return new URL(href, document.baseURI).href;
    } catch {
      return "";
    }
  }
}

if (!customElements.get("ot-app-card")) customElements.define("ot-app-card", OtAppCard);

declare global {
  interface HTMLElementTagNameMap {
    "ot-app-card": OtAppCard;
  }

  interface HTMLElementEventMap {
    "ot-app-link-click": CustomEvent<{ name: string; platform: LinkPlatform }>;
  }
}
