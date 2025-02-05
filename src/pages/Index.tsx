import { Github } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <section className="mb-20">
          <h1 className="text-4xl font-bold text-center mb-4">Your own tube, for Your own content</h1>
          <p className="text-xl text-center text-gray-600 mb-12">Create custom video apps for all your platforms. No ads. No data collection. No&nbsp;lock-in. Free as in Freedom.</p>

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
                  description: "Educational content delivery platform for mathematics and physics.",
                },
                {
                  title: "Blender Tube",
                  description: "3D animation and modeling tutorials for Blender enthusiasts.",
                },
                {
                  title: "XR Tube",
                  description: "Extended reality content streaming for immersive experiences.",
                },
              ].map((app) => (
                <div
                  key={app.title}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <img src="/placeholder.svg" alt={app.title} className="w-full h-48 object-cover" />
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{app.title}</h3>
                    <p className="text-gray-600">{app.description}</p>
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
