import { LitElement, css, html } from "lit";
import type { PropertyValues } from "lit";

let navIdCounter = 0;

/**
 * Navigation drawer for small screens.
 *
 * The links are rendered by Astro and stay in the light DOM, so they are in the page source for crawlers and keep
 * working without JavaScript; the element only moves them into a modal panel. That panel is a native `<dialog>`
 * opened with `showModal()`, which gives it the `dialog` role, `aria-modal`, the top layer, `::backdrop`, Escape
 * handling and an inert page behind it.
 *
 * @tagname ot-mobile-menu
 *
 * @slot trigger - The button that opens the menu. The element keeps `aria-haspopup`, `aria-expanded` and
 *   `aria-controls` in sync on it.
 * @slot - The navigation shown in the panel, typically a `<nav>` with links.
 *
 * @fires ot-menu-open - The menu opened. Bubbles and is composed, so it can be heard on `document`.
 * @fires ot-menu-close - The menu closed. Neither event fires while the element renders for the first time.
 *
 * @csspart dialog - The full-screen dialog; its backdrop is styled with `::backdrop`. Also the place to set the
 *   tokens below for the panel alone: they inherit down to the panel and the navigation slotted into it, without
 *   reaching the trigger, which stays on the page's own background.
 * @csspart panel - The panel on the right.
 *
 * @cssprop [--ot-color-background=#fff] - Panel background.
 * @cssprop [--ot-color-foreground=hsl(222.2 84% 4.9%)] - Panel text colour, inherited by the slotted navigation.
 * @cssprop [--ot-color-backdrop=rgb(0 0 0 / 0.5)] - The overlay behind the panel.
 * @cssprop [--ot-color-gray-600] - Close button colour.
 * @cssprop [--ot-color-orange=#ff5722] - Close button hover colour.
 * @cssprop [--ot-shadow-lg] - Panel shadow.
 * @cssprop [--ot-space=0.25rem] - Spacing unit; the panel's padding is six of them.
 */
export class OtMobileMenu extends LitElement {
  /* Values mirror the Tailwind utilities this markup used to carry, read from tokens with those as fallbacks. */
  static override styles = css`
    *,
    *::before,
    *::after {
      box-sizing: border-box;
    }
    /*
      The host holds the trigger, which sits on the page's own background, so it deliberately carries no colours of
      its own: a token set on the host would inherit into the trigger too. The panel's colours are set on the panel,
      and the page themes them through ::part(dialog).
    */
    :host {
      display: inline-block;
    }

    dialog {
      margin: 0;
      padding: 0;
      border: 0;
      max-width: none;
      max-height: none;
      width: 100%;
      height: 100%;
      background: none;
    }

    dialog::backdrop {
      background: var(--ot-color-backdrop, rgb(0 0 0 / 0.5));
    }

    .panel {
      position: absolute;
      right: 0;
      top: 0;
      height: 100%;
      width: 16rem;
      color: var(--ot-color-foreground, hsl(222.2 84% 4.9%));
      background: var(--ot-color-background, #fff);
      box-shadow: var(--ot-shadow-lg, 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1));
      padding: calc(var(--ot-space, 0.25rem) * 6);
    }

    .close {
      position: absolute;
      top: calc(var(--ot-space, 0.25rem) * 4);
      right: calc(var(--ot-space, 0.25rem) * 4);
      padding: calc(var(--ot-space, 0.25rem) * 2);
      color: var(--ot-color-gray-600, oklch(44.6% 0.03 256.802));
      background: none;
      border: 0;
      cursor: pointer;
    }

    .close:hover {
      color: var(--ot-color-orange, #ff5722);
    }

    .icon {
      display: block;
      height: 1.5rem;
      width: 1.5rem;
    }
  `;
  static override properties = {
    open: { type: Boolean, reflect: true },
    label: { type: String },
  };

  declare open: boolean;
  declare label: string;

  constructor() {
    super();
    this.open = false;
    this.label = "Menu";
  }

  override render() {
    return html`
      <slot name="trigger" @click=${this.#onToggle}></slot>
      <dialog
        part="dialog"
        aria-label=${this.label}
        @click=${this.#onDialogClick}
        @cancel=${this.#onCancel}
        @close=${this.#onDialogClose}
      >
        <div class="panel" part="panel">
          <button class="close" aria-label="Close menu" @click=${this.#onClose} type="button">
            <svg class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
          <slot></slot>
        </div>
      </dialog>
    `;
  }

  #onToggle = () => {
    this.open = !this.open;
  };

  #onClose = () => {
    this.open = false;
  };

  #onDialogClick = (e: Event) => {
    if (e.target === e.currentTarget) this.open = false;
  };

  #onCancel = (e: Event) => {
    e.preventDefault();
    this.open = false;
  };

  /**
   * The browser dispatches `close` in a task of its own, so it can arrive after the menu has been closed and
   * reopened — news about a dialog that is open again. The dialog's own state, not the event's arrival, decides.
   */
  #onDialogClose = () => {
    const dialog = this.renderRoot.querySelector("dialog");
    if (dialog && !dialog.open) this.open = false;
  };

  /**
   * The menu is for small screens: the site hides the element from the `md` breakpoint up, and so does its own
   * breakpoint listener. An open dialog there would be a modal nobody can see, with the page behind it inert. So an
   * `open` that arrives at that width, from script or written into the markup, is refused before anything renders.
   */
  override willUpdate(changed: PropertyValues<this>) {
    if (changed.has("open") && this.open && this.#mql.matches) this.open = false;
  }

  override updated(changed: PropertyValues<this>) {
    if (!changed.has("open")) return;

    this.#syncTrigger();
    this.#syncDialog();

    // Lit counts the constructor's `open = false` as a change, but nothing happened for the page to hear about. The
    // same goes for an `open` that willUpdate refused: the value ends where it started.
    const previous = changed.get("open");
    if (previous !== undefined && previous !== this.open) this.#dispatchChange();
  }

  /** `aria-controls` targets the slotted navigation, and names it when the consumer has not: an IDREF cannot cross
   * the shadow boundary. */
  #syncTrigger() {
    const trigger = this.#trigger;
    if (!trigger) return;

    trigger.setAttribute("aria-haspopup", "dialog");
    trigger.setAttribute("aria-expanded", String(this.open));

    const nav = this.#assigned("slot:not([name])")[0];
    if (nav) {
      nav.id ||= `ot-mobile-menu-nav-${++navIdCounter}`;
      trigger.setAttribute("aria-controls", nav.id);
    }
  }

  /**
   * `open` is the single source of truth: the dialog follows it, and focus follows the dialog.
   *
   * No focus trap of our own. `showModal()` makes everything outside the dialog inert, verified in Chromium,
   * Firefox and WebKit: nothing behind it takes focus, by Tab or by a script calling `focus()`. Tabbing past the
   * last element reaches the browser's own UI and comes back, which is a reasonable way out for the user; a
   * hand-written trap would only take that away.
   */
  #syncDialog() {
    const dialog = this.renderRoot.querySelector("dialog");
    if (!dialog) return;

    if (this.open && !dialog.open) {
      dialog.showModal();
      this.renderRoot.querySelector<HTMLElement>(".close")?.focus();
    } else if (!this.open && dialog.open) {
      dialog.close();
      this.#trigger?.focus();
    }
  }

  #dispatchChange() {
    // Spelled out rather than picked with a ternary, so the manifest analyzer can read the names.
    const init = { bubbles: true, composed: true };
    this.dispatchEvent(this.open ? new CustomEvent("ot-menu-open", init) : new CustomEvent("ot-menu-close", init));
  }

  get #trigger(): HTMLElement | undefined {
    return this.#assigned('slot[name="trigger"]')[0] as HTMLElement | undefined;
  }

  #assigned(slotSelector: string): Element[] {
    const slot = this.renderRoot.querySelector<HTMLSlotElement>(slotSelector);
    return slot?.assignedElements({ flatten: true }) ?? [];
  }

  #mql = window.matchMedia("(min-width: 48rem)");

  #onBreakpoint = (e: MediaQueryListEvent) => {
    if (e.matches) this.open = false;
  };

  override connectedCallback() {
    super.connectedCallback();
    this.#mql.addEventListener("change", this.#onBreakpoint);
  }

  override disconnectedCallback() {
    this.#mql.removeEventListener("change", this.#onBreakpoint);
    super.disconnectedCallback();
  }
}

if (!customElements.get("ot-mobile-menu")) customElements.define("ot-mobile-menu", OtMobileMenu);

declare global {
  interface HTMLElementTagNameMap {
    "ot-mobile-menu": OtMobileMenu;
  }
  interface HTMLElementEventMap {
    "ot-menu-open": CustomEvent<void>;
    "ot-menu-close": CustomEvent<void>;
  }
}
