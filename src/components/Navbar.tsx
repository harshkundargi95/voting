
import { Link } from "react-router-dom";
import { Vote, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useVoting } from "@/context/VotingContext";

const Navbar = () => {
  const { isAdmin } = useVoting();
  
  return (
    <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Vote className="h-6 w-6 text-voteblue-800" />
          <span className="text-xl font-semibold text-voteblue-800">VoteChain</span>
        </div>
        
        <div className="flex gap-4">
          <Button variant="ghost" asChild>
            <Link to="/" className="flex items-center gap-1">
              <Vote className="h-4 w-4" />
              <span>Vote</span>
            </Link>
          </Button>
          
          <Button variant="ghost" asChild>
            <Link to="/results" className="flex items-center gap-1">
              <BarChart3 className="h-4 w-4" />
              <span>{isAdmin ? 'Results' : 'Admin'}</span>
            </Link>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
