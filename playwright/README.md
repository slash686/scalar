# Playwright Testing

1. Ensure you have downloaded Playwright and all its dependencies including the browsers necessary for running the tests
   `pnpm exec playwright install`
   `pnpm playwright:install` or `npx playwright install --with-deps`

2. Ensure the server(s) you want to test is running. For the cdn tests:
   `pnpm --filter cdn-api-reference dev`

3. Run Playwright e2e tests with `pnpm test:e2e` or `pnpm test:e2e:ui` with the option to filter for specific tests like `pnpm test:e2e cdn`

## Visual Regression Testing

We are testing the `api-reference` on the CDN using Playwright's built-in snapshot diffing features.

Changes to the api-reference UI require updated snapshots for testing.

Playwright stores snapshots with a suffix related to the environment it was run in. On mac this will be `-darwin` and on linux it will be `-linux`.

4. Update snapshots if necessary

```
pnpm test:e2e --update-snapshots
```
