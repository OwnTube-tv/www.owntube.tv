import { Github, Code } from "lucide-react";
import buildInfo from "../build-info.json";

const Footer = () => {
  return (
    <footer className="bg-owntube-dark text-white py-8 mt-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm">© 2025 OwnTube Nordic AB. All rights reserved.</p>
            <p className="text-xs mt-1 text-gray-400">
              <a
                href={buildInfo.COMMIT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center hover:text-owntube-orange transition-colors"
              >
                <Code className="h-3 w-3 mr-1" />
                {buildInfo.GITHUB_SHA_SHORT} by {buildInfo.GITHUB_ACTOR}
                <span className="ml-2">({buildInfo.BUILD_TIMESTAMP})</span>
              </a>
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <a
              href="https://github.com/OwnTube-tv/www.owntube.tv"
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
