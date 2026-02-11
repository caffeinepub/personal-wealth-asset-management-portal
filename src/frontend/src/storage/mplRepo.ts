import { getAll, getByIndex, put, deleteById } from './indexedDb';
import { generateId } from './ids';
import { now } from './timestamps';
import type { Match, MatchInput, Entry, EntryInput, MatchStatus } from '@/backend';

export async function listMatches(): Promise<Match[]> {
  return getAll<Match>('matches');
}

export async function getMatch(matchId: bigint): Promise<Match | null> {
  const matches = await getAll<Match>('matches');
  return matches.find(m => m.id === matchId) || null;
}

export async function createMatch(input: MatchInput): Promise<bigint> {
  const id = input.id ?? await generateId('match');
  const timestamp = now();

  const match: Match = {
    id,
    matchName: input.matchName,
    team1: input.team1,
    team2: input.team2,
    status: 'pending' as MatchStatus,
    winner: undefined,
    createdAt: timestamp,
    updatedAt: timestamp,
    settledAt: undefined,
  };

  await put('matches', match);
  return id;
}

export async function listEntries(matchId: bigint): Promise<Entry[]> {
  return getByIndex<Entry>('entries', 'matchId', Number(matchId));
}

export async function addEntry(input: EntryInput): Promise<bigint> {
  const id = await generateId('entry');
  const timestamp = now();

  const entry: Entry = {
    id,
    matchId: input.matchId,
    favoriteTeam: input.favoriteTeam,
    entryType: input.entryType,
    rate: input.rate,
    amount: input.amount,
    bookieName: input.bookieName,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  await put('entries', entry);
  return id;
}

export async function settleMatch(matchId: bigint, winner: string): Promise<void> {
  const match = await getMatch(matchId);
  if (!match) throw new Error('Match not found');

  const updatedMatch: Match = {
    ...match,
    status: 'settled' as MatchStatus,
    winner,
    settledAt: now(),
    updatedAt: now(),
  };

  await put('matches', updatedMatch);
}
