
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useVoting } from "@/context/VotingContext";
import { Check, X, Loader2 } from "lucide-react";

const VotingConfirmation = () => {
  const { 
    isConfirming, 
    selectedCandidate, 
    cancelVote, 
    submitVote, 
    isSubmitting 
  } = useVoting();

  if (!selectedCandidate) return null;
  
  return (
    <Dialog open={isConfirming} onOpenChange={isSubmitting ? undefined : () => cancelVote()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Confirm Your Vote</DialogTitle>
          <DialogDescription>
            Your vote will be securely recorded on the blockchain and cannot be changed once submitted.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex items-center gap-4 py-4">
          <img 
            src={selectedCandidate.image} 
            alt={selectedCandidate.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-voteteal-700"
          />
          <div>
            <h3 className="font-medium">{selectedCandidate.name}</h3>
            <p className="text-sm text-muted-foreground">{selectedCandidate.party}</p>
          </div>
        </div>
        
        <div className="bg-muted/50 p-3 rounded-md text-sm">
          <p className="text-muted-foreground">
            By confirming, you agree that this vote represents your choice and will be permanently recorded.
          </p>
        </div>
        
        <DialogFooter className="flex sm:justify-between gap-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={cancelVote}
            disabled={isSubmitting}
            className="flex-1"
          >
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button 
            type="button" 
            onClick={submitVote}
            disabled={isSubmitting}
            className="flex-1 bg-voteteal-700 hover:bg-voteteal-800"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                Confirm Vote
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VotingConfirmation;
