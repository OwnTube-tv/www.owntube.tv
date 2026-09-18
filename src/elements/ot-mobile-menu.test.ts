/// <reference types="mocha" />
import { elementUpdated, expect, fixture, html } from "@open-wc/testing";
import "./ot-mobile-menu";
import type { OtMobileMenu } from "./ot-mobile-menu";

/** The element wraps server-rendered markup, so every test starts from the same light DOM the site ships. */
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
    el.querySelector<HTMLButtonElement>('[slot="trigger"]')!.click();
    await elementUpdated(el);
    expect(el.open).to.be.true;
  });

  it("keeps aria-expanded on the trigger in sync", async () => {
    const el = await menuFixture();
    const trigger = el.querySelector('[slot="trigger"]')!;
    expect(trigger.getAttribute("aria-expanded")).to.equal("false");
    el.open = true;
    await elementUpdated(el);
    expect(trigger.getAttribute("aria-expanded")).to.equal("true");
  });

  it("passes an axe check while closed and while open", async () => {
    const el = await menuFixture();
    await expect(el).to.be.accessible();
    el.open = true;
    await elementUpdated(el);
    await expect(el).to.be.accessible();
  });
});
