import { Link, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Header = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const isActive = (path: string) => location.pathname === path;

  const NavigationLinks = () => (
    <>
      <Link
        to="/"
        className={`text-lg ${
          isActive("/") ? "text-owntube-orange font-semibold" : "text-gray-600 hover:text-owntube-orange"
        }`}
      >
        Apps
      </Link>
      <Link
        to="/consulting"
        className={`text-lg ${
          isActive("/consulting") ? "text-owntube-orange font-semibold" : "text-gray-600 hover:text-owntube-orange"
        }`}
      >
        Consulting
      </Link>
      <Link
        to="/contact"
        className={`text-lg ${
          isActive("/contact") ? "text-owntube-orange font-semibold" : "text-gray-600 hover:text-owntube-orange"
        }`}
      >
        Contact
      </Link>
    </>
  );

  return (
    <header className="w-full bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <img
            src="/lovable-uploads/a28acd56-9e34-4a9e-90f3-e42bcbca4c51.png"
            alt="OwnTube.tv Logo"
            className="h-12 w-12 rounded-lg"
          />
          <span className="text-2xl font-bold text-owntube-orange">OwnTube.tv</span>
        </Link>
        
        {isMobile ? (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <nav className="flex flex-col space-y-8 mt-8">
                <NavigationLinks />
              </nav>
            </SheetContent>
          </Sheet>
        ) : (
          <nav className="flex space-x-8">
            <NavigationLinks />
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;