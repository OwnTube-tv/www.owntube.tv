import type { App } from "./apps";
import type { Role } from "./roles";

const SITE_URL = "https://www.owntube.tv";
const ORG_REF = { "@id": `${SITE_URL}/#organization` };

export const webClientJsonLd = [
  {
    "@type": "SoftwareApplication",
    "@id": `${SITE_URL}/#web-client`,
    name: "OwnTube.tv Web Client",
    description:
      "Open-source reference video streaming app for desktop and web. Installable as a Progressive Web App (PWA) on iPhone/Android. Works with any recent PeerTube video site as content backend.",
    url: "https://owntube-tv.github.io/web-client/",
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Web, iOS, Android",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    isAccessibleForFree: true,
    author: ORG_REF,
    screenshot: `${SITE_URL}/lovable-uploads/790ed37d-4d1d-45d1-8e95-7bc2450d6cb6.png`,
  },
  {
    "@type": "SoftwareSourceCode",
    "@id": `${SITE_URL}/#web-client-source`,
    name: "OwnTube.tv Web Client (Source Code)",
    codeRepository: "https://github.com/OwnTube-tv/web-client",
    programmingLanguage: ["TypeScript", "React Native"],
    license: "https://github.com/OwnTube-tv/web-client/blob/main/LICENSE",
    author: ORG_REF,
    targetProduct: { "@id": `${SITE_URL}/#web-client` },
  },
];

export function appToJsonLd(app: App) {
  const name = app.jsonLdName ?? app.title;
  const appEntity: Record<string, unknown> = {
    "@type": "SoftwareApplication",
    "@id": `${SITE_URL}/#${app.jsonLdId}`,
    name,
    description: app.jsonLdDescription,
    url: app.webLink,
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Web, iOS, Android, Apple TV, Android TV",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    isAccessibleForFree: true,
    installUrl: [app.webLink, app.googleLink, app.testflightLink],
    author: ORG_REF,
    image: `${SITE_URL}${app.iconSrc}`,
    screenshot: `${SITE_URL}${app.imageSrc}`,
  };
  const sourceEntity = {
    "@type": "SoftwareSourceCode",
    "@id": `${SITE_URL}/#${app.jsonLdId}-source`,
    name: `${name} (Source Code)`,
    codeRepository: app.githubRepo,
    programmingLanguage: ["TypeScript", "React Native"],
    author: ORG_REF,
    targetProduct: { "@id": `${SITE_URL}/#${app.jsonLdId}` },
  };
  return [appEntity, sourceEntity];
}

export function appsToJsonLd(apps: App[]) {
  return apps.flatMap(appToJsonLd);
}

export function rolesToOfferCatalog(roles: Role[]) {
  return {
    "@type": "OfferCatalog",
    name: "Consulting Roles",
    itemListElement: roles.map((role) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: role.title,
        description: role.description,
      },
    })),
  };
}

export function consultingServiceJsonLd(roles: Role[]) {
  return {
    "@type": "ProfessionalService",
    "@id": `${SITE_URL}/#consulting-service`,
    name: "OwnTube Expert Consulting",
    provider: ORG_REF,
    url: `${SITE_URL}/consulting`,
    description:
      "Comprehensive consulting services in video-on-demand (VoD) streaming and large-scale IT infrastructure. Whether you're looking to self-host or leverage cloud solutions, our team can guide you through your video streaming journey.",
    serviceType: "IT Consulting",
    areaServed: "Worldwide",
    hasOfferCatalog: rolesToOfferCatalog(roles),
  };
}
