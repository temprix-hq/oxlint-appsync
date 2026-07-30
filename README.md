# oxlint-appsync

Oxlint (and ESLint-compatible) plugin that enforces [AWS AppSync JavaScript runtime restrictions](https://docs.aws.amazon.com/appsync/latest/devguide/supported-features.html).

Use it to catch unsupported syntax in AppSync resolver code before deployment. See [docs/code-generation-appsync.md](docs/code-generation-appsync.md) for the project-specific summary of limitations.

## Install

```bash
npm install -D oxlint oxlint-appsync
```

`oxlint-appsync` depends on `@oxlint/plugins` at runtime.

## Usage with Oxlint

### `.oxlintrc.json`

Copy [oxlintrc.example.json](oxlintrc.example.json) to `.oxlintrc.json` in your project:

### `oxlint.config.ts`

```ts
import { defineConfig } from "oxlint";
import plugin, { portable, recommended } from "oxlint-appsync";

export default defineConfig({
  jsPlugins: [plugin],
  rules: recommended,
  overrides: [
    {
      files: ["src/shared/**/*.js"],
      rules: portable,
    },
  ],
});
```

Run:

```bash
npx oxlint path/to/appsync
```

## Usage with ESLint

The plugin uses Oxlint's `createOnce` API wrapped with `eslintCompatPlugin`, so it also works with ESLint:

```js
import appsync from "oxlint-appsync";
import { portable, recommended } from "oxlint-appsync";

export default [
  {
    plugins: { appsync },
    rules: recommended,
  },
  {
    files: ["src/shared/**/*.js"],
    rules: portable,
  },
];
```

## Config presets

| Preset        | Use for                                                                                                           |
| ------------- | ----------------------------------------------------------------------------------------------------------------- |
| `recommended` | AppSync resolver entry points — all syntax rules enabled                                                          |
| `portable`    | Shared modules that must run in AppSync and other runtimes (e.g. Lambda) — syntax rules plus `no-appsync-globals` |

## Rules

| Rule                            | Description                                                                                      |
| ------------------------------- | ------------------------------------------------------------------------------------------------ |
| `appsync/no-global-constructor` | Disallow global constructor calls (`String()`, `Number()`, `Boolean()`, `Date()`, etc.)          |
| `appsync/no-async-await`        | Disallow `async`/`await` and async functions                                                     |
| `appsync/no-classes`            | Disallow `class` declarations and expressions                                                    |
| `appsync/no-instanceof`         | Disallow `instanceof`                                                                            |
| `appsync/no-for-loop`           | Disallow C-style `for` loops (`for-in` / `for-of` allowed)                                       |
| `appsync/no-while`              | Disallow `while` loops                                                                           |
| `appsync/no-do-while`           | Disallow `do-while` loops                                                                        |
| `appsync/no-try`                | Disallow `try`/`catch`/`finally`                                                                 |
| `appsync/no-throw`              | Disallow `throw`                                                                                 |
| `appsync/no-continue`           | Disallow `continue`                                                                              |
| `appsync/no-labeled-statement`  | Disallow labeled statements                                                                      |
| `appsync/no-new`                | Disallow the `new` operator                                                                      |
| `appsync/no-generators`         | Disallow generator functions                                                                     |
| `appsync/no-this`               | Disallow `this`                                                                                  |
| `appsync/no-update-operators`   | Disallow `++` and `--`                                                                           |
| `appsync/no-bitwise-not`        | Disallow bitwise NOT (`~`)                                                                       |
| `appsync/no-in-operator`        | Disallow `in` (use `Object.hasOwn`)                                                              |
| `appsync/no-function-arguments` | Disallow passing function references as call arguments (inline arrow callbacks are allowed)      |
| `appsync/no-appsync-globals`    | Disallow AppSync-only globals (`util`, `extensions`, `runtime`) — opt-in, included in `portable` |

## Migration

### 0.1.x → 0.2.0

`appsync/no-string-constructor` was removed. Use `appsync/no-global-constructor` instead — it covers `String()` and other global constructor calls (`Boolean()`, `Number()`, `Date()`, etc.).

## Development

```bash
npm install
npm run build
npm test
```

## References

- [Writing Oxlint JS plugins](https://oxc.rs/docs/guide/usage/linter/writing-js-plugins.html)
- [AWS AppSync supported runtime features](https://docs.aws.amazon.com/appsync/latest/devguide/supported-features.html)
- [Project AppSync code generation rules](docs/code-generation-appsync.md)

## License

MIT
