
import { Candidate } from '@/utils/candidatesData';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Vote, Check } from 'lucide-react';
import { useVoting } from '@/context/VotingContext';

interface CandidateCardProps {
  candidate: Candidate;
}

const CandidateCard: React.FC<CandidateCardProps> = ({ candidate }) => {
  const { selectCandidate, hasVoted, selectedCandidate } = useVoting();
  
  const isSelected = selectedCandidate?.id === candidate.id;
  
  return (
    <Card className={`overflow-hidden transition-all duration-300 ${
      isSelected ? 'ring-2 ring-voteteal-700 shadow-lg' : 'hover:shadow-md'
    }`}>
      <div className="aspect-square overflow-hidden">
        <img 
          src={candidate.image} 
          alt={candidate.name} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>
      
      <CardContent className="p-4">
        <h3 className="text-lg font-medium mb-1">{candidate.name}</h3>
        <p className="text-sm font-medium text-voteteal-700">{candidate.party}</p>
      </CardContent>
      
      <CardFooter className="px-4 pb-4 pt-0">
        <Button 
          className="w-full vote-button"
          variant={isSelected ? "default" : "outline"}
          onClick={() => selectCandidate(candidate)}
          disabled={hasVoted}
        >
          {isSelected ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Selected
            </>
          ) : (
            <>
              <Vote className="mr-2 h-4 w-4" />
              Select Candidate
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CandidateCard;
