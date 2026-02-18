# Changelog

All notable changes to `asana-expander-v2-extension` will be documented in this file.

## Unreleased

- Add auto-expansion for "Load more" in task subtasks
- Re-run task expansions when navigating between tasks in the Asana UI
- Prevent repeated expand clicks that caused hidden comments to toggle open/closed
- Run inbox and task expanders together for inbox item task views
- Keep inbox expansions working when switching Inbox tabs (e.g., Archive)
- Scope mutation observers to inbox/task containers for lower overhead
- Replace DOM-mutation URL watcher with history API hooks for SPA navigation
- Build scripts zip the dist outputs after builds

## v4.2.2 - 2026-01-26

- Add Firefox-specific add-on metadata (gecko ID and data collection permissions)

## v4.2.1 - 2026-01-26

- Split build outputs by browser target

## v4.2.0 - 2026-01-23

- Add auto-expansion for "See more" in the Asana Inbox feed
- Expand newly loaded inbox items as they appear when scrolling

## v4.1.0 - 2026-01-23

- Make extension logging opt-in via local storage debug flag

## v4.0.1 - 2026-01-23

- Guard background messaging when no content script is present

## v4.0.0 - 2026-01-23

- Establish fork baseline for ongoing maintenance and releases

## v3.0.0 - 2023-06-29

- Add Support for Manifest v3 for Chrome (still using Manifest v2 for Firefox)
- Rewrite Extension in TypeScript
- Switch to Vite as build tool

## v2.0.2 - 2020-04-10

- Disable extension when viewing Asana Inbox [#4](https://github.com/stefanzweifel/asana-expander-extension/pull/4)

## v2.0.1 - 2020-04-10

- Bug Fixes

## v2.0.0 - 2020-04-10

- Make extension compatible with Firefox (Port of the [Chrome extension](https://github.com/stefanzweifel/chrome-asana-expander))
