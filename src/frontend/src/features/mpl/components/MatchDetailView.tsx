import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Trophy } from 'lucide-react';
import { Match, MatchStatus, PLSummary } from '@/backend';
import { formatInr } from '@/utils/currency';
import EntryFormCard from './EntryFormCard';
import EntriesTable from './EntriesTable';
import SettleMatchDialog from './SettleMatchDialog';
import { useListEntries, useGetPLSummary } from '../api';

interface MatchDetailViewProps {
  match: Match;
  onBack: () => void;
}

function getStatusBadge(status: MatchStatus) {
  switch (status) {
    case MatchStatus.pending:
      return <Badge variant="outline">Pending</Badge>;
    case MatchStatus.in_progress:
      return <Badge variant="secondary">In Progress</Badge>;
    case MatchStatus.completed:
      return <Badge>Completed</Badge>;
    case MatchStatus.settled:
      return <Badge variant="destructive">Settled</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
}

export default function MatchDetailView({ match, onBack }: MatchDetailViewProps) {
  const { data: entries = [], isLoading: entriesLoading } = useListEntries(match.id);
  const { data: plSummary, isLoading: plLoading } = useGetPLSummary(match.id);

  const isSettled = match.status === MatchStatus.settled;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Matches
        </Button>
        {!isSettled && <SettleMatchDialog match={match} />}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{match.matchName}</CardTitle>
              <p className="text-muted-foreground mt-2">
                {match.team1} vs {match.team2}
              </p>
            </div>
            {getStatusBadge(match.status)}
          </div>
        </CardHeader>
        <CardContent>
          {isSettled && match.winner && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-green-500" />
                <span className="font-semibold text-green-500">Winner: {match.winner}</span>
              </div>
              {match.settledAt && (
                <p className="text-xs text-muted-foreground mt-1">
                  Settled on {new Date(Number(match.settledAt) / 1000000).toLocaleString()}
                </p>
              )}
            </div>
          )}

          {plSummary && (
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{plSummary.team1}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">If {plSummary.team1} wins:</span>
                    <span className={`font-semibold ${plSummary.team1StrongPL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {formatInr(plSummary.team1StrongPL)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">If {plSummary.team1} loses:</span>
                    <span className={`font-semibold ${plSummary.team1WeakPL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {formatInr(plSummary.team1WeakPL)}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{plSummary.team2}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">If {plSummary.team2} wins:</span>
                    <span className={`font-semibold ${plSummary.team2StrongPL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {formatInr(plSummary.team2StrongPL)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">If {plSummary.team2} loses:</span>
                    <span className={`font-semibold ${plSummary.team2WeakPL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {formatInr(plSummary.team2WeakPL)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {isSettled && plSummary?.finalScore !== undefined && plSummary.finalScore !== null && (
            <Card className="mt-4 bg-primary/5 border-primary/20">
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Final P/L:</span>
                  <span className={`text-2xl font-bold ${plSummary.finalScore >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {formatInr(plSummary.finalScore)}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {!isSettled && <EntryFormCard match={match} />}

      <EntriesTable entries={entries} isLoading={entriesLoading} />
    </div>
  );
}
