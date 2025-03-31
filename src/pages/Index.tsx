
import { useVoting } from "@/context/VotingContext";
import CandidateCard from "@/components/CandidateCard";
import VotingConfirmation from "@/components/VotingConfirmation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { ShieldCheck, Info } from "lucide-react";

const Index = () => {
  const { candidates, hasVoted, isLoading } = useVoting();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-3">Secure Blockchain Voting</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Cast your vote securely using blockchain technology. Your vote is anonymous, 
              immutable, and transparent.
            </p>
          </div>
          
          {hasVoted && (
            <Alert className="mb-8 bg-voteteal-50 border-voteteal-700">
              <ShieldCheck className="h-4 w-4 text-voteteal-700" />
              <AlertTitle className="text-voteblue-800">Vote successfully cast!</AlertTitle>
              <AlertDescription className="text-emerald-600 font-medium">
                Your vote has been securely recorded on the blockchain and cannot be altered.
                You can view the results in real-time.
              </AlertDescription>
            </Alert>
          )}
          
          <div className="blockchain-container p-6 rounded-lg bg-background mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Select a Candidate</h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Info className="h-4 w-4" />
                <span>{hasVoted ? 'You have voted' : 'Choose one candidate'}</span>
              </div>
            </div>
            
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array(4).fill(0).map((_, i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="aspect-square rounded-lg" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {candidates.map((candidate) => (
                  <CandidateCard key={candidate.id} candidate={candidate} />
                ))}
              </div>
            )}
          </div>
          
          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <ShieldCheck className="h-5 w-5 text-voteblue-800 mt-0.5" />
              <div>
                <h3 className="font-medium mb-1">Blockchain Security</h3>
                <p className="text-sm text-muted-foreground">
                  Your vote is securely recorded on the blockchain, ensuring it cannot be tampered with 
                  or altered. All votes are anonymous while maintaining complete transparency.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <VotingConfirmation />
      <Footer />
    </div>
  );
};

export default Index;
