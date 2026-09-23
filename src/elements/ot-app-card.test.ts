/// <reference types="mocha" />
import { elementUpdated, expect, fixture, html } from "@open-wc/testing";
import { emulateMedia } from "@web/test-runner-commands";
import { DARK_TOKENS, tokenStyle } from "./test-helpers";
import "./ot-app-card";
import type { OtAppCard, VisitorPlatform } from "./ot-app-card";

const WEB = "https://cust-app-test.owntube.tv/";
const GOOGLE = "https://play.google.com/store/apps/details?id=com.owntubetv.test";
const TESTFLIGHT = "https://testflight.apple.com/join/test";
const GITHUB = "https://github.com/OwnTube-tv/cust-app-test";

/** The platform attribute overrides detection, so the tests state the device instead of faking a user agent. */
async function cardFixture(platform?: VisitorPlatform) {
  const card = await fixture<OtAppCard>(html`
    <ot-app-card
      name="Test Tube"
      web-link=${WEB}
      google-link=${GOOGLE}
      testflight-link=${TESTFLIGHT}
      github-repo=${GITHUB}
      platform=${platform ?? "other"}
    >
      <img slot="image" src="/googleplay.png" alt="Test Tube" />
      <h3>Test Tube</h3>
      <a href=${GITHUB}>Source</a>
      <div slot="links">
        <a href=${WEB}>View the web version</a>
        <a href=${GOOGLE}>Google Play</a>
        <a href=${TESTFLIGHT}>TestFlight</a>
      </div>
    </ot-app-card>
  `);
  await elementUpdated(card);
  return card;
}

const storeLinks = (card: OtAppCard) => [...card.querySelectorAll<HTMLAnchorElement>('[slot="links"] a')];
const recommended = (card: OtAppCard) => storeLinks(card).filter((link) => link.hasAttribute("data-ot-recommended"));
const badge = (card: OtAppCard) => card.shadowRoot!.querySelector(".badge");

describe("ot-app-card", () => {
  it("is defined and projects its slotted content", async () => {
    const card = await cardFixture();
    expect(customElements.get("ot-app-card")).to.exist;
    expect(storeLinks(card)).to.have.lengthOf(3);
  });

  it("passes an axe check", async () => {
    await expect(await cardFixture("ios")).to.be.accessible();
  });
});

describe("ot-app-card platform recommendation", () => {
  it("points an iOS visitor at TestFlight", async () => {
    const card = await cardFixture("ios");
    expect(recommended(card).map((link) => link.href)).to.deep.equal([TESTFLIGHT]);
    expect(recommended(card)[0].getAttribute("aria-current")).to.equal("true");
    expect(badge(card)?.textContent).to.contain("iPhone");
  });

  it("points an Android visitor at Google Play", async () => {
    const card = await cardFixture("android");
    expect(recommended(card).map((link) => link.href)).to.deep.equal([GOOGLE]);
    expect(badge(card)?.textContent).to.contain("Android");
  });

  it("recommends nothing on other platforms", async () => {
    const card = await cardFixture("other");
    expect(recommended(card)).to.be.empty;
    expect(badge(card)).to.be.null;
  });

  it("keeps every link reachable, whatever the platform", async () => {
    const card = await cardFixture("ios");
    for (const link of storeLinks(card)) {
      expect(link.checkVisibility(), `${link.href} should stay visible`).to.be.true;
      expect(link.hasAttribute("hidden")).to.be.false;
    }
  });

  it("follows a change of platform", async () => {
    const card = await cardFixture("ios");
    card.platform = "android";
    await elementUpdated(card);
    expect(recommended(card).map((link) => link.href)).to.deep.equal([GOOGLE]);
  });
});

describe("ot-app-card link clicks", () => {
  /** Clicking an anchor would navigate the test page, so the default is suppressed for the one click. */
  async function clickAndCapture(card: OtAppCard, link: HTMLAnchorElement) {
    const events: CustomEvent<{ name: string; platform: string }>[] = [];
    const listener = (event: Event) => events.push(event as CustomEvent<{ name: string; platform: string }>);
    document.addEventListener("ot-app-link-click", listener);
    link.addEventListener("click", (event) => event.preventDefault(), { once: true });
    link.dispatchEvent(new MouseEvent("click", { bubbles: true, composed: true, cancelable: true }));
    await elementUpdated(card);
    document.removeEventListener("ot-app-link-click", listener);
    return events;
  }

  it("reports which destination was clicked", async () => {
    const card = await cardFixture("ios");
    const [web, google, testflight] = storeLinks(card);

    expect((await clickAndCapture(card, web))[0].detail).to.deep.equal({ name: "Test Tube", platform: "web" });
    expect((await clickAndCapture(card, google))[0].detail.platform).to.equal("android");
    expect((await clickAndCapture(card, testflight))[0].detail.platform).to.equal("ios");
  });

  it("crosses the shadow boundary so the page can listen on document", async () => {
    const card = await cardFixture();
    const events = await clickAndCapture(card, storeLinks(card)[0]);
    expect(events, "the event needs bubbles and composed to reach the document").to.have.lengthOf(1);
  });
});

describe("ot-app-card theming", () => {
  afterEach(async () => {
    await emulateMedia({ colorScheme: "light" });
  });

  /** A wrapper stands in for the page: tokens set there are inherited across the shadow boundary. */
  async function themedCard(tokens: Record<string, string>) {
    const wrapper = await fixture<HTMLDivElement>(html`
      <div style=${tokenStyle(tokens)}>
        <ot-app-card name="Test Tube" web-link=${WEB} google-link=${GOOGLE} platform="other">
          <h3>Test Tube</h3>
          <p>Video publications by a test publisher.</p>
          <!-- The page gives its links a colour of their own, the way Tailwind classes do on the site. -->
          <div slot="links"><a href=${WEB} style="color: #ff5722">View the web version</a></div>
        </ot-app-card>
      </div>
    `);
    const card = wrapper.querySelector<OtAppCard>("ot-app-card")!;
    await elementUpdated(card);
    return card;
  }

  it("takes its surface colour from the page's tokens", async () => {
    const card = await themedCard(DARK_TOKENS);
    expect(getComputedStyle(card).backgroundColor).to.equal("rgb(2, 8, 23)");
  });

  it("falls back to its own values when the page defines no tokens", async () => {
    const card = await themedCard({});
    expect(getComputedStyle(card).backgroundColor).to.equal("rgb(255, 255, 255)");
  });

  it("keeps slotted content readable in a dark theme", async () => {
    await emulateMedia({ colorScheme: "dark" });
    const card = await themedCard(DARK_TOKENS);
    // The card paints a dark surface behind light-DOM content it does not own, so it has to hand that content a
    // matching text colour; otherwise the heading inherits the page's dark text and disappears.
    await expect(card).to.be.accessible();
  });
});
