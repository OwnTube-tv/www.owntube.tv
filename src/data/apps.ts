export interface App {
  title: string;
  shortDescription: string;
  longDescription: string;
  externalUrl: string;
  externalLabel: string;
  githubRepo: string;
  imageSrc: string;
  iconSrc: string;
  googleLink: string;
  testflightLink: string;
  webLink: string;
  jsonLdId: string;
  jsonLdName?: string;
  jsonLdDescription: string;
}

export const apps: App[] = [
  {
    title: "Privacy Tube",
    shortDescription: "Video publications by Privacy International Media",
    longDescription:
      'Privacy International Media (PI) has been working to promote the human right of privacy throughout the world since 1990; specifically on raising awareness of threats to privacy and reporting on surveillance methods and tactics. Visit the PI website for more info: <a href="https://www.privacyinternational.org" target="_blank" rel="noopener noreferrer" class="text-owntube-orange hover:underline">https://www.privacyinternational.org</a>',
    externalUrl: "https://www.privacyinternational.org",
    externalLabel: "https://www.privacyinternational.org",
    githubRepo: "https://github.com/OwnTube-tv/cust-app-pitube",
    imageSrc: "/app-branding/privacy.png",
    iconSrc: "/app-branding/icons/privacy.png",
    googleLink: "https://play.google.com/store/apps/details?id=com.owntubetv.pitube",
    testflightLink: "https://testflight.apple.com/join/KAAJgPss",
    webLink: "https://cust-app-pitube.owntube.tv/",
    jsonLdId: "privacy-tube",
    jsonLdDescription:
      "Video publications by Privacy International Media. Privacy International (PI) has been working to promote the human right of privacy throughout the world since 1990, raising awareness of threats to privacy and reporting on surveillance methods and tactics.",
  },
  {
    title: "Blender Tube",
    shortDescription: "Videos on the Blender 3D creation software",
    longDescription:
      'Blender Foundation provides videos presenting the evolutions of their popular 3D creation software, along with tutorials and presentations by the community. Read more about the organization here: <a href="https://www.blender.org/about/foundation/" target="_blank" rel="noopener noreferrer" class="text-owntube-orange hover:underline">https://www.blender.org/about/foundation/</a>',
    externalUrl: "https://www.blender.org/about/foundation/",
    externalLabel: "https://www.blender.org/about/foundation/",
    githubRepo: "https://github.com/OwnTube-tv/cust-app-blender",
    imageSrc: "/app-branding/blender.png",
    iconSrc: "/app-branding/icons/blender.png",
    googleLink: "https://play.google.com/store/apps/details?id=com.owntubetv.blendertube",
    testflightLink: "https://testflight.apple.com/join/cEDD3KeK",
    webLink: "https://cust-app-blender.owntube.tv/",
    jsonLdId: "blender-tube",
    jsonLdDescription:
      "Videos on the Blender 3D creation software. Blender Foundation provides videos presenting the evolutions of their popular 3D creation software, along with tutorials and presentations by the community.",
  },
  {
    title: "XR Tube",
    shortDescription: "Information videos by Extinction Rebellion",
    longDescription:
      'A video library for Extinction Rebellion (XR) with accounts for every national group, hosted on renewable energy-powered infrastructure. Read more about the movement here: <a href="https://rebellion.global" target="_blank" rel="noopener noreferrer" class="text-owntube-orange hover:underline">https://rebellion.global</a>',
    externalUrl: "https://rebellion.global",
    externalLabel: "https://rebellion.global",
    githubRepo: "https://github.com/OwnTube-tv/cust-app-xrtube",
    imageSrc: "/app-branding/xrtube.png",
    iconSrc: "/app-branding/icons/xrtube.png",
    googleLink: "https://play.google.com/store/apps/details?id=com.owntubetv.xrtube",
    testflightLink: "https://testflight.apple.com/join/EzReSmsz",
    webLink: "https://cust-app-xrtube.owntube.tv/",
    jsonLdId: "xr-tube",
    jsonLdDescription:
      "Information videos by Extinction Rebellion. A video library for Extinction Rebellion (XR) with accounts for every national group, hosted on renewable energy-powered infrastructure.",
  },
  {
    title: "\u{1D505}\u{1D586}\u{1D598}\u{1D598}\u{1D595}\u{1D58E}\u{1D598}\u{1D599}\u{1D594}\u{1D591} \u{1F30D}",
    shortDescription: "Music published by The Outernational Music Syndicate",
    longDescription:
      'Basspistol established in 2010 as a pro-active reaction to everything that is broken in the music-industry; it is an endlessly evolving union for the Underground Artists of the third millennium. Visit the Basspistol website for more info: <a href="https://www.basspistol.com/" target="_blank" rel="noopener noreferrer" class="text-owntube-orange hover:underline">https://www.basspistol.com</a>',
    externalUrl: "https://www.basspistol.com/",
    externalLabel: "https://www.basspistol.com",
    githubRepo: "https://github.com/OwnTube-tv/cust-app-basspistol",
    imageSrc: "/app-branding/basspistol.png",
    iconSrc: "/app-branding/icons/basspistol.png",
    googleLink: "https://play.google.com/store/apps/details?id=com.owntubetv.basspistol",
    testflightLink: "https://testflight.apple.com/join/pqVV5Cu2",
    webLink: "https://cust-app-basspistol.owntube.tv/",
    jsonLdId: "basspistol",
    jsonLdName: "Basspistol",
    jsonLdDescription:
      "Music published by The Outernational Music Syndicate. Basspistol established in 2010 as a pro-active reaction to everything that is broken in the music-industry; it is an endlessly evolving union for the Underground Artists of the third millennium.",
  },
];
