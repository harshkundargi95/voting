
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VoteResults from "@/components/VoteResults";
import AdminLogin from "@/components/AdminLogin";
import { Card, CardContent } from "@/components/ui/card";
import { useVoting } from "@/context/VotingContext";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { clearAllVotes } from "@/utils/blockchainService";
import { toast } from "sonner";

const Results = () => {
  const { isAdmin, adminLogout, refreshResults } = useVoting();
  const navigate = useNavigate();

  // Redirect logged out users back to home
  useEffect(() => {
    if (!isAdmin) {
      // Stay on this page but show login form
    }
  }, [isAdmin, navigate]);

  const handleClearVotes = async () => {
    if (window.confirm("Are you sure you want to clear all votes? This action cannot be undone.")) {
      await clearAllVotes();
      toast.success("All votes have been cleared");
      refreshResults();
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-3">Election Results</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Real-time election results verified and secured by blockchain technology.
            </p>
          </div>
          
          {isAdmin ? (
            <>
              <div className="flex justify-end mb-4 gap-2">
                <Button variant="destructive" onClick={handleClearVotes} className="flex items-center gap-1">
                  <Trash2 className="h-4 w-4" />
                  Clear All Votes
                </Button>
                <Button variant="outline" onClick={adminLogout}>
                  Logout
                </Button>
              </div>
              <Card className="blockchain-container p-0 mb-8">
                <CardContent className="p-6">
                  <VoteResults />
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-medium mb-3">Blockchain Verification</h3>
                    <p className="text-sm text-muted-foreground">
                      All votes are cryptographically secured and can be independently verified. 
                      The blockchain ensures that no votes can be modified or deleted once cast.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-medium mb-3">Transparent Process</h3>
                    <p className="text-sm text-muted-foreground">
                      The entire voting process is transparent while maintaining voter privacy. 
                      The blockchain serves as a public ledger that anyone can audit.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </>
          ) : (
            <div className="mt-8">
              <p className="text-center mb-8 text-muted-foreground">
                This area is restricted. Please log in as an administrator to view election results.
              </p>
              <AdminLogin />
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Results;
