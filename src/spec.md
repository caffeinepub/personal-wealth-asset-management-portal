# Specification

## Summary
**Goal:** Add a new M(P/L) module to track multiple betting matches with per-match entries, running per-team profit/loss, and match settlement.

**Planned changes:**
- Add a new left-nav item labeled “M(P/L)” and register a new routed page for the module (authenticated via the existing AuthGate flow).
- Build M(P/L) UI to create and list matches, each match containing exactly two user-defined team names, with a match detail view.
- Within a match, add an entry form and entry list/table capturing: favorite team (one of the two teams), Back/Lay, rate (decimal), bet amount (INR), and bookie name; allow unlimited entries per match.
- Compute and display running cumulative P/L for both teams after each entry using the specified universal formulas, with consistent INR (₹) formatting.
- Add match settlement flow: choose the winner from the two teams, store settled timestamp, freeze the match, and block new entries after settlement.
- Implement Motoko backend storage and APIs for per-user matches and entries (create/list/get matches, add/list entries, per-match P/L summary, settle match) enforcing the existing access-control pattern.
- Integrate frontend to backend using existing React Query patterns: feature-scoped hooks, centralized query keys, and invalidation so match list, entries, and P/L stay in sync after mutations.

**User-visible outcome:** Users can open the new “M(P/L)” page, create and manage multiple matches (two teams each), add betting entries to see live running P/L per team in ₹, and settle a match by selecting the winner to lock the final result and prevent further entries.
