
import { Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-muted/50 py-6">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-voteblue-800" />
            <p className="text-sm text-muted-foreground">
              Secured by blockchain technology
            </p>
          </div>
          
          <div className="flex items-center gap-6">
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Home
            </Link>
            <Link to="/results" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Results
            </Link>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              About
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Privacy
            </a>
          </div>
        </div>
        
        <div className="mt-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} VoteChain - A secure blockchain voting platform
        </div>
      </div>
    </footer>
  );
};

export default Footer;
