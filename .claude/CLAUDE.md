# Asana Expander v2 — Claude Reference

Browser extension that auto-expands collapsed/truncated content in Asana. Supports Chrome (MV3) and Firefox (MV2) from one TypeScript codebase.

## After Any Code Change

```
npm run compile       # type-check — minimum required validation
npm run build-chrome  # builds to dist/chrome + zip
npm run build-ff      # builds to dist/firefox + zip
npm run build-all     # both
```

No automated test suite. `npm run compile` is the gate. For DOM-facing changes, manually verify one task view and one inbox view.

## File Map

| File | Role |
|---|---|
| [src/content.ts](../src/content.ts) | Main orchestrator: route detection, settings, SPA hooks, mutation observers |
| [src/background.ts](../src/background.ts) | Watches tab updates, sends `url-changed` to content script |
| [src/settings.ts](../src/settings.ts) | `FeatureSettings` type + `DEFAULT_FEATURE_SETTINGS` |
| [src/expand-inbox.ts](../src/expand-inbox.ts) | Inbox notification expansion |
| [src/expand-task-projects.ts](../src/expand-task-projects.ts) | Project section / custom fields expansion |
| [src/expand-task-subtasks.ts](../src/expand-task-subtasks.ts) | Subtasks list expansion |
| [src/expand-task-story-feed.ts](../src/expand-task-story-feed.ts) | Comments/activity feed expansion |
| [src/expand-task-story-rich-text.ts](../src/expand-task-story-rich-text.ts) | Long comment text expansion |
| [src/logger.ts](../src/logger.ts) | Opt-in debug logging |
| [src/utils.ts](../src/utils.ts) | Shared DOM helpers |
| [src/popup/popup.html](../src/popup/popup.html) | Popup toggle UI |
| [src/popup/popup.ts](../src/popup/popup.ts) | Reads/writes toggle state via `browser.storage.sync` |
| [src/manifest.json](../src/manifest.json) | Shared manifest template |
| [vite.config.ts](../vite.config.ts) | Merges `package.json` version/description into manifest at build |

## Route Detection — Do Not Simplify

Task detection is **not** just `/task/` URLs. Task panes also appear on:

- `/0/home/<gid>/<gid>` — Home routes (two numeric segments after `home`)
- `/0/search?...&child=<gid>` — Search routes with numeric `child` param
- `/item/` routes

Inbox detection keys off `/inbox/`.

Do not collapse this back to plain `/task/` string matching.

## Mutation Observer Rules

- Inbox work: observe `.InboxFeed`
- Task work: observe `.TaskPane`
- Use root observers only while waiting for those containers to appear
- Keep debounce behavior intact
- When task content swaps inside a persistent overlay: clear extension-owned click markers and allow short delayed refresh retries for late-loading story feed content

Broadening observer scope causes SPA performance regressions.

## DOM Gotchas

- `.TaskPaneFields-loadMore` can appear outside `.TaskProjects` — don't assume it lives inside
- Several Asana expand controls **stay mounted after being clicked** and only change text/ARIA state. Guard auto-clicks by current button text, not just selector presence or `data-asana-expander-clicked`
- Text-state guards currently in use:
  - Story feed: skip `Hide earlier comments`
  - Custom project fields: skip `Hide custom fields`
  - Inherited fields: click only `Show inherited fields`
- If an auto-clicked control retains focus, `blur()` it after clicking

## Feature Flag Checklist

Every user-toggleable feature must be wired consistently in **all** of:

- [src/settings.ts](../src/settings.ts)
- [src/popup/popup.html](../src/popup/popup.html)
- [src/popup/popup.ts](../src/popup/popup.ts) (if new handling needed)
- [src/content.ts](../src/content.ts)
- CHANGELOG.md

When removing a feature: remove it end-to-end. No dead settings, orphaned toggles, or unused modules.

## Common Patterns

### Add a new expander
1. Create focused module in `src/`
2. Wire into [src/content.ts](../src/content.ts)
3. Add feature flag in [src/settings.ts](../src/settings.ts) if user-controllable
4. Add popup toggle in [src/popup/popup.html](../src/popup/popup.html) if needed
5. `npm run compile`
6. Update CHANGELOG.md

### Update route scope
1. Start in [src/content.ts](../src/content.ts)
2. Confirm: inbox scope, task scope, or both?
3. Preserve SPA navigation via existing history hooks + background message flow
4. `npm run compile`

### Update store-facing copy
- `package.json` → packaged description (injected at build time)
- `README.md` → repo description
- [src/popup/popup.html](../src/popup/popup.html) → popup text

These are separate surfaces and may need separate wording.

## Browser Targets

| Target | Manifest | Background |
|---|---|---|
| Chrome | MV3 | Service worker |
| Firefox | MV2 | Background scripts + browser-specific metadata |

Changing permissions, background behavior, or manifest structure requires verifying both targets.

## Store Permissions Rationale

- `storage` — popup feature preferences via `browser.storage.sync`
- `tabs` — detect tab/title changes to notify content script
- Asana host permissions — content script scope limited to Asana only

Do not add broader permissions unless strictly necessary.

## Working Notes

- Changelog is the best source for recent feature history — README may lag
- When README marketing copy conflicts with code, trust the code and changelog
- Keep modules small and narrowly scoped to one expansion behavior
- Keep DOM selectors precise — Asana is an SPA and selectors are common failure points
- Do not add redundant toggles if a feature already covers the same surface
