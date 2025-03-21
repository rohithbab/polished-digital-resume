
import { Link } from "react-router-dom";
import { Home } from "lucide-react";
import FloatingIcons from "../components/FloatingIcons";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
      <FloatingIcons />
      <div className="glass-card p-10 max-w-lg animate-scale-in">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <h2 className="text-2xl font-bold mb-6">Page Not Found</h2>
        <p className="text-muted-foreground mb-8">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link to="/" className="btn-primary inline-flex items-center">
          <Home className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
