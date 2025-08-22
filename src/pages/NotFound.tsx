import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, Search, Heart, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center py-8 px-6">
      <Card className="max-w-2xl w-full border-0 shadow-soft text-center">
        <CardContent className="pt-16 pb-16">
          <div className="w-24 h-24 mx-auto mb-8 bg-gradient-primary/10 rounded-full flex items-center justify-center">
            <Search className="w-12 h-12 text-primary" />
          </div>
          
          <h1 className="text-6xl font-bold mb-4 text-gradient">404</h1>
          <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            Oops! The page you're looking for doesn't exist. But don't worry - 
            there are many ways you can help transform children's lives through education.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-gradient-primary hover:bg-primary/90">
              <Link to="/" className="flex items-center space-x-2">
                <ArrowLeft className="w-5 h-5" />
                <span>Return Home</span>
              </Link>
            </Button>
            
            <Button asChild variant="outline" size="lg">
              <Link to="/schools" className="flex items-center space-x-2">
                <Heart className="w-5 h-5" />
                <span>Meet Our Children</span>
              </Link>
            </Button>
          </div>
          
          <div className="mt-12 pt-8 border-t">
            <p className="text-sm text-muted-foreground mb-4">
              Quick Links:
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/schools" className="text-primary hover:underline">Our Schools</Link>
              <Link to="/blogs" className="text-primary hover:underline">Success Stories</Link>
              <Link to="/leaderboard" className="text-primary hover:underline">Donor Community</Link>
              <Link to="/admin" className="text-primary hover:underline">Admin Portal</Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
