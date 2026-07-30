import noAppsyncGlobals from "./no-appsync-globals.js";
import noAsyncAwait from "./no-async-await.js";
import noBitwiseNot from "./no-bitwise-not.js";
import noClasses from "./no-classes.js";
import noContinue from "./no-continue.js";
import noDoWhile from "./no-do-while.js";
import noForLoop from "./no-for-loop.js";
import noFunctionArguments from "./no-function-arguments.js";
import noGenerators from "./no-generators.js";
import noGlobalConstructor from "./no-global-constructor.js";
import noInOperator from "./no-in-operator.js";
import noInstanceof from "./no-instanceof.js";
import noLabeledStatement from "./no-labeled-statement.js";
import noNew from "./no-new.js";
import noThis from "./no-this.js";
import noThrow from "./no-throw.js";
import noTry from "./no-try.js";
import noUpdateOperators from "./no-update-operators.js";
import noWhile from "./no-while.js";
import type { AppsyncRuleModule } from "./types.js";

const rules = {
  "no-appsync-globals": noAppsyncGlobals,
  "no-async-await": noAsyncAwait,
  "no-bitwise-not": noBitwiseNot,
  "no-classes": noClasses,
  "no-continue": noContinue,
  "no-do-while": noDoWhile,
  "no-for-loop": noForLoop,
  "no-function-arguments": noFunctionArguments,
  "no-generators": noGenerators,
  "no-in-operator": noInOperator,
  "no-instanceof": noInstanceof,
  "no-labeled-statement": noLabeledStatement,
  "no-new": noNew,
  "no-global-constructor": noGlobalConstructor,
  "no-this": noThis,
  "no-throw": noThrow,
  "no-try": noTry,
  "no-update-operators": noUpdateOperators,
  "no-while": noWhile,
} satisfies Record<string, AppsyncRuleModule>;

export type AppsyncRuleName = keyof typeof rules;

export default rules;
