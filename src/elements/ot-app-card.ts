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
 * DOM, so it is in the page source for crawlers and keeps working without JavaScript. The element enhances it: it
 * points out the store link that matches the visitor's platform and reports link clicks.
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
 * @csspart body - The padded column below the artwork.
 * @csspart badge - The "recommended for…" badge above the store links.
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

    /* The card surface itself. Values mirror the Tailwind utilities the markup used to carry. */
    :host {
      display: flex;
      flex-direction: column;
      overflow: hidden;
      border-radius: 0.5rem; /* rounded-lg */
      background: #fff; /* bg-white */
      box-shadow:
        0 10px 15px -3px rgb(0 0 0 / 0.1),
        0 4px 6px -4px rgb(0 0 0 / 0.1); /* shadow-lg */
      transition: box-shadow 150ms cubic-bezier(0.4, 0, 0.2, 1); /* transition-shadow */
    }

    :host(:hover) {
      box-shadow:
        0 20px 25px -5px rgb(0 0 0 / 0.1),
        0 8px 10px -6px rgb(0 0 0 / 0.1); /* hover:shadow-xl */
    }

    .body {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      padding: 1.5rem; /* p-6 */
    }

    .badge {
      align-self: flex-start;
      margin-bottom: 0.5rem;
      padding: 0.125rem 0.5rem;
      border-radius: 9999px;
      background: #ff5722; /* owntube-orange */
      /* Dark text, not white: white on the brand orange is 3.16:1, below the 4.5:1 WCAG AA needs at this size. */
      color: #1a1a1a; /* owntube-dark */
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
    const label = PLATFORM_LABELS[this.platform];
    return html`
      <slot name="image"></slot>
      <div class="body" part="body" @click=${this.#onLinkClick}>
        <slot></slot>
        ${label ? html`<p class="badge" part="badge">${label}</p>` : null}
        <slot name="links" @slotchange=${this.#markRecommendedLink}></slot>
      </div>
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
