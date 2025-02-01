import { Github } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-owntube-dark text-white py-8 mt-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm">
              © {new Date().getFullYear()} OwnTube Nordic AB. All rights reserved.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <a
              href="https://github.com/OwnTube-tv/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-owntube-orange transition-colors"
            >
              <Github className="h-6 w-6" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;