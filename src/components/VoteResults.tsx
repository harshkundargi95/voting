
import { useVoting } from "@/context/VotingContext";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

const VoteResults = () => {
  const { voteCounts, candidates, totalVotes, isLoading, refreshResults } = useVoting();

  const handleRefresh = async () => {
    await refreshResults();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Current Results</h2>
        <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
          <RefreshCcw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="text-sm text-muted-foreground mb-4">
        {isLoading ? (
          <Skeleton className="h-4 w-48" />
        ) : (
          <p>Total votes: {totalVotes}</p>
        )}
      </div>

      <div className="space-y-6">
        {isLoading ? (
          Array(4).fill(0).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-5 w-16" />
              </div>
              <Skeleton className="h-4 w-full" />
            </div>
          ))
        ) : (
          candidates.map(candidate => {
            const voteCount = voteCounts.find(vc => vc.candidateId === candidate.id)?.count || 0;
            const percentage = totalVotes > 0 ? (voteCount / totalVotes) * 100 : 0;
            
            return (
              <div key={candidate.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <img 
                      src={candidate.image} 
                      alt={candidate.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium">{candidate.name}</p>
                      <p className="text-xs text-muted-foreground">{candidate.party}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{percentage.toFixed(1)}%</p>
                    <p className="text-xs text-muted-foreground">{voteCount} votes</p>
                  </div>
                </div>
                <Progress value={percentage} className="h-2" />
              </div>
            );
          })
        )}
      </div>

      <div className="bg-muted/50 p-4 rounded-lg text-sm text-muted-foreground mt-8">
        <p className="font-medium mb-2">Blockchain Verification</p>
        <p>All votes are securely recorded on the blockchain, ensuring transparency and immutability. 
        Results are updated in real-time as votes are processed by the network.</p>
      </div>
    </div>
  );
};

export default VoteResults;
