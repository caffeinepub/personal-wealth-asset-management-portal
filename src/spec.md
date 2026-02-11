# Specification

## Summary
**Goal:** Rebuild and redeploy Version 11 so users reliably receive the latest dashboard/UI, including service-worker cache busting and an in-app update notice.

**Planned changes:**
- Perform a clean production rebuild and redeploy of the current application state as “Version 11,” ensuring all existing modules load without runtime errors.
- Implement service-worker cache busting/versioning so a Version 11 deploy invalidates old cached assets while preserving offline SPA route fallback behavior.
- Add an in-app, English update notice when a new service worker is waiting, allowing the user to refresh/reload to apply the update.
- Update the offline Windows ZIP bundle metadata/naming to clearly reflect Version 11 and regenerate the bundle from the same build output.

**User-visible outcome:** After deployment, returning users get the latest Version 11 UI (not a stale cached dashboard), see a clear update prompt when a new version is available, and can download/run an offline Windows bundle clearly labeled as Version 11.
