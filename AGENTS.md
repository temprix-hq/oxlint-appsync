# AGENTS.md

Last updated: July 31st, 2026

Guidance for humans and coding agents working in this repository.

## What this repo is

`oxlint-appsync` is an Oxlint (and ESLint-compatible) plugin that enforces [AWS AppSync JavaScript runtime restrictions](https://docs.aws.amazon.com/appsync/latest/devguide/supported-features.html). Each rule maps a documented AppSync limitation to a lint violation so resolver code fails in CI before deployment.

- **Runtime target:** AppSync JS resolvers (ES2022-ish, strict mode, no Node APIs).
- **Plugin API:** Oxlint `createOnce` rules wrapped with `@oxlint/plugins` `eslintCompatPlugin`.
- **Presets:** `recommended` (all syntax rules) and `portable` (`recommended` plus opt-in `no-appsync-globals` for shared modules).

Cross-check new rules against the [AWS supported-features page](https://docs.aws.amazon.com/appsync/latest/devguide/supported-features.html).

## Repository layout

| Path                               | Purpose                                                                                                |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `src/plugin.ts`                    | Plugin export, `recommended` / `portable` presets, opt-in rule set                                     |
| `src/rules/`                       | Individual rule implementations (`defineAppsyncRule`, `createOnce` listeners)                          |
| `src/rules/index.ts`               | Rule registry — register every new rule here                                                           |
| `src/rules/types.ts`               | `AppsyncRuleModule`, `defineAppsyncRule` helper                                                        |
| `src/rules/utils.ts`               | Shared helpers (`reportDefault`, `isIdentifier`, …)                                                    |
| `tests/rules/`                     | Per-rule tests via `runAppsyncRuleTests`                                                               |
| `tests/helpers/rule-tester.ts`     | ESLint `RuleTester` bridge for Oxlint rules                                                            |
| `tests/fixtures/sample-appsync.js` | Fixture exercised by the oxlint smoke test (ignored by root `.oxlintrc.json` — intentional violations) |
| `tests/smoke.test.ts`              | Runs oxlint CLI against the fixture; expects every `recommended` rule to fire                          |
| `oxlintrc.example.json`            | Example consumer config — update when adding non-opt-in rules                                          |
| `.oxlintrc.json`                   | Root dev config — ignores `tests/fixtures/**` from default oxlint                                      |

## Development

Package manager and scripts use **Bun** (`bun.lock`). There is no formatter or `lint:fix` script.

```bash
bun install
bun run build      # tsdown → dist/
bun run lint       # oxlint on src, tests, configs
bun run typecheck  # tsc --noEmit
bun test           # build + full vitest suite (unit + smoke)
bun run test:unit  # vitest rules only (skips smoke; build first if dist is stale)
```

### Verification (agents)

Before finishing a task, run **build**, **lint**, **typecheck**, and **tests** on the current tree:

```bash
bun run build && bun run lint && bun run typecheck && bun test
```

Run this once after all code changes are done (including tests and doc edits). Re-run after any later edit. Do not claim checks passed based on an earlier run in the same session — only report success when the **last** run succeeded on the current tree.

## Adding or changing a rule

1. **Confirm the restriction** in the [AWS supported-features docs](https://docs.aws.amazon.com/appsync/latest/devguide/supported-features.html). Do not invent limits AppSync does not document.
2. **Implement** `src/rules/<rule-name>.ts` using `defineAppsyncRule` and `createOnce`. Prefer `reportDefault` for a single `default` message; use `context.report` with `data` when the message needs placeholders (see `no-global-constructor`).
3. **Register** the rule in `src/rules/index.ts` (keeps `AppsyncRuleName` accurate).
4. **Test** in `tests/rules/<rule-name>.test.ts` with `runAppsyncRuleTests`. Cover valid AppSync patterns (including `util.*` where relevant) and invalid cases with `errors: [{ messageId: "default" }]`.
5. **Smoke fixture:** if the rule is in `recommended`, add a violating snippet to `tests/fixtures/sample-appsync.js` so `tests/smoke.test.ts` continues to expect every preset rule.
6. **Consumer config:** add non-opt-in rules to `oxlintrc.example.json`.
7. **User-facing docs:** update the README rules table when behavior or the rule list changes.

**Opt-in rules** (e.g. `no-appsync-globals`): add the name to `OPT_IN_RULES` in `src/plugin.ts` so they are excluded from `recommended` but included in `portable`. Document the preset difference in README.

## Code conventions

- **TypeScript:** `strict`, `verbatimModuleSyntax`, ESM. Local imports use `.js` extensions (e.g. `./types.js`).
- **Rule shape:** `meta` (type, docs, messages, schema) + `createOnce(context)` returning an AST listener map. Match naming and structure of existing rules in `src/rules/`.
- **Shared logic:** put reusable lists or helpers in sibling modules (e.g. `global-constructors.ts`, `appsync-globals.ts`) rather than duplicating across rules.
- **Minimize scope:** one rule per AppSync restriction; avoid unrelated refactors in the same change.
- **Comments:** only where behavior is non-obvious (allowlists, scope walking, AWS parity notes).

## Issue tracking

GitHub Issues track work for this repo.

## References

- [Writing Oxlint JS plugins](https://oxc.rs/docs/guide/usage/linter/writing-js-plugins.html)
- [AWS AppSync supported runtime features](https://docs.aws.amazon.com/appsync/latest/devguide/supported-features.html)
