
import { toast } from "sonner";

// This simulates a backend service that would store votes in a database
// In a real application, this would connect to a blockchain or database API

export interface Vote {
  id: string;
  candidateId: string;
  timestamp: number;
  transactionHash: string;
}

export interface VoteCount {
  candidateId: string;
  count: number;
}

// Define key for localStorage to store the votes
const VOTES_STORAGE_KEY = 'blockchain_voting_votes';

// Helper functions to interact with the simulated blockchain storage
const blockchainStorage = {
  // Get all votes from centralized storage
  getAllVotes: (): Vote[] => {
    try {
      const votesJson = localStorage.getItem(VOTES_STORAGE_KEY);
      return votesJson ? JSON.parse(votesJson) : [];
    } catch (error) {
      console.error('Error getting votes from storage:', error);
      return [];
    }
  },

  // Add a vote to the centralized storage
  addVote: (vote: Vote): void => {
    try {
      const currentVotes = blockchainStorage.getAllVotes();
      const updatedVotes = [...currentVotes, vote];
      localStorage.setItem(VOTES_STORAGE_KEY, JSON.stringify(updatedVotes));
    } catch (error) {
      console.error('Error adding vote to storage:', error);
      throw new Error('Failed to add vote to storage');
    }
  },

  // Clear all votes from the centralized storage
  clearVotes: (): void => {
    try {
      localStorage.removeItem(VOTES_STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing votes from storage:', error);
      throw new Error('Failed to clear votes from storage');
    }
  }
};

// Simulate blockchain latency
const SIMULATED_BLOCKCHAIN_DELAY = 1500;

// Generate a fake transaction hash
const generateTransactionHash = (): string => {
  return '0x' + Array.from({ length: 64 }, () => 
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
};

// Cast a vote (simulated blockchain transaction)
export const castVote = async (candidateId: string): Promise<Vote> => {
  return new Promise((resolve) => {
    setTimeout(async () => {
      const vote: Vote = {
        id: Date.now().toString() + '-' + Math.random().toString(36).substring(2, 15),
        candidateId,
        timestamp: Date.now(),
        transactionHash: generateTransactionHash()
      };
      
      try {
        // Store vote in the centralized storage
        blockchainStorage.addVote(vote);
        
        console.log('Vote stored in blockchain:', vote);
        
        toast.success('Vote successfully recorded on the blockchain!', {
          description: `Transaction hash: ${vote.transactionHash.substring(0, 10)}...`,
          duration: 5000,
        });
        
        resolve(vote);
      } catch (error) {
        console.error('Error storing vote:', error);
        toast.error('Failed to record vote on blockchain');
        // Still resolve with the vote to avoid breaking the UI
        resolve(vote);
      }
    }, SIMULATED_BLOCKCHAIN_DELAY);
  });
};

// Get all votes (simulated blockchain query)
export const getAllVotes = async (): Promise<Vote[]> => {
  return new Promise((resolve) => {
    setTimeout(async () => {
      try {
        const votes = blockchainStorage.getAllVotes();
        resolve(votes);
      } catch (error) {
        console.error('Error getting votes:', error);
        resolve([]);
      }
    }, SIMULATED_BLOCKCHAIN_DELAY / 3);
  });
};

// Count votes for each candidate (simulated blockchain query)
export const getVoteCounts = async (): Promise<VoteCount[]> => {
  return new Promise((resolve) => {
    setTimeout(async () => {
      try {
        const votes = blockchainStorage.getAllVotes();
        const counts: Record<string, number> = {};
        
        votes.forEach(vote => {
          counts[vote.candidateId] = (counts[vote.candidateId] || 0) + 1;
        });
        
        const voteCounts: VoteCount[] = Object.entries(counts).map(([candidateId, count]) => ({
          candidateId,
          count
        }));
        
        resolve(voteCounts);
      } catch (error) {
        console.error('Error counting votes:', error);
        resolve([]);
      }
    }, SIMULATED_BLOCKCHAIN_DELAY / 3);
  });
};

// Connect to blockchain (simulation)
export const connectToBlockchain = async (): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Connected to centralized blockchain network');
      resolve(true);
    }, SIMULATED_BLOCKCHAIN_DELAY / 2);
  });
};

// Clear all votes (admin function)
export const clearAllVotes = async (): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(async () => {
      try {
        blockchainStorage.clearVotes();
        console.log('All votes cleared from blockchain');
        resolve(true);
      } catch (error) {
        console.error('Error clearing votes:', error);
        resolve(false);
      }
    }, SIMULATED_BLOCKCHAIN_DELAY / 2);
  });
};
