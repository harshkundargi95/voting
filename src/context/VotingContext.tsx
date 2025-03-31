import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Candidate, candidates } from '@/utils/candidatesData';
import { 
  connectToBlockchain, 
  castVote, 
  getAllVotes, 
  getVoteCounts,
  Vote,
  VoteCount
} from '@/utils/blockchainService';
import { toast } from 'sonner';

interface VotingContextType {
  candidates: Candidate[];
  selectedCandidate: Candidate | null;
  hasVoted: boolean;
  isConfirming: boolean;
  isSubmitting: boolean;
  votes: Vote[];
  voteCounts: VoteCount[];
  isLoading: boolean;
  totalVotes: number;
  selectCandidate: (candidate: Candidate) => void;
  confirmVote: () => void;
  cancelVote: () => void;
  submitVote: () => Promise<void>;
  refreshResults: () => Promise<void>;
  resetVotingState: () => void;
  isAdmin: boolean;
  adminLogin: (password: string) => boolean;
  adminLogout: () => void;
}

const VotingContext = createContext<VotingContextType | undefined>(undefined);

// Add a session storage key for tracking voting state
const VOTED_STORAGE_KEY = 'blockchain_voting_has_voted';
const ADMIN_AUTH_KEY = 'blockchain_voting_admin_auth';

// Use a simple hardcoded password (in a real app, this should be handled more securely)
const ADMIN_PASSWORD = 'admin123';

export const VotingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize hasVoted from session storage to persist across page refreshes but not across sessions
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [hasVoted, setHasVoted] = useState<boolean>(() => {
    // Only check session storage if we're in browser environment
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem(VOTED_STORAGE_KEY) === 'true';
    }
    return false;
  });
  const [isConfirming, setIsConfirming] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [voteCounts, setVoteCounts] = useState<VoteCount[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem(ADMIN_AUTH_KEY) === 'true';
    }
    return false;
  });

  // Connect to blockchain on initial load
  useEffect(() => {
    const init = async () => {
      try {
        setIsLoading(true);
        const connected = await connectToBlockchain();
        setIsConnected(connected);
        
        if (connected) {
          await refreshResults();
        }
      } catch (error) {
        console.error('Error initializing blockchain connection:', error);
        toast.error('Could not connect to blockchain');
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, []);

  const refreshResults = async () => {
    try {
      setIsLoading(true);
      const [allVotes, counts] = await Promise.all([
        getAllVotes(),
        getVoteCounts()
      ]);
      
      setVotes(allVotes);
      setVoteCounts(counts);
    } catch (error) {
      console.error('Error fetching blockchain data:', error);
      toast.error('Could not fetch blockchain data');
    } finally {
      setIsLoading(false);
    }
  };

  const selectCandidate = (candidate: Candidate) => {
    if (!hasVoted) {
      setSelectedCandidate(candidate);
      setIsConfirming(true);
    } else {
      toast.error('You have already voted');
    }
  };

  const confirmVote = () => {
    setIsConfirming(true);
  };

  const cancelVote = () => {
    setIsConfirming(false);
    setSelectedCandidate(null);
  };

  // Function to reset the voting state
  const resetVotingState = () => {
    setHasVoted(false);
    setSelectedCandidate(null);
    sessionStorage.removeItem(VOTED_STORAGE_KEY);
    toast.info('Voting state has been reset. You can vote again.');
  };

  // Admin login function
  const adminLogin = (password: string): boolean => {
    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      sessionStorage.setItem(ADMIN_AUTH_KEY, 'true');
      toast.success('Admin login successful');
      return true;
    } else {
      toast.error('Invalid admin password');
      return false;
    }
  };

  // Admin logout function
  const adminLogout = () => {
    setIsAdmin(false);
    sessionStorage.removeItem(ADMIN_AUTH_KEY);
    toast.info('Admin logged out');
  };

  const submitVote = async () => {
    if (!selectedCandidate) return;
    
    try {
      setIsSubmitting(true);
      
      // Submit the vote to the blockchain
      await castVote(selectedCandidate.id);
      
      // Update UI state
      setHasVoted(true);
      setIsConfirming(false);
      
      // Save voting state to session storage
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(VOTED_STORAGE_KEY, 'true');
      }
      
      // Refresh results
      await refreshResults();
      
      toast.success(`Vote for ${selectedCandidate.name} submitted successfully!`);
    } catch (error) {
      console.error('Error submitting vote:', error);
      toast.error('Failed to submit vote to blockchain');
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalVotes = voteCounts.reduce((sum, vc) => sum + vc.count, 0);

  return (
    <VotingContext.Provider
      value={{
        candidates,
        selectedCandidate,
        hasVoted,
        isConfirming,
        isSubmitting,
        votes,
        voteCounts,
        isLoading,
        totalVotes,
        selectCandidate,
        confirmVote,
        cancelVote,
        submitVote,
        refreshResults,
        resetVotingState,
        isAdmin,
        adminLogin,
        adminLogout
      }}
    >
      {children}
    </VotingContext.Provider>
  );
};

export const useVoting = (): VotingContextType => {
  const context = useContext(VotingContext);
  if (context === undefined) {
    throw new Error('useVoting must be used within a VotingProvider');
  }
  return context;
};
