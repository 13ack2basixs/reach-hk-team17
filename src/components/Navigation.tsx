import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  School, 
  BookOpen, 
  Trophy, 
  Settings, 
  Heart,
  LogIn
} from "lucide-react";
import { cn } from "@/lib/utils";

const Navigation = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/schools", icon: School, label: "Our Schools" },
    { path: "/blogs", icon: BookOpen, label: "Stories" },
    { path: "/leaderboard", icon: Trophy, label: "Donors" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/80 backdrop-blur-md shadow-soft">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gradient">REACH</h1>
            <p className="text-xs text-muted-foreground">Building Brighter Futures</p>
          </div>
        </Link>

        {/* Main Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center space-x-2 px-4 py-2 rounded-lg transition-smooth",
                  isActive(item.path)
                    ? "bg-primary text-primary-foreground shadow-soft"
                    : "hover:bg-accent/50"
                )}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <Button asChild variant="ghost" size="sm">
            <Link to="/donor-login" className="flex items-center space-x-2">
              <LogIn className="w-4 h-4" />
              <span className="hidden sm:inline">Donor Portal</span>
            </Link>
          </Button>
          
          <Button asChild variant="outline" size="sm">
            <Link to="/admin" className="flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Admin</span>
            </Link>
          </Button>
          
          <Button asChild size="sm" className="bg-gradient-primary hover:bg-primary/90 shadow-glow">
            <Link to="/donate" className="text-white font-medium">
              Donate Now
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navigation;