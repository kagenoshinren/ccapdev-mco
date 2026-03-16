import type { Config } from "stylelint";

export default {
  extends: ["stylelint-config-standard-scss", "stylelint-config-css-modules"],

  ignoreFiles: ["dist/**", "node_modules/**"],

  rules: {
    /** Unknown */
    "at-rule-no-unknown": null,

    /** Pattern */
    "selector-class-pattern": null,

    /** @-mixin */
    "scss/at-mixin-pattern": null,

    /** @-rule */
    "scss/at-rule-no-unknown": true,

    /** General / Sheet */
    "scss/no-duplicate-mixins": null,
    "scss/no-global-function-names": null,
  },
} satisfies Config;
