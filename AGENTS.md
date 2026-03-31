# AGENTS.md

## Purpose

This repository contains the maintained fork of the Asana Expander browser extension. Its job is simple: automatically expand collapsed or truncated content inside Asana so users do not need to keep clicking "See more", "Load more", or similar UI affordances.

The extension currently supports both Chrome and Firefox from the same TypeScript codebase.

## Product Context

The extension runs only on Asana pages and expands hidden content in two main surfaces:

- Inbox notifications
- Task panes

Current user-facing task features:

- Expand project sections to reveal custom fields
- Expand the full subtasks list
- Expand the full comments/activity feed list
- Expand long comment text

Current user-facing inbox features:

- Expand long notification text

Users can enable or disable individual features from the popup UI. Those settings are stored in `browser.storage.sync`.

Important product behavior:

- Task detection is not limited to `/task/` URLs.
- The Asana task pane can also be open on Home routes like `/0/home/<gid>/<gid>`.
- The Asana task pane can also be open from search results on routes like `/0/search?...&child=<gid>`.
- Asana can keep the task details overlay mounted while swapping the active task content inside it.
- Inbox item task views can require inbox and task expanders to run together.

## Architecture

### Core files

- `src/content.ts`
  Main orchestration entry point. Detects relevant Asana routes, loads settings, installs SPA URL-change hooks, runs expanders, and manages mutation observers.
- `src/background.ts`
  Watches tab updates and sends a lightweight `url-changed` message to the content script when Asana tab metadata changes.
- `src/settings.ts`
  Defines the `FeatureSettings` type and `DEFAULT_FEATURE_SETTINGS`.
- `src/popup/popup.html`
  Popup UI markup for feature toggles.
- `src/popup/popup.ts`
  Reads and writes popup toggle state with `browser.storage.sync`.
- `src/manifest.json`
  Shared manifest template with Chrome/Firefox-specific sections.
- `vite.config.ts`
  Builds the final manifest by merging `package.json` version/description into the manifest template.

### Feature modules

- `src/expand-inbox.ts`
- `src/expand-task-projects.ts`
- `src/expand-task-subtasks.ts`
- `src/expand-task-story-feed.ts`
- `src/expand-task-story-rich-text.ts`

Each module should stay narrowly scoped to one expansion behavior.

### Supporting files

- `src/logger.ts`
  Debug logging helper. Logging is intended to be opt-in.
- `src/utils.ts`
  Shared DOM helpers used across expander modules.

## Technical Conventions

### URL and page detection

Be careful when changing scope detection in `src/content.ts`.

- Inbox detection currently keys off `/inbox/`.
- Task detection currently includes:
  - `/task/`
  - `/item/`
  - Home routes with at least two numeric segments after `home`, such as `/0/home/<gid>/<gid>`
  - Search routes with a numeric `child` query parameter, such as `/0/search?...&child=<gid>`

Do not simplify this logic back to just string matching on `/task/`.

### Mutation observer strategy

The extension is designed to avoid broad document-wide observer churn.

- Observe `.InboxFeed` for inbox work.
- Observe `.TaskPane` for task work.
- Use root observers only when waiting for those containers to appear.
- Keep debounce behavior intact unless there is a clear reason to change it.
- When task content changes inside a persistent overlay, clear extension-owned click markers and allow short delayed refresh retries so late-loading story feed content can still expand.

If you broaden observation scope, expect performance regressions inside Asana's SPA.

### Feature flags

Every user-toggleable behavior must be represented consistently in all of these places:

- `src/settings.ts`
- `src/popup/popup.html`
- `src/popup/popup.ts` if new handling is needed
- `src/content.ts`
- Any affected store copy or changelog entries

When removing a feature, remove it end-to-end. Do not leave dead settings, unused popup toggles, or orphaned modules behind.

### Browser support

This project builds for both browsers from one manifest template.

- Chrome uses Manifest V3 service worker background entry.
- Firefox uses Manifest V2 background scripts and browser-specific metadata.

If you change permissions, background behavior, or manifest structure, verify the change still makes sense for both targets.

## Build And Validation

Use these commands:

- `npm run compile`
  Type-check only. This is the fastest basic verification and should be run after code changes.
- `npm run build-chrome`
  Builds Chrome output into `dist/chrome` and zips it.
- `npm run build-ff`
  Builds Firefox output into `dist/firefox` and zips it.
- `npm run build-all`
  Builds both targets.

There is currently no formal automated test suite. In practice, `npm run compile` is the minimum required validation after edits.

For browser-facing changes, it is useful to sanity-check at least one Asana task view and one inbox view manually.

## Release And Store Notes

The extension store summary/description is sourced from `package.json` via `vite.config.ts`.

If the user asks to update the packaged description:

- Edit `package.json`
- Rebuild the extension
- Upload the new package version to the relevant store

Permission rationale matters for store review:

- `storage` is used for popup feature preferences via `browser.storage.sync`
- `tabs` is used to detect tab/title changes and notify the content script
- Asana host permissions are required so the content script can run on Asana pages only

Do not add broader permissions unless they are strictly necessary.

## Editing Guidance

- Preserve the existing TypeScript style and keep modules small.
- Prefer changing the smallest surface that fully solves the issue.
- Keep DOM selectors precise. Asana is an SPA and brittle selectors are common failure points.
- Avoid duplicate expansion logic across modules.
- If a feature already expands a broader surface, do not add a second redundant feature toggle for the same behavior.
- Update `CHANGELOG.md` for user-visible behavior changes.
- If popup copy changes, keep it concise and user-facing rather than implementation-oriented.

## Common Change Patterns

### Adding a new expander

1. Create a focused module in `src/`.
2. Wire it into `src/content.ts`.
3. Add a feature flag in `src/settings.ts` if it should be user-controllable.
4. Add a popup toggle in `src/popup/popup.html` if needed.
5. Run `npm run compile`.
6. Update `CHANGELOG.md`.

### Updating route scope

1. Start in `src/content.ts`.
2. Confirm whether the change affects inbox scope, task scope, or both.
3. Preserve SPA navigation handling through the existing history hooks and background message flow.
4. Run `npm run compile`.

### Changing store-facing copy

Check these first:

- `package.json` for packaged description
- `README.md` for repo-facing description
- `src/popup/popup.html` for popup text

These are separate surfaces and may need separate wording updates.

## Known Repo Realities

- The README may lag behind current product behavior.
- The popup copy may change independently of the store description.
- The changelog is the best source for recent feature history.
- The codebase currently prefers compile-time validation over automated integration tests.

When there is a conflict between README marketing copy and the actual code, trust the code and changelog first.
