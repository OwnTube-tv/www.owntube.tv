/// <reference types="mocha" />
import { elementUpdated, expect, fixture, html, oneEvent } from "@open-wc/testing";
import { emulateMedia, sendKeys, setViewport } from "@web/test-runner-commands";
import { DARK_TOKENS, tokenStyle } from "./test-helpers";
import "./ot-mobile-menu";
import type { OtMobileMenu } from "./ot-mobile-menu";

/**
 * The tests exercise the public contract only — attribute, property, events, ARIA and focus — so the chrome inside
 * the shadow root stays free to change. The element wraps server-rendered markup, so every fixture starts from the
 * same light DOM the site ships.
 */
async function menuFixture() {
  return fixture<OtMobileMenu>(html`
    <ot-mobile-menu>
      <button slot="trigger" aria-label="Open menu"></button>
      <nav>
        <a href="/apps/">Apps</a>
        <a href="/consulting/">Consulting</a>
        <a href="/contact/">Contact</a>
      </nav>
    </ot-mobile-menu>
  `);
}

const trigger = (el: OtMobileMenu) => el.querySelector<HTMLButtonElement>('[slot="trigger"]')!;
const dialog = (el: OtMobileMenu) => el.shadowRoot!.querySelector("dialog")!;
const closeButton = (el: OtMobileMenu) => el.shadowRoot!.querySelector<HTMLButtonElement>(".close")!;
const links = (el: OtMobileMenu) => [...el.querySelectorAll<HTMLAnchorElement>("nav a")];

/** Focus inside a shadow root is only visible from that root; the document sees the host element. */
const focused = (el: OtMobileMenu) => el.shadowRoot!.activeElement ?? document.activeElement;

/** The menu exists for small screens, so the suites run at a phone's width; the test runner's default is 800 px. */
const PHONE = { width: 390, height: 844 };
const DESKTOP = { width: 1024, height: 768 };

beforeEach(async () => {
  await setViewport(PHONE);
});

async function openMenu(el: OtMobileMenu) {
  trigger(el).focus();
  trigger(el).click();
  await elementUpdated(el);
}

describe("ot-mobile-menu", () => {
  it("is defined and starts closed", async () => {
    const el = await menuFixture();
    expect(customElements.get("ot-mobile-menu")).to.exist;
    expect(el.open).to.be.false;
    expect(el.hasAttribute("open")).to.be.false;
  });

  it("reflects the open property to the attribute", async () => {
    const el = await menuFixture();
    el.open = true;
    await elementUpdated(el);
    expect(el.hasAttribute("open")).to.be.true;
  });

  it("opens from the attribute as well as the property", async () => {
    const el = await menuFixture();
    el.setAttribute("open", "");
    await elementUpdated(el);
    expect(el.open).to.be.true;
    expect(dialog(el).matches(":modal")).to.be.true;
  });

  it("opens when the slotted trigger is clicked", async () => {
    const el = await menuFixture();
    trigger(el).click();
    await elementUpdated(el);
    expect(el.open).to.be.true;
    expect(dialog(el).matches(":modal")).to.be.true;
  });

  it("passes an axe check while closed and while open", async () => {
    const el = await menuFixture();
    await expect(el).to.be.accessible();
    el.open = true;
    await elementUpdated(el);
    await expect(el).to.be.accessible();
  });
});

describe("ot-mobile-menu ARIA", () => {
  it("keeps aria-expanded on the trigger in sync", async () => {
    const el = await menuFixture();
    expect(trigger(el).getAttribute("aria-expanded")).to.equal("false");
    el.open = true;
    await elementUpdated(el);
    expect(trigger(el).getAttribute("aria-expanded")).to.equal("true");
    el.open = false;
    await elementUpdated(el);
    expect(trigger(el).getAttribute("aria-expanded")).to.equal("false");
  });

  it("marks the trigger as opening a dialog", async () => {
    const el = await menuFixture();
    expect(trigger(el).getAttribute("aria-haspopup")).to.equal("dialog");
  });

  it("points aria-controls at the slotted navigation", async () => {
    const el = await menuFixture();
    const id = trigger(el).getAttribute("aria-controls");
    expect(id, "the element generates an id when the consumer has not set one").to.be.a("string");
    // An IDREF cannot cross the shadow boundary, so the target has to be the slotted light-DOM navigation.
    expect(el.querySelector(`#${id}`)).to.equal(el.querySelector("nav"));
  });

  it("gives the dialog an accessible name that the consumer can override", async () => {
    const el = await menuFixture();
    expect(dialog(el).getAttribute("aria-label")).to.equal("Menu");

    const named = await fixture<OtMobileMenu>(html`
      <ot-mobile-menu label="Site navigation">
        <button slot="trigger" aria-label="Open menu"></button>
        <nav><a href="/apps/">Apps</a></nav>
      </ot-mobile-menu>
    `);
    expect(dialog(named).getAttribute("aria-label")).to.equal("Site navigation");
  });
});

describe("ot-mobile-menu focus", () => {
  it("moves focus into the panel when it opens", async () => {
    const el = await menuFixture();
    await openMenu(el);
    expect(focused(el)).to.equal(closeButton(el));
  });

  it("returns focus to the trigger when it closes", async () => {
    const el = await menuFixture();
    await openMenu(el);
    closeButton(el).click();
    await elementUpdated(el);
    expect(document.activeElement).to.equal(trigger(el));
  });

  it("keeps the page behind the dialog out of reach", async () => {
    const el = await menuFixture();
    // Something focusable outside the element, standing in for the rest of the page.
    const behind = await fixture<HTMLAnchorElement>(html`<a href="/contact/">Behind the dialog</a>`);
    await openMenu(el);

    // Tab past the last link. Where focus goes next is up to the browser — Chromium hands it to its own UI and
    // back, Firefox and WebKit differ — but it must never land on page content behind a modal dialog.
    for (let i = 0; i < links(el).length + 3; i++) {
      await sendKeys({ press: "Tab" });
      expect(document.activeElement, "focus escaped the dialog").to.not.equal(behind);
    }

    // Not even a script can pull focus out while the dialog is modal.
    behind.focus();
    expect(document.activeElement).to.not.equal(behind);
  });

  it("closes on Escape and returns focus to the trigger", async () => {
    const el = await menuFixture();
    await openMenu(el);

    await sendKeys({ press: "Escape" });
    await elementUpdated(el);

    expect(el.open).to.be.false;
    expect(document.activeElement).to.equal(trigger(el));
  });
});

describe("ot-mobile-menu dismissal", () => {
  it("closes when the backdrop is clicked", async () => {
    const el = await menuFixture();
    await openMenu(el);
    dialog(el).dispatchEvent(new MouseEvent("click", { bubbles: true, composed: true }));
    await elementUpdated(el);
    expect(el.open).to.be.false;
  });

  it("stays open when the panel is clicked", async () => {
    const el = await menuFixture();
    await openMenu(el);
    el.shadowRoot!.querySelector(".panel")!.dispatchEvent(new MouseEvent("click", { bubbles: true, composed: true }));
    await elementUpdated(el);
    expect(el.open).to.be.true;
  });

  it("survives a close and a reopen in the same turn", async () => {
    const el = await menuFixture();
    el.open = true;
    await elementUpdated(el);

    el.open = false;
    await elementUpdated(el);
    el.open = true;
    await elementUpdated(el);

    // `close` is dispatched in a task of its own, so it lands after both updates have run — news about a dialog
    // that has since been reopened. Acting on it would shut the menu the visitor just asked for.
    //
    // Waited for by the event, not by a timer: the two come from different task sources, and the browser is free
    // to run the timer first. With `setTimeout(0)` this test passed against the very bug it describes.
    await oneEvent(dialog(el), "close");
    await elementUpdated(el);

    expect(el.open, "the reopened menu stayed open").to.be.true;
    expect(dialog(el).open, "and so did its dialog").to.be.true;
  });
});

describe("ot-mobile-menu breakpoint", () => {
  /** Records both events on the document for the duration of one test. */
  function recordEvents() {
    const seen: string[] = [];
    const listener = (event: Event) => seen.push(event.type);
    document.addEventListener("ot-menu-open", listener);
    document.addEventListener("ot-menu-close", listener);
    return {
      seen,
      stop: () => {
        document.removeEventListener("ot-menu-open", listener);
        document.removeEventListener("ot-menu-close", listener);
      },
    };
  }

  it("closes when the viewport grows past the md breakpoint", async () => {
    const el = await menuFixture();
    await openMenu(el);
    const recorder = recordEvents();

    // The media query reports the new width with the next rendering update, not when setViewport resolves, so the
    // test waits for the element's own event rather than for one Lit update.
    const closed = oneEvent(el, "ot-menu-close");
    await setViewport(DESKTOP);
    await closed;
    await elementUpdated(el);
    recorder.stop();

    expect(el.open).to.be.false;
    expect(dialog(el).open).to.be.false;
    expect(recorder.seen).to.deep.equal(["ot-menu-close"]);
  });

  it("refuses to open from the md breakpoint up", async () => {
    await setViewport(DESKTOP);
    const el = await menuFixture();
    const recorder = recordEvents();

    el.open = true;
    await elementUpdated(el);
    el.setAttribute("open", "");
    await elementUpdated(el);
    recorder.stop();

    // An open modal inside a hidden host would leave the whole page inert behind a dialog nobody can see.
    expect(el.open, "the property").to.be.false;
    expect(el.hasAttribute("open"), "the reflected attribute").to.be.false;
    expect(dialog(el).open, "the dialog").to.be.false;
    expect(recorder.seen, "and nothing to report").to.deep.equal([]);
  });

  it("ignores an open attribute in the markup from the md breakpoint up", async () => {
    await setViewport(DESKTOP);
    const el = await fixture<OtMobileMenu>(html`
      <ot-mobile-menu open>
        <button slot="trigger" aria-label="Open menu"></button>
        <nav><a href="/apps/">Apps</a></nav>
      </ot-mobile-menu>
    `);
    await elementUpdated(el);

    expect(el.open).to.be.false;
    expect(dialog(el).open).to.be.false;
  });
});

describe("ot-mobile-menu events", () => {
  /** Records events on the document, which only see them because they are dispatched with `composed: true`. */
  function recordEvents() {
    const seen: string[] = [];
    const listener = (event: Event) => seen.push(event.type);
    document.addEventListener("ot-menu-open", listener);
    document.addEventListener("ot-menu-close", listener);
    return {
      seen,
      stop: () => {
        document.removeEventListener("ot-menu-open", listener);
        document.removeEventListener("ot-menu-close", listener);
      },
    };
  }

  it("dispatches nothing while rendering for the first time", async () => {
    const recorder = recordEvents();
    const el = await menuFixture();
    await elementUpdated(el);
    recorder.stop();
    // `open = false` in the constructor counts as a change for Lit, so the first update must not be mistaken
    // for something the user did.
    expect(recorder.seen).to.deep.equal([]);
  });

  it("dispatches one event per real change", async () => {
    const el = await menuFixture();
    const recorder = recordEvents();

    trigger(el).click();
    await elementUpdated(el);
    closeButton(el).click();
    await elementUpdated(el);
    el.open = false; // already closed
    await elementUpdated(el);

    recorder.stop();
    expect(recorder.seen).to.deep.equal(["ot-menu-open", "ot-menu-close"]);
  });
});

describe("ot-mobile-menu theming", () => {
  afterEach(async () => {
    await emulateMedia({ colorScheme: "light" });
  });

  /** A wrapper stands in for the page: tokens set there are inherited across the shadow boundary. */
  async function themedMenu(tokens: Record<string, string>) {
    const wrapper = await fixture<HTMLDivElement>(html`
      <div style=${tokenStyle(tokens)}>
        <ot-mobile-menu>
          <button slot="trigger" aria-label="Open menu"></button>
          <!-- The page colours its own links, the way Tailwind classes do on the site. -->
          <nav><a href="/apps/" style="color: #ff5722">Apps</a></nav>
        </ot-mobile-menu>
      </div>
    `);
    const menu = wrapper.querySelector<OtMobileMenu>("ot-mobile-menu")!;
    await elementUpdated(menu);
    return menu;
  }

  const panel = (menu: OtMobileMenu) => menu.shadowRoot!.querySelector(".panel")!;

  it("takes the panel colour from the page's tokens", async () => {
    const menu = await themedMenu(DARK_TOKENS);
    expect(getComputedStyle(panel(menu)).backgroundColor).to.equal("rgb(2, 8, 23)");
  });

  it("falls back to its own values when the page defines no tokens", async () => {
    const menu = await themedMenu({});
    expect(getComputedStyle(panel(menu)).backgroundColor).to.equal("rgb(255, 255, 255)");
  });

  /**
   * The site themes the panel through `::part(dialog)`. Tokens set on the element itself would inherit into the
   * trigger as well, and the trigger sits on the page's own background — pale grey on white in the dark theme.
   * The fixture carries the same stylesheet, so this breaks if the element starts colouring its host again.
   */
  it("themes the panel through ::part(dialog) and leaves the trigger to the page", async () => {
    const wrapper = await fixture<HTMLDivElement>(html`
      <div>
        <style>
          ot-mobile-menu::part(dialog) {
            --ot-color-foreground: hsl(210 40% 98%);
            --ot-color-gray-600: oklch(70.7% 0.022 261.325);
          }
        </style>
        <ot-mobile-menu>
          <!-- The page colours the trigger from the same token, the way the Tailwind class does on the site. -->
          <button
            slot="trigger"
            aria-label="Open menu"
            style="color: var(--ot-color-gray-600, oklch(44.6% 0.03 256.802))"
          ></button>
          <nav><a href="/apps/">Apps</a></nav>
        </ot-mobile-menu>
      </div>
    `);
    const menu = wrapper.querySelector<OtMobileMenu>("ot-mobile-menu")!;
    await elementUpdated(menu);

    const trigger = menu.querySelector("button")!;
    const close = menu.shadowRoot!.querySelector(".close")!;
    const nav = menu.querySelector("nav")!;

    expect(getComputedStyle(trigger).color, "the panel's tokens do not reach the trigger").to.equal(
      "oklch(0.446 0.03 256.802)"
    );
    expect(getComputedStyle(close).color, "the close button follows the panel's tokens").to.equal(
      "oklch(0.707 0.022 261.325)"
    );
    expect(getComputedStyle(nav).color, "the slotted navigation follows the panel's tokens").to.equal(
      "rgb(248, 250, 252)"
    );
  });

  it("stays accessible with the menu open in a dark theme", async () => {
    await emulateMedia({ colorScheme: "dark" });
    const menu = await themedMenu(DARK_TOKENS);
    menu.open = true;
    await elementUpdated(menu);
    await expect(menu).to.be.accessible();
  });
});
