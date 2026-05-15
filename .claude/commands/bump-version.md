Bump the project version and update all relevant documentation.

## Argument

The first argument is the bump type: `patch`, `minor`, or `major`. If not provided, default to `patch`.

## Steps

1. **Read the current version** from `package.json`.

2. **Calculate the new version** based on the bump type:
   - `patch`: increment the third number (0.7.4 → 0.7.5)
   - `minor`: increment the second number, reset patch (0.7.4 → 0.8.0)
   - `major`: increment the first number, reset minor and patch (0.7.4 → 1.0.0)

3. **Update `package.json`** — set `"version"` to the new version.

4. **Update `package-lock.json`** — set both occurrences of the version (top-level and under `"packages": { "": { ... } }`).

5. **Update `CHANGELOG.md`** — add a new section at the top (below the `# Changelog` heading) using the format:
   ```
   ## vX.Y.Z - YYYY-MM-DD
   ```
   Use today's date. Look at the git diff (`git diff HEAD`) and recent commits (`git log --oneline -10`) to infer what changed, then write concise bullet points describing the changes. Ask the user to confirm or edit the bullets before writing if the changes are ambiguous.

6. **Update `README.md`** — only if the change adds, removes, or renames a feature visible to users. Skip for bug fixes and internal changes.

7. **Update `.claude/CLAUDE.md`** — only if the change introduces or modifies a convention, constraint, or pattern that future agents need to know (e.g. a new escape helper, a new destination, a schema rule). Skip for bug fixes and routine bumps.

8. **Confirm** by printing the new version and a summary of which files were updated.
