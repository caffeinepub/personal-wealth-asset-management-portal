import { Entry, EntryType } from '@/backend';

/**
 * Calculate P/L for a specific team based on entries
 * @param entries - All entries for the match
 * @param teamName - The team to calculate P/L for
 * @param isStrong - Whether calculating for when this team wins (strong) or loses (weak)
 * @returns The P/L amount for this team in this scenario
 */
export function calculateTeamPL(entries: Entry[], teamName: string, isStrong: boolean): number {
  let pl = 0;

  for (const entry of entries) {
    const isTeamEntry = entry.favoriteTeam === teamName;
    
    // Only process entries that match the scenario (strong/weak)
    if (isTeamEntry === isStrong) {
      if (entry.entryType === EntryType.back) {
        if (isStrong) {
          // Backing the favorite and it wins
          pl += (entry.rate - 1.0) * entry.amount;
        } else {
          // Backing the underdog and it wins
          pl -= (entry.rate - 1.0) * entry.amount;
        }
      } else if (entry.entryType === EntryType.lay) {
        if (isStrong) {
          // Laying the favorite and it wins
          pl -= (entry.rate - 1.0) * entry.amount;
        } else {
          // Laying the underdog and it wins
          pl += (entry.rate - 1.0) * entry.amount;
        }
      }
    }
  }

  return pl;
}

/**
 * Calculate the opposite team's P/L based on an entry
 */
export function calculateOppositePL(entry: Entry, favoriteTeam: string): number {
  if (entry.entryType === EntryType.back) {
    return -entry.amount;
  } else {
    return entry.amount;
  }
}
