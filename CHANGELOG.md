# Changelog

## [1.0.0] - 2026-02-23

### Added
- Initial release
- Polling-based main loop with configurable interval (`POLL_INTERVAL`)
- Scanner module for finding new content gigs
- Proposer module with seen-gig tracking to avoid duplicate proposals
- Worker module for delivering content on funded contracts
- Configurable categories via `CATEGORIES` env var
