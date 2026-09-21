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
 * @csspart dialog - The full-screen dialog; its backdrop is styled with `::backdrop`.
 * @csspart panel - The panel on the right.
 *
 * @cssprop [--ot-color-background=#fff] - Panel background.
 * @cssprop [--ot-color-foreground=hsl(222.2 84% 4.9%)] - Text colour, inherited by the slotted navigation.
 * @cssprop [--ot-color-backdrop=rgb(0 0 0 / 0.5)] - The overlay behind the panel.
 * @cssprop [--ot-color-gray-600] - Close button colour.
 * @cssprop [--ot-color-orange=#ff5722] - Close button hover colour.
 * @cssprop [--ot-shadow-lg] - Panel shadow.
 * @cssprop [--ot-space=0.25rem] - Spacing unit; the panel's padding is six of them.
 */
export class OtMobileMenu extends LitElement {
  static override styles = css`
    *,
    *::before,
    *::after {
      box-sizing: border-box;
    }
    :host {
      display: inline-block;
      color: var(--ot-color-foreground, hsl(222.2 84% 4.9%));
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
      /* absolute right-0 top-0 h-full w-64 bg-white shadow-lg p-6 */
      position: absolute;
      right: 0;
      top: 0;
      height: 100%;
      width: 16rem; /* w-64 */
      background: var(--ot-color-background, #fff);
      box-shadow: var(--ot-shadow-lg, 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1));
      padding: calc(var(--ot-space, 0.25rem) * 6);
    }

    .close {
      /* absolute top-4 right-4 p-2 */
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
        @keydown=${this.#onKeydown}
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

  #onDialogClose = () => {
    this.open = false;
  };

  #onKeydown = (e: KeyboardEvent) => {
    if (e.key !== "Tab") return;

    const focusable = this.#focusable();
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const current = this.shadowRoot?.activeElement ?? document.activeElement;

    if (e.shiftKey && current === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && current === last) {
      e.preventDefault();
      first.focus();
    }
  };

  #focusable(): HTMLElement[] {
    const close = this.renderRoot.querySelector<HTMLElement>(".close");

    const slot = this.renderRoot.querySelector<HTMLSlotElement>("slot:not([name])");
    const slotted = slot?.assignedElements({ flatten: true }) ?? [];
    const links = slotted.flatMap((el) =>
      Array.from(el.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"))
    );

    return [close, ...links].filter((el): el is HTMLElement => el !== null);
  }

  override updated(changed: PropertyValues<this>) {
    if (!changed.has("open")) return;

    const dialog = this.renderRoot.querySelector("dialog");
    const slot = this.renderRoot.querySelector<HTMLSlotElement>('slot[name="trigger"]');
    const trigger = slot?.assignedElements({ flatten: true })[0] as HTMLElement | undefined;
    const closeButton = this.renderRoot.querySelector<HTMLElement>(".close");

    const nav = this.renderRoot
      .querySelector<HTMLSlotElement>("slot:not([name])")
      ?.assignedElements({ flatten: true })[0];

    if (nav) {
      nav.id ||= `ot-mobile-menu-nav-${++navIdCounter}`;
      trigger?.setAttribute("aria-controls", nav.id);
    }

    if (dialog) {
      if (this.open && !dialog.open) {
        dialog.showModal();
        closeButton?.focus();
      } else if (!this.open && dialog.open) {
        dialog.close();
        trigger?.focus();
      }
    }

    trigger?.setAttribute("aria-haspopup", "dialog");
    trigger?.setAttribute("aria-expanded", String(this.open));

    // Eventet bara vid en verklig ändring
    const previous = changed.get("open");
    if (previous === undefined) return;

    // Spelled out rather than picking the name with a ternary, so the manifest analyzer can read them.
    const init = { bubbles: true, composed: true };
    this.dispatchEvent(this.open ? new CustomEvent("ot-menu-open", init) : new CustomEvent("ot-menu-close", init));
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

!customElements.get("ot-mobile-menu") && customElements.define("ot-mobile-menu", OtMobileMenu);

declare global {
  interface HTMLElementTagNameMap {
    "ot-mobile-menu": OtMobileMenu;
  }
  interface HTMLElementEventMap {
    "ot-menu-open": CustomEvent<void>;
    "ot-menu-close": CustomEvent<void>;
  }
}
