# Releasing

Silicon UI ships two ways from the same source:

- **The shadcn registry** at ui.teamofsilicons.com: rebuilt and redeployed on every merge to `main` (see the README's
  "How releases work"). Blocks are installed this way.
- **The npm package** `@teamofsilicons/silicon-ui`: versioned, published by hand with the steps below. Components
  are installed this way.

## Versioning

Semantic versioning, while below 1.0:

| Change | Bump |
| --- | --- |
| A fix, a new token with a default that changes nothing, a new component | patch or minor (`0.2.0` → `0.2.1` or `0.3.0`) |
| A removed or renamed component, prop or token; a default that changes how existing screens look | minor (`0.2.x` → `0.3.0`), with a changelog note on what to change |

Apps depend on `^0.x.y`, which accepts patches only below 1.0, so a minor release is a deliberate upgrade in each app.

## Steps

1. Set the version in `packaging/package.json`.
2. Add the changelog entry.
3. Build and look at what will be published:

   ```sh
   npm run check
   npm run build:package
   cd dist/package && npm pack --dry-run
   ```

4. Publish (a member of the `teamofsilicons` npm organization, with two-factor authentication on):

   ```sh
   cd dist/package && npm publish --access public
   ```

   npm opens the browser to confirm with your passkey. It ends with `+ @teamofsilicons/silicon-ui@<version>`.
5. Check it is live: `npm view @teamofsilicons/silicon-ui version`.
6. Upgrade each app (`pnpm add @teamofsilicons/silicon-ui@^<version>`), run its checks, and look at its screens.

## Things that have tripped us up

| Problem | Cause | Fix |
| --- | --- | --- |
| `403 … Two-factor authentication … required to publish` | 2FA is off on the npm account | Turn it on at npmjs.com → Account → Two-Factor Authentication |
| No passkey prompt, still 403 | The terminal's npm login predates 2FA | `npm login --auth-type=web`, then publish again |
| `Package name too similar to existing package silicon.ui` | npm blocks lookalike unscoped names | The package is scoped: `@teamofsilicons/silicon-ui` |
| `npm view` shows only `0.0.0-stage` right after publishing | A placeholder npm creates while it processes the upload | Wait a minute and check again |
| An app cannot resolve a new export | The app still has the previous version | Upgrade the app; `npm view … version` to confirm what is live |
