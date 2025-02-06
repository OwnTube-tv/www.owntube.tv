import { Github, Globe } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <section className="mb-20">
          <h1 className="text-4xl font-bold text-center mb-4">Your own tube, for Your own content</h1>
          <p className="text-xl text-center text-gray-600 mb-12">
            Create custom video apps for all your platforms. No ads. No data collection. No&nbsp;lock-in. Free as in
            Freedom.
          </p>

          <div className="bg-owntube-light rounded-lg p-8 mb-16">
            <h2 className="text-3xl font-bold mb-6">Make Your Own Video App</h2>
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1">
                <p className="text-lg mb-4">
                  Get started with our open-source project OwnTube.tv and create your own video streaming app today.
                  Available on desktop/web, or natively on iPhone, Android, Apple TV, and Android TV.
                </p>
                <a
                  href="https://github.com/OwnTube-tv/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 bg-owntube-orange text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition-colors"
                >
                  <Github className="h-5 w-5" />
                  <span>View on GitHub</span>
                </a>
              </div>
              <div className="flex-1">
                <img
                  src="/lovable-uploads/7c329071-cd88-4414-8673-dcd7a551df5e.png"
                  alt="OwnTube GitHub Profile"
                  className="rounded-lg shadow-lg w-full"
                />
              </div>
            </div>
          </div>

          <div className="bg-owntube-light rounded-lg p-8 mb-16">
            <h2 className="text-3xl font-bold mb-6">Reference App for Desktop/Web</h2>
            <div className="flex flex-col gap-8">
              <div className="text-lg mb-4">
                <p className="mb-4">
                  Create your Own fork of{" "}
                  <a
                    href="https://github.com/OwnTube-tv/web-client"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-owntube-orange hover:underline"
                  >
                    OwnTube-tv/web-client
                  </a>{" "}
                  and deploy it via GitHub Pages, as the fastest way to get yourself up and running. The OwnTube.tv web
                  app is installable as a Progressive Web App (PWA) on iPhone/Android and it works great on modern
                  desktop browsers too. You can use this app with any recent PeerTube video site as content backend, or
                  try out any of the featured sites on the landing page to experience various customizations.
                </p>
                <a
                  href="https://owntube-tv.github.io/web-client/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 bg-owntube-orange text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition-colors"
                >
                  <span>Try the Web App</span>
                </a>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="rounded-lg overflow-hidden shadow-lg flex flex-col">
                  <img
                    src="/lovable-uploads/790ed37d-4d1d-45d1-8e95-7bc2450d6cb6.png"
                    alt="OwnTube Discovery Page"
                    className="w-full h-auto"
                  />
                  <div className="p-4 bg-white mt-auto">
                    <h3 className="font-semibold">Discovery Page</h3>
                    <p className="text-sm text-gray-600">Find and explore video sites</p>
                  </div>
                </div>

                <div className="rounded-lg overflow-hidden shadow-lg flex flex-col">
                  <img
                    src="/lovable-uploads/547fd070-2a4d-4f39-965f-40226fbd54d6.png"
                    alt="TILvids Channel Example"
                    className="w-full h-auto"
                  />
                  <div className="p-4 bg-white mt-auto">
                    <h3 className="font-semibold">TILvids</h3>
                    <p className="text-sm text-gray-600">Educational content delivery</p>
                  </div>
                </div>

                <div className="rounded-lg overflow-hidden shadow-lg flex flex-col">
                  <img
                    src="/lovable-uploads/e56ece64-3622-4b14-9860-c95328c4dde6.png"
                    alt="Blender Channel"
                    className="w-full h-auto"
                  />
                  <div className="p-4 bg-white mt-auto">
                    <h3 className="font-semibold">Blender</h3>
                    <p className="text-sm text-gray-600">3D creation software</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <section>
            <h2 className="text-3xl font-bold mb-8">Reference Apps for Mobile and TV</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Privacy Tube",
                  shortDescription: "Video publications by Privacy International Media",
                  longDescription: (
                    <>
                      Privacy International Media (PI) has been working to promote the human right of privacy throughout
                      the world since 1990; specifically on raising awareness of threats to privacy and reporting on
                      surveillance methods and tactics. Visit the PI website for more info:{" "}
                      <a
                        href="https://www.privacyinternational.org"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-owntube-orange hover:underline"
                      >
                        https://www.privacyinternational.org
                      </a>
                    </>
                  ),
                  githubRepo: "https://github.com/OwnTube-tv/cust-app-pitube",
                  imageSrc: "/app-branding/privacy.png",
                  iconSrc: "/app-branding/icons/privacy.png",
                  googleLink: "https://play.google.com/store/apps/details?id=com.owntubetv.pitube",
                  testflightLink: "https://testflight.apple.com/join/KAAJgPss",
                  webLink: "https://owntube-tv.github.io/cust-app-pitube/",
                },
                {
                  title: "Blender Tube",
                  shortDescription: "Videos on the Blender 3D creation software",
                  longDescription: (
                    <>
                      Blender Foundation provides videos presenting the evolutions of their popular 3D creation
                      software, along with tutorials and presentations by the community. Read more about the
                      organization here:{" "}
                      <a
                        href="https://www.blender.org/about/foundation/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-owntube-orange hover:underline"
                      >
                        https://www.blender.org/about/foundation/
                      </a>
                    </>
                  ),
                  githubRepo: "https://github.com/OwnTube-tv/cust-app-blender",
                  imageSrc: "/app-branding/blender.png",
                  iconSrc: "/app-branding/icons/blender.png",
                  googleLink: "https://play.google.com/store/apps/details?id=com.owntubetv.blendertube",
                  testflightLink: "https://testflight.apple.com/join/cEDD3KeK",
                  webLink: "https://owntube-tv.github.io/cust-app-blender/",
                },
                {
                  title: "XR Tube",
                  shortDescription: "Information videos by Extinction Rebellion",
                  longDescription: (
                    <>
                      A video library for Extinction Rebellion (XR) with accounts for every national group, hosted on
                      renewable energy-powered infrastructure. Read more about the movement here:{" "}
                      <a
                        href="https://rebellion.global"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-owntube-orange hover:underline"
                      >
                        https://rebellion.global
                      </a>
                    </>
                  ),
                  githubRepo: "https://github.com/OwnTube-tv/cust-app-xrtube",
                  imageSrc: "/app-branding/xrtube.png",
                  iconSrc: "/app-branding/icons/xrtube.png",
                  googleLink: "https://play.google.com/store/apps/details?id=com.owntubetv.xrtube",
                  testflightLink: "https://testflight.apple.com/join/EzReSmsz",
                  webLink: "https://owntube-tv.github.io/cust-app-xrtube/",
                },
              ].map((app) => (
                <div
                  key={app.title}
                  className="flex flex-col bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <img src={app.imageSrc} alt={app.title} className="w-full h-48 object-cover" />
                  <div className="p-6 flex flex-grow flex-col">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex flex-row relative">
                        <img
                          src={app.iconSrc}
                          alt={app.title}
                          className="shadow-xl rounded-lg border-2 w-20 h-20 absolute -top-24 left-0 z-10"
                        />
                        <h3 className="text-xl font-bold">{app.title}</h3>
                      </div>
                      <a
                        href={app.githubRepo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-owntube-orange transition-colors"
                        aria-label={`View ${app.title} source code on GitHub`}
                      >
                        <Github className="h-5 w-5" />
                      </a>
                    </div>
                    <p className="text-gray-600 font-medium mb-4">{app.shortDescription}</p>
                    <p className="text-gray-600 text-sm flex-1 flex flex-col flex-grow">{app.longDescription}</p>
                    <hr className="mb-2 mt-2" />
                    <div className="gap-2 flex-col flex">
                      <a
                        href={app.webLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="gap-1 flex flex-row text-owntube-orange hover:underline items-center"
                        aria-label={`View ${app.title} source code on GitHub`}
                      >
                        View the web version <Globe className="h-5 w-5" />
                      </a>
                      <p className="text-gray-600">or try the beta on mobile platforms:</p>
                      <a
                        href={app.googleLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`View ${app.title} source code on GitHub`}
                      >
                        <img width={150} src={"/googleplay.png"} alt={"Try on Google Play"} />
                      </a>
                      <a
                        href={app.testflightLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`View ${app.title} source code on GitHub`}
                      >
                        <img width={150} src={"/testflight.png"} alt={"Try on Google Play"} />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </section>
      </div>
    </div>
  );
};

export default Index;
