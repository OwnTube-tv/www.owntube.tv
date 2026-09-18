export class OtMobileMenu extends HTMLElement {
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
    this.#controller = new AbortController();
    const { signal } = this.#controller;

    this.#toggle = this.querySelector<HTMLElement>("#mobile-menu-toggle");
    this.#overlay = this.querySelector<HTMLElement>("#mobile-menu");
    this.#close = this.querySelector<HTMLElement>("#mobile-menu-close");

    this.#toggle?.addEventListener("click", this.#onToggle, { signal });
    this.#close?.addEventListener("click", this.#onClose, { signal });
    this.#overlay?.addEventListener("click", this.#onOverlayClick, { signal });

    this.#sync();
  }

  attributeChangedCallback(name: string) {
    if (name === "open") {
      this.#sync();
    }
  }

  #sync() {
    this.#overlay?.classList.toggle("hidden", !this.open);
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
