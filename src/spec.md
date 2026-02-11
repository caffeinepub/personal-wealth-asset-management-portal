# Specification

## Summary
**Goal:** Fix offline local persistence so creating/saving Loans, Properties, and M(P/L) Matches works reliably without errors, with clearer failure messaging and an IndexedDB availability guard.

**Planned changes:**
- Fix the local persistence layer for create/save flows so new Loans, Properties, and M(P/L) Matches persist successfully and appear immediately in their respective lists without a refresh.
- Normalize IndexedDB read/write types to eliminate BigInt-related key/value mismatches for IDs, timestamps, and indexed fields (e.g., matchId) so persisted data can be read back correctly (including timestamp-based comparisons and matchId-based entry lookups).
- Improve save/create failure reporting: keep existing success toasts unchanged, but show clearer English error toasts with a short actionable hint when available, and log the underlying error for debugging without crashing the UI.
- Add a runtime guard for contexts where IndexedDB is unavailable/blocked and show a blocking in-app notice explaining the app must be run from a local server origin (http://localhost/...) rather than file://.

**User-visible outcome:** Users can add a Loan, add a Property, and create an M(P/L) Match successfully in offline mode, seeing the new records immediately in the UI; if storage is unavailable, the app shows a clear English notice explaining how to run it correctly and save/create failures provide more informative error messages.
