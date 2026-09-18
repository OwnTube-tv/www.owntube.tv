export class OtMobileMenu extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" }); // skapar this.shadowRoot
  }
  // Vilka attribut webbläsaren ska bevaka
  static get observedAttributes() {
    return ["open"];
  }

  // Städning: ett AbortController tar bort alla lyssnare på en gång
  #controller?: AbortController;

  // Declared on the class, so every method can reach them
  #toggle: HTMLElement | null = null;
  #overlay: HTMLElement | null = null;
  #close: HTMLElement | null = null;

  get open() {
    return this.hasAttribute("open");
  }
  set open(value: boolean) {
    this.toggleAttribute("open", Boolean(value));
  }

  // Arrow functions, så att "this" alltid är elementet
  #onToggle = () => {
    this.open = !this.open;
  };

  #onClose = () => {
    this.open = false;
  };

  #onOverlayClick = (e: Event) => {
    if (e.target === this.#overlay) this.open = false;
  };

  connectedCallback() {
    this.shadowRoot!.innerHTML = `
        <style>
            *, *::before, *::after { box-sizing: border-box; }
            :host {
              display: inline-block;
            }

            /* Attributet styr synligheten direkt, ingen hidden-klass behövs */
             :host([open]) .overlay {
              display: block;
            }

            .overlay {                    /* fixed inset-0 z-50 bg-black/50 */
              display: none;
              position: fixed;
              inset: 0;
              z-index: 50;
              background: rgb(0 0 0 / 0.5);
            }

            .panel {                      /* absolute right-0 top-0 h-full w-64 bg-white shadow-lg p-6 */
              position: absolute;
              right: 0;
              top: 0;
              height: 100%;
              width: 16rem;               /* w-64 */
              background: #fff;
              box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1),
                          0 4px 6px -4px rgb(0 0 0 / 0.1);
              padding: 1.5rem;            /* p-6 */
            }

            .close {                      /* absolute top-4 right-4 p-2 */
              position: absolute;
              top: 1rem;
              right: 1rem;
              padding: 0.5rem;
              background: none;
              border: 0;
              cursor: pointer;
              color: #4b5563;             /* text-gray-600 */
            }

            .close:hover { color: #f60; } /* byts mot var(--ot-color-orange) i steg 4 */

            .icon {  display: block; height: 1.5rem; width: 1.5rem; }
        </style>
      <slot name="trigger"></slot>

       <div class="overlay" part="overlay">
        <div class="panel" part="panel">
          <button class="close" aria-label="Close menu">
            <svg class="icon" fill="none" viewBox="0 0 24 24"
                 stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round"
                    d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
          <slot></slot>
        </div>
      </div>
    `;

    this.#controller = new AbortController();
    const { signal } = this.#controller;

    this.#toggle = this.querySelector<HTMLElement>("#mobile-menu-toggle");
    this.#overlay = this.shadowRoot!.querySelector<HTMLElement>(".overlay");
    this.#close = this.shadowRoot!.querySelector<HTMLElement>(".close");

    this.#toggle?.addEventListener("click", this.#onToggle, { signal });
    this.#close?.addEventListener("click", this.#onClose, { signal });
    this.#overlay?.addEventListener("click", this.#onOverlayClick, { signal });

    // Light DOM via sloten
    const slot = this.shadowRoot!.querySelector<HTMLSlotElement>('slot[name="trigger"]');
    this.#toggle = slot?.assignedElements()[0] as HTMLElement | null;

    this.#sync();
  }

  attributeChangedCallback(name: string) {
    if (name === "open") {
      this.#sync();
    }
  }

  #sync() {
    this.#toggle?.setAttribute("aria-expanded", String(this.open));
  }

  disconnectedCallback() {
    this.#controller?.abort(); // alla lyssnare bort
  }
}

!customElements.get("ot-mobile-menu") && customElements.define("ot-mobile-menu", OtMobileMenu);

declare global {
  interface HTMLElementTagNameMap {
    "ot-mobile-menu": OtMobileMenu;
  }
}
