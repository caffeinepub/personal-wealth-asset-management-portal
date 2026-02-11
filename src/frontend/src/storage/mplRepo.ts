import { getAll, getByIndex, put, deleteById, deserializeFromStorage } from './indexedDb';
import { generateId } from './ids';
import { now } from './timestamps';
import type { Match, MatchInput, Entry, EntryInput, MatchStatus } from '@/backend';

const MATCH_BIGINT_FIELDS = ['id', 'createdAt', 'updatedAt', 'settledAt'];
const ENTRY_BIGINT_FIELDS = ['id', 'matchId', 'createdAt', 'updatedAt'];

export async function listMatches(): Promise<Match[]> {
  try {
    const raw = await getAll<any>('matches');
    return raw.map(item => deserializeFromStorage<Match>(item, MATCH_BIGINT_FIELDS));
  } catch (error) {
    console.error('listMatches error:', error);
    throw new Error('Failed to load matches. Please try again.');
  }
}

export async function getMatch(matchId: bigint): Promise<Match | null> {
  try {
    const matches = await listMatches();
    return matches.find(m => m.id === matchId) || null;
  } catch (error) {
    console.error('getMatch error:', error);
    throw new Error('Failed to load match. Please try again.');
  }
}

export async function createMatch(input: MatchInput): Promise<bigint> {
  try {
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
  } catch (error) {
    console.error('createMatch error:', error);
    throw new Error('Failed to create match. Please check your data and try again.');
  }
}

export async function listEntries(matchId: bigint): Promise<Entry[]> {
  try {
    const raw = await getByIndex<any>('entries', 'matchId', matchId);
    return raw.map(item => deserializeFromStorage<Entry>(item, ENTRY_BIGINT_FIELDS));
  } catch (error) {
    console.error('listEntries error:', error);
    throw new Error('Failed to load entries. Please try again.');
  }
}

export async function addEntry(input: EntryInput): Promise<bigint> {
  try {
    // Check if match is settled
    const match = await getMatch(input.matchId);
    if (match?.status === 'settled') {
      throw new Error('Cannot add entries to a settled match');
    }

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
  } catch (error) {
    console.error('addEntry error:', error);
    if (error instanceof Error && error.message.includes('settled match')) {
      throw error;
    }
    throw new Error('Failed to add entry. Please check your data and try again.');
  }
}

export async function settleMatch(matchId: bigint, winner: string): Promise<void> {
  try {
    const match = await getMatch(matchId);
    if (!match) throw new Error('Match not found');

    if (match.status === 'settled') {
      throw new Error('Match is already settled');
    }

    const updatedMatch: Match = {
      ...match,
      status: 'settled' as MatchStatus,
      winner,
      settledAt: now(),
      updatedAt: now(),
    };

    await put('matches', updatedMatch);
  } catch (error) {
    console.error('settleMatch error:', error);
    if (error instanceof Error && error.message.includes('already settled')) {
      throw error;
    }
    throw new Error('Failed to settle match. Please try again.');
  }
}
