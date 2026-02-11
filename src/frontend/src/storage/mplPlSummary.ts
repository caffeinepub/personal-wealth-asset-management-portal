import { getMatch, listEntries } from './mplRepo';
import type { PLSummary } from '@/backend';

export async function getTeamPLSummary(matchId: bigint): Promise<PLSummary> {
  const match = await getMatch(matchId);
  if (!match) throw new Error('Match not found');

  const entries = await listEntries(matchId);

  let team1StrongPL = 0;
  let team1WeakPL = 0;
  let team2StrongPL = 0;
  let team2WeakPL = 0;

  for (const entry of entries) {
    const isTeam1Entry = entry.favoriteTeam === match.team1;
    
    if (entry.entryType === 'back') {
      if (isTeam1Entry) {
        team1StrongPL += (entry.rate - 1) * entry.amount;
        team2WeakPL -= entry.amount;
      } else {
        team2StrongPL += (entry.rate - 1) * entry.amount;
        team1WeakPL -= entry.amount;
      }
    } else { // lay
      if (isTeam1Entry) {
        team1StrongPL -= (entry.rate - 1) * entry.amount;
        team2WeakPL += entry.amount;
      } else {
        team2StrongPL -= (entry.rate - 1) * entry.amount;
        team1WeakPL += entry.amount;
      }
    }
  }

  const totalPL = team1StrongPL + team2StrongPL;
  
  let finalScore: number | undefined;
  if (match.status === 'settled' && match.winner) {
    if (match.winner === match.team1) {
      finalScore = team1StrongPL + team2WeakPL;
    } else {
      finalScore = team2StrongPL + team1WeakPL;
    }
  }

  return {
    id: matchId,
    matchId,
    team1: match.team1,
    team2: match.team2,
    status: match.status,
    winner: match.winner,
    team1StrongPL,
    team1WeakPL,
    team2StrongPL,
    team2WeakPL,
    totalPL,
    finalScore,
  };
}
