import { Github } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <section className="mb-20">
          <h1 className="text-4xl font-bold text-center mb-4">
            Your own tube, for Your own content
          </h1>
          <p className="text-xl text-center text-gray-600 mb-12">
            Create custom video apps for all your platforms
          </p>
          
          <div className="bg-owntube-light rounded-lg p-8 mb-16">
            <h2 className="text-3xl font-bold mb-6">Make Your Own Video App</h2>
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1">
                <p className="text-lg mb-4">
                  Get started with our open-source project and create your custom video
                  streaming application today. Available for iOS, Android, Apple TV,
                  and Android TV.
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
                  src="/placeholder.svg"
                  alt="OwnTube Platform"
                  className="rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold mb-8">Reference Apps for Mobile and TV</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "PI Tube",
                description:
                  "Educational content delivery platform for mathematics and physics.",
              },
              {
                title: "Blender Tube",
                description:
                  "3D animation and modeling tutorials for Blender enthusiasts.",
              },
              {
                title: "XR Tube",
                description:
                  "Extended reality content streaming for immersive experiences.",
              },
            ].map((app) => (
              <div
                key={app.title}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <img
                  src="/placeholder.svg"
                  alt={app.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{app.title}</h3>
                  <p className="text-gray-600">{app.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Index;