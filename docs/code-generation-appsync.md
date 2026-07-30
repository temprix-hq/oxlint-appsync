# Appsync code generation rules

## Restrictions

Make sure the following rules are followed:

- Do not use global constructor calls such as `String()`, `Boolean()`, `Number()`, `Date()`, `Object()`, `Array()`, or `Function()`. Use literals, supported static methods (e.g. `Number.isFinite`), or AppSync utilities instead.
- No promises, or async/await.
- No classes or `instanceof`.
- Only `for-in` and `for-of` loops are supported. Do not use `for`, `while` or `do-while`.
- These statements are not supported: 'catch', 'continue', `finally`, `throw`, `try`, labeled statements.
- No passing of functions as arguments.
- Do not use "new" keyword.
- No generators.
- No `this`.
- No `try`.
- These operators are not allowed: `++`, `--`, `~`.
- `in` operator is not supported. Use `Object.hasOwn` to check if the specified property is in the specified object.

## Portable shared code

Use the `portable` preset from `oxlint-appsync` for modules shared between AppSync resolvers and other runtimes (e.g. Lambda). It enables all syntax rules plus `no-appsync-globals`, which forbids references to AppSync-only globals:

- `util` — encoding, IDs, errors, auth, time, and string helpers
- `extensions` — AppSync extensions API
- `runtime` — flow control such as `runtime.earlyReturn()`

Resolver entry points should use `recommended` instead so `util.error()` and similar APIs remain available.

## Supported runtime features

[More information in AWS Docs](https://docs.aws.amazon.com/appsync/latest/devguide/supported-features.html)

### Core features

- **Types**: numbers, strings, booleans, objects, arrays, functions.
- **Operators**:
  - standard math operators (`_`, `-`, `/`, `%`, `*`, etc).
  - Nullish coalescing operator (`??`).
  - Optional chaining (`?.`).
  - Bitwise operators.
  - `void` and `typeof` operators.
  - Spread operators (`...`).
- **Statements**: `const`, `let`, `var`, `break`, `else`, `for-in`, `for-of`, `if`, `return`, `switch`, spread syntax.
- _Literals_: multi-line strings, expression interpolation, nesting templates.
- **Functions**: Function declarations, ES6 arrow functions, ES6 rest parameter syntax.
- **Strict mode**: enabled by default, no need to specify `use_strict` explicitly.

### Primitive objects

- **Object**: `Object.assign()`, `Object.entries()`, `Object.hasOwn()`, `Object.keys()`, `Object.values()`, `delete`.
- **String**: `String.prototype.length()`, `String.prototype.charAt()`, `String.prototype.concat()`, `String.prototype.endsWith()`, `String.prototype.indexOf()`, `String.prototype.lastIndexOf()`, `String.raw()`, `String.prototype.replace()`. `String.prototype.replaceAll()`, `String.prototype.slice()`, `String.prototype.split()`, `String.prototype.startsWith()`, `String.prototype.toLowerCase()`, `String.prototype.toUpperCase()`, `String.prototype.trim()`, `String.prototype.trimEnd()`, `String.prototype.trimStart()`.
- **Number**: `Number.isFinite`, `Number.isNaN`.

Note: for `String.prototype.replace()` and `String.prototype.replaceAll()` - regular expressions are not supported. However, Java-styled regular expression constructs are supported in the provided parameter. For more information see [Pattern](https://docs.oracle.com/javase/8/docs/api/java/util/regex/Pattern.html).

### Built-in objects and functions

- **Math**: `Math.random()`, `Math.min()`, `Math.max()`, `Math.round()`, `Math.floor()`, `Math.ceil()`.
- **Array**:
  - Array.prototype.: `length`, `concat`, `fill`, `flat`, `indexOf`, `join`, `lastIndexOf`, `pop`, `push`, `reverse`, `shift`, `slice`, `sort` (without any arguments), `splice`, `unshift`, `forEach`, `map`, `flatMap`, `filter`, `reduce`, `reduceRight`, `find`, `some`, `every`, `findIndex`, `findLast`, `findLastIndex`.
  - `delete`
- **Console**: `console.error()`, `console.log()`.
- **Function**:
  - The `apply`, `bind`, and `call` methods not are supported.
  - Function constructors are not supported.
  - Passing a function as an argument is not supported.
  - Recursive function calls are not supported.
- **JSON**: `JSON.parse()` (returns a blank string if the parsed string is not valid JSON), `JSON.stringify()`.

### Globals

These are supported: `NaN`, `Infinity`, `undefined`, `util`, `extensions`, `runtime`.

## Built-in utilities

[More information in AWS Documentation](https://docs.aws.amazon.com/appsync/latest/devguide/built-in-util-js.html)

### Encoding utils list

`util.urlEncode(String)`
Returns the input string as an application/x-www-form-urlencoded encoded string.

`util.urlDecode(String)`
Decodes an application/x-www-form-urlencoded encoded string back to its non-encoded form.

`util.base64Encode(string): string`
Encodes the input into a base64-encoded string.

`util.base64Decode(string): string`
Decodes the data from a base64-encoded string.

### ID generation utils

`util.autoId()`
Returns a 128-bit randomly generated UUID.

`util.autoUlid()`
Returns a 128-bit randomly generated ULID (Universally Unique Lexicographically Sortable Identifier).

`util.autoKsuid()`
Returns a 128-bit randomly generated KSUID (K-Sortable Unique Identifier) base62 encoded as a String with a length of 27.

### Error utils

`util.error(String, String?, Object?, Object?)`
Throws a custom error. This can be used in request or response mapping templates if the template detects an error with the request or with the invocation result. Additionally, an errorType field, a data field, and an errorInfo field can be specified. The data value will be added to the corresponding error block inside errors in the GraphQL response.

**Note:** data will be filtered based on the query selection set. The errorInfo value will be added to the corresponding error block inside errors in the GraphQL response. `errorInfo` will not be filtered based on the query selection set.

`util.appendError(String, String?, Object?, Object?)`
Appends a custom error. This can be used in request or response mapping templates if the template detects an error with the request or with the invocation result. Additionally, an errorType field, a data field, and an errorInfo field can be specified. Unlike util.error(String, String?, Object?, Object?), the template evaluation will not be interrupted, so that data can be returned to the caller. The data value will be added to the corresponding error block inside errors in the GraphQL response.

**Note:**: data will be filtered based on the query selection set. The errorInfo value will be added to the corresponding error block inside errors in the GraphQL response. `errorInfo` will not be filtered based on the query selection set.

### Type and pattern matching utils list

`util.matches(String, String) : Boolean`
Returns true if the specified pattern in the first argument matches the supplied data in the second argument. The pattern must be a regular expression such as `util.matches("a*b", "aaaaab")`. The functionality is based on [Pattern](https://docs.oracle.com/javase/8/docs/api/java/util/regex/Pattern.html)., which you can reference for further documentation.

`util.authType()`
Returns a String describing the multi-auth type being used by a request, returning back either "IAM Authorization", "User Pool Authorization", "Open ID Connect Authorization", or "API Key Authorization".

### Return value behavior utils

`util.escapeJavaScript(String)`
Returns the input string as a JavaScript escaped string.

### Resolver authorization utils

`util.unauthorized()`
Throws Unauthorized for the field being resolved. Use this in request or response mapping templates to determine whether to allow the caller to resolve the field.

## Runtime utilities

[More information in AWS Documentation](https://docs.aws.amazon.com/appsync/latest/devguide/runtime-utils-js.html)

`runtime.earlyReturn(obj?: unknown, returnOptions?: {skipTo: 'END' | 'NEXT'}): never`

Invoking this function will halt the execution of the current handler, AWS AppSync function or resolver (Unit or Pipeline Resolver) depending on the current context. The specified object is returned as the result.

## Time helpers in `util.time`

The util.time variable contains datetime methods to help generate timestamps, convert between datetime formats, and parse datetime strings. The syntax for datetime formats is based on [DateTimeFormatter](https://docs.oracle.com/javase/8/docs/api/java/time/format/DateTimeFormatter.html) which you can reference for further documentation.

`util.time.nowISO8601()`
Returns a String representation of UTC in ISO8601 format.

`util.time.nowEpochSeconds()`
Returns the number of seconds from the epoch of 1970-01-01T00:00:00Z to now.

`util.time.nowEpochMilliSeconds()`
Returns the number of milliseconds from the epoch of 1970-01-01T00:00:00Z to now.

`util.time.nowFormatted(String)`
Returns a string of the current timestamp in UTC using the specified format from a String input type.

`util.time.nowFormatted(String, String)`
Returns a string of the current timestamp for a timezone using the specified format and timezone from String input types.

`util.time.parseFormattedToEpochMilliSeconds(String, String)`
Parses a timestamp passed as a String along with a format containing a time zone, then returns the timestamp as milliseconds since epoch.

`util.time.parseFormattedToEpochMilliSeconds(String, String, String)`
Parses a timestamp passed as a String along with a format and time zone, then returns the timestamp as milliseconds since epoch.

`util.time.parseISO8601ToEpochMilliSeconds(String)`
Parses an ISO8601 timestamp passed as a String, then returns the timestamp as milliseconds since epoch.

`util.time.epochMilliSecondsToSeconds(long)`
Converts an epoch milliseconds timestamp to an epoch seconds timestamp.

`util.time.epochMilliSecondsToISO8601(long)`
Converts an epoch milliseconds timestamp to an ISO8601 timestamp.

`util.time.epochMilliSecondsToFormatted(long, String)`
Converts an epoch milliseconds timestamp, passed as long, to a timestamp formatted according to the supplied format in UTC.

`util.time.epochMilliSecondsToFormatted(long, String, String)`
Converts an epoch milliseconds timestamp, passed as a long, to a timestamp formatted according to the supplied format in the supplied timezone.

## String helpers in `util.str`

`util.str` contains methods to help with common String operations.

### util.str utils list

`util.str.normalize(String, String)`
Normalizes a string using one of the four unicode normalization forms: NFC, NFD, NFKC, or NFKD. The first argument is the string to normalize. The second argument is either "nfc", "nfd", "nfkc", or "nfkd" specifying the normalization type to use for the normalization process.
