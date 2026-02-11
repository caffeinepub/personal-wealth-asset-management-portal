# Specification

## Summary
**Goal:** Convert the existing portal into a fully offline-capable web app that loads without authentication and stores all data locally (IndexedDB), while preserving the current UI and behaviors.

**Planned changes:**
- Remove the Internet Identity login gating so the app shell and routes load directly and all modules remain accessible offline.
- Replace backend-dependent profile behavior with a local-only profile (persist display name locally; keep the existing one-time ProfileSetupDialog prompt flow).
- Add a local persistence layer using IndexedDB to store and retrieve all module entities offline (loans, properties, wealth inputs, cashflow entries, M(P/L) matches, M(P/L) entries), including IDs and timestamps as used by the UI.
- Refactor feature data access to use the local persistence layer via React Query (keeping existing queryKeys and invalidation behavior) instead of canister actor calls, without modifying immutable hook files or read-only UI components.
- Re-implement derived/aggregate computations to run locally (dashboard overview metrics, net worth summary totals, lending insights chart datasets, monthly cash flow KPI derived from lending interest logic).
- Re-implement Daily Profit/Loss report generation to compute strictly from locally stored cashflow entries while preserving existing report semantics.
- Ensure M(P/L) match/entry workflows and settlement (including match freezing and persistence of settlement/winner state) work fully offline using local storage.
- Add offline caching for the static frontend bundle (service worker/PWA or equivalent) so the app loads and routes remain navigable offline after an initial online load.

**User-visible outcome:** The app opens and works without network access (no login blocking), all modules can create/edit/delete data that persists across reloads on the same device, dashboards/reports/charts compute locally, and the app shell/routes load offline after the first online visit.
