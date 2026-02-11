import { useState } from 'react';
import { useListMatches, useGetMatch } from '@/features/mpl/api';
import CreateMatchDialog from '@/features/mpl/components/CreateMatchDialog';
import MatchesListCard from '@/features/mpl/components/MatchesListCard';
import MatchDetailView from '@/features/mpl/components/MatchDetailView';

export default function MatchProfitLossPage() {
  const [selectedMatchId, setSelectedMatchId] = useState<bigint | null>(null);
  const { data: matches = [], isLoading: matchesLoading } = useListMatches();
  const { data: selectedMatch, isLoading: matchLoading } = useGetMatch(selectedMatchId);

  const handleSelectMatch = (matchId: bigint) => {
    setSelectedMatchId(matchId);
  };

  const handleBack = () => {
    setSelectedMatchId(null);
  };

  if (matchesLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Loading matches...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {!selectedMatchId ? (
        <>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">M(P/L)</h1>
              <p className="text-muted-foreground mt-2">
                Track betting profit and loss for your matches
              </p>
            </div>
            <CreateMatchDialog />
          </div>

          <MatchesListCard matches={matches} onSelectMatch={handleSelectMatch} />
        </>
      ) : matchLoading ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Loading match details...</p>
        </div>
      ) : selectedMatch ? (
        <MatchDetailView match={selectedMatch} onBack={handleBack} />
      ) : (
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Match not found</p>
        </div>
      )}
    </div>
  );
}
