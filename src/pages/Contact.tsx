const Contact = () => {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">Contact Us</h1>

        <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">Company Information</h2>
              <div className="space-y-3">
                <p>
                  <span className="font-semibold">Legal Name:</span> OwnTube Nordic AB
                </p>
                <p>
                  <span className="font-semibold">VAT Number:</span> SE559517719601
                </p>
                <p>
                  <span className="font-semibold">Address:</span> Älgpassgatan 12 lgh 1102, 11545 Stockholm, SWEDEN
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">Get in Touch</h2>
              <div className="space-y-3">
                <p>
                  <span className="font-semibold">Phone:</span>{" "}
                  <a href="tel:+46730567567" className="text-owntube-orange hover:underline">
                    +46 730 567 567
                  </a>
                </p>
                <p>
                  <span className="font-semibold">Email:</span>{" "}
                  <a href="mailto:hello@owntube.tv" className="text-owntube-orange hover:underline">
                    hello@owntube.tv
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
