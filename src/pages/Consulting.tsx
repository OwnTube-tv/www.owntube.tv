const Consulting = () => {
  const roles = [
    {
      title: "Lead Developer",
      description: "Technical leadership and hands-on development for video streaming applications.",
    },
    {
      title: "Tech Lead & Architect",
      description: "Strategic technical direction, solution design, and team leadership for complex video streaming platforms.",
    },
    {
      title: "React Development",
      description: "Expert React development for web and mobile video applications.",
    },
    {
      title: "Infrastructure Architect",
      description: "Design and implementation of scalable video streaming infrastructure.",
    },
    {
      title: "DevSecOps",
      description: "Secure and efficient CI/CD pipelines for video streaming applications.",
    },
    {
      title: "Backend Development",
      description: "Robust backend systems for video content management and delivery.",
    },
  ];

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">Expert Consulting</h1>

        <div className="bg-owntube-light rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold mb-4">Our Expertise</h2>
          <p className="text-lg mb-4">
            With years of experience in video-on-demand (VoD) streaming and large-scale IT infrastructure, we provide
            comprehensive consulting services to help you succeed.
          </p>
          <p className="text-lg mb-4">
            Whether you're looking to self-host or leverage cloud solutions, our team can guide you through every step
            of your video streaming journey.
          </p>
        </div>

        <h2 className="text-2xl font-bold mb-6">Available Roles</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roles.map((role) => (
            <div key={role.title} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold mb-2 text-owntube-orange">{role.title}</h3>
              <p className="text-gray-600">{role.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Consulting;