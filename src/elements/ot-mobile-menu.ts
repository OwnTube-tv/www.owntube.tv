import { LitElement, css, html } from "lit";
import type { PropertyValues } from "lit";

export class OtMobileMenu extends LitElement {
  static override styles = css`
    *,
    *::before,
    *::after {
      box-sizing: border-box;
    }
    :host {
      display: inline-block;
    }

    /* Attributet styr synligheten direkt, ingen hidden-klass behövs */
    :host([open]) .overlay {
      display: block;
    }

    .overlay {
      /* fixed inset-0 z-50 bg-black/50 */
      display: none;
      position: fixed;
      inset: 0;
      z-index: 50;
      background: rgb(0 0 0 / 0.5);
    }

    .panel {
      /* absolute right-0 top-0 h-full w-64 bg-white shadow-lg p-6 */
      position: absolute;
      right: 0;
      top: 0;
      height: 100%;
      width: 16rem; /* w-64 */
      background: #fff;
      box-shadow:
        0 10px 15px -3px rgb(0 0 0 / 0.1),
        0 4px 6px -4px rgb(0 0 0 / 0.1);
      padding: 1.5rem; /* p-6 */
    }

    .close {
      /* absolute top-4 right-4 p-2 */
      position: absolute;
      top: 1rem;
      right: 1rem;
      padding: 0.5rem;
      background: none;
      border: 0;
      cursor: pointer;
      color: #4b5563; /* text-gray-600 */
    }

    .close:hover {
      color: #f60;
    } /* byts mot var(--ot-color-orange) i steg 4 */

    .icon {
      display: block;
      height: 1.5rem;
      width: 1.5rem;
    }
  `;
  static override properties = {
    open: { type: Boolean, reflect: true },
  };

  declare open: boolean;

  constructor() {
    super();
    this.open = false;
  }

  override render() {
    return html`
      <slot name="trigger" @click=${this.#onToggle}></slot>

      <div class="overlay" part="overlay" @click=${this.#onOverlayClick}>
        <div class="panel" part="panel">
          <button class="close" aria-label="Close menu" @click=${this.#onClose} type="button">
            <svg class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
          <slot></slot>
        </div>
      </div>
    `;
  }

  #onToggle = () => {
    this.open = !this.open;
  };

  #onClose = () => {
    this.open = false;
  };

  #onOverlayClick = (e: Event) => {
    if (e.target === e.currentTarget) this.open = false;
  };

  override updated(changed: PropertyValues<this>) {
    if (!changed.has("open")) return;

    const slot = this.renderRoot.querySelector<HTMLSlotElement>('slot[name="trigger"]');
    const trigger = slot?.assignedElements({ flatten: true })[0] as HTMLElement | undefined;

    trigger?.setAttribute("aria-expanded", String(this.open));

    // Eventet bara vid en verklig ändring
    const previous = changed.get("open");
    if (previous === undefined) return;

    this.dispatchEvent(
      new CustomEvent(this.open ? "ot-menu-open" : "ot-menu-close", {
        bubbles: true,
        composed: true,
      })
    );
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
