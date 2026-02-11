import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trophy, ChevronRight } from 'lucide-react';
import { Match, MatchStatus } from '@/backend';
import { formatInr } from '@/utils/currency';

interface MatchesListCardProps {
  matches: Match[];
  onSelectMatch: (matchId: bigint) => void;
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

export default function MatchesListCard({ matches, onSelectMatch }: MatchesListCardProps) {
  if (matches.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Matches</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Trophy className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No matches yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Create your first match to start tracking betting P/L
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Matches</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {matches.map((match) => (
            <Button
              key={match.id.toString()}
              variant="outline"
              className="w-full justify-between h-auto py-4"
              onClick={() => onSelectMatch(match.id)}
            >
              <div className="flex flex-col items-start gap-1">
                <div className="font-semibold">{match.matchName}</div>
                <div className="text-sm text-muted-foreground">
                  {match.team1} vs {match.team2}
                </div>
                {match.winner && (
                  <div className="text-xs text-green-500">
                    Winner: {match.winner}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(match.status)}
                <ChevronRight className="h-4 w-4" />
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
