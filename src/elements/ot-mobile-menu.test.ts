/// <reference types="mocha" />
import { elementUpdated, expect, fixture, html } from "@open-wc/testing";
import { sendKeys } from "@web/test-runner-commands";
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

  it("wraps focus from the last link back to the close button", async () => {
    const el = await menuFixture();
    await openMenu(el);

    for (let i = 0; i < links(el).length; i++) await sendKeys({ press: "Tab" });
    expect(document.activeElement, "focus should be on the last link").to.equal(links(el).at(-1));

    await sendKeys({ press: "Tab" });
    // A modal dialog makes the page behind it inert, but it does not trap Tab: without the element's own handling
    // focus would leave for the browser UI and land on document.body.
    expect(focused(el)).to.equal(closeButton(el));
  });

  it("wraps focus backwards from the close button to the last link", async () => {
    const el = await menuFixture();
    await openMenu(el);
    await sendKeys({ press: "Shift+Tab" });
    expect(document.activeElement).to.equal(links(el).at(-1));
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
