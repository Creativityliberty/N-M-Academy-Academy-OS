# M13.0 Mission Tower Foundation Design

## Goal
Add Mission Tower as an isolated domain/module inside NÜM Academy OS while reusing the existing Academy shell and Theme Engine.

## Boundaries
- Tower lives under `app/MissionTower` and `resources/js/mission-tower`.
- Tower must not query Academy Eloquent business models directly for orchestration; Academy capabilities are reached through the Academy MCP boundary.
- Same visual shell/theme/components as Academy OS; no parallel design system.
- No new container or database service for M13.0.
- Academy MCP is required for operational Tower use.
- OpenAI or DeepSeek may be inherited from Academy AI; Tower adds no mandatory third AI provider.
- NümFlow and Harness bridges are optional and disabled by default.
- Coolify API is optional for fleet/factory operations; not required for single-Academy Tower.

## M13.0 deliverable
- Mission Tower config and feature flag.
- Dedicated Tower routes and folder structure.
- Academy MCP HTTP client boundary.
- Tower readiness service and `/tower` overview/setup surface.
- `academy:tower-check` CLI diagnostic.
- Complete `.env` setup example and setup guide.
