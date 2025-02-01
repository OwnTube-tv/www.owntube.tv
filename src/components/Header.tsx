import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="w-full bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <img
            src="/lovable-uploads/a28acd56-9e34-4a9e-90f3-e42bcbca4c51.png"
            alt="OwnTube.tv Logo"
            className="h-12 w-12"
          />
          <span className="text-2xl font-bold text-owntube-orange">OwnTube.tv</span>
        </Link>
        <nav className="flex space-x-8">
          <Link
            to="/"
            className={`text-lg ${
              isActive("/")
                ? "text-owntube-orange font-semibold"
                : "text-gray-600 hover:text-owntube-orange"
            }`}
          >
            Apps
          </Link>
          <Link
            to="/consulting"
            className={`text-lg ${
              isActive("/consulting")
                ? "text-owntube-orange font-semibold"
                : "text-gray-600 hover:text-owntube-orange"
            }`}
          >
            Consulting
          </Link>
          <Link
            to="/contact"
            className={`text-lg ${
              isActive("/contact")
                ? "text-owntube-orange font-semibold"
                : "text-gray-600 hover:text-owntube-orange"
            }`}
          >
            Contact
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;