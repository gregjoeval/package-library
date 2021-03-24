/*

gregjoeval ESLint config

ESLint Rule Documentation: https://eslint.org/docs/rules/
AirBnB Javascript Style Guide: https://github.com/airbnb/javascript
Tool for comparing configs: https://sqren.github.io/eslint-compare/
Typescript ESLint: https://github.com/typescript-eslint/typescript-eslint

off: don't care or overriding rule config from plugin
warn: dont do this; writing code this way is not accepted but shouldn't prevent you from writing code during development
error: dont do this; writing code this way is not accepted; if you must break the rule you should use @ts-expect-error and provide a reason

*/

module.exports = {
    "parser": "@typescript-eslint/parser",
    "plugins": [
        "@typescript-eslint",
        "promise",
        "import-helpers"
    ],
    // extended configs should be ordered by least to greatest importance
    "extends": [
        "plugin:import/typescript",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
        "airbnb-base"
    ],
    // https://stackoverflow.com/a/58323590/7571132
    "settings": {
        "import/resolver": {
            "node": {
                "extensions": [
                    ".ts",
                    ".tsx",
                    ".js",
                    ".jsx"
                ]
            }
        }
    },
    "rules": {
        // Rules that cause issues between eslint and @typescript-eslint (https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin/docs/rules)
        "brace-style": "off",
        "comma-dangle": "off",
        "comma-spacing": "off",
        "default-param-last": "off",
        "dot-notation": "off",
        "func-call-spacing": "off",
        "indent": "off", // https://github.com/typescript-eslint/typescript-eslint/issues/1824
        "init-declarations": "off",
        "keyword-spacing": "off",
        "lines-between-class-members": "off",
        "no-array-constructor": "off",
        "no-dupe-class-members": "off",
        "no-duplicate-imports": "off",
        "no-empty-function": "off",
        "no-extra-parens": "off",
        "no-extra-semi": "off",
        "no-invalid-this": "off",
        "no-loop-func": "off",
        "no-loss-of-precision": "off",
        "no-magic-numbers": "off",
        "no-redeclare": "off",
        "no-shadow": "off",
        "no-throw-literal": "off",
        "no-unused-expressions": "off",
        "no-unused-vars": "off",
        "no-use-before-define": "off", // https://github.com/typescript-eslint/typescript-eslint/issues/1856
        "no-useless-constructor": "off",
        "object-curly-spacing": "off",
        "quotes": "off",
        "require-await": "off",
        "no-return-await": "off", // return-await
        "semi": "off",
        "space-before-function-paren": "off",
        "space-infix-ops": "off",

        // ESLint (https://eslint.org/docs/rules/)
        "spaced-comment": "warn",
        "linebreak-style": ["off", "unix"],
        "eol-last": ["error", "always"],
        "max-len": ["error", {
            "code": 225,
            "ignoreComments": false,
            "ignoreRegExpLiterals": true,
            "ignoreStrings": true,
            "ignoreTemplateLiterals": true,
            "ignoreUrls": true
        }],
        "no-case-declarations": "off",
        "no-console": "warn",
        "no-debugger": "warn",
        "no-multiple-empty-lines": ["warn", { "max": 1 }],
        "no-param-reassign": "error",
        "no-underscore-dangle": "error",
        "no-undefined": "warn",
        "multiline-ternary": ["error", "always-multiline"],
        "prefer-destructuring": "off",
        "object-shorthand": ["error", "consistent"],
        "object-property-newline": ["error", { "allowAllPropertiesOnSameLine": false }],
        "object-curly-newline": ["error", {
            "ObjectExpression": {
                "consistent": true,
                "multiline": true,
                "minProperties": 2
            },
            "ObjectPattern": {
                "consistent": true,
                "multiline": true
            },
            "ImportDeclaration": {
                "consistent": true,
                "multiline": true
            },
            "ExportDeclaration": {
                "consistent": true,
                "multiline": true
            }
        }],
        "function-paren-newline": ["error", "multiline"],
        "implicit-arrow-linebreak": ["error", "beside"],
        "jsx-quotes": ["error", "prefer-single"],

        // Import Plugin (https://github.com/benmosher/eslint-plugin-import)
        "import/prefer-default-export": "off",
        "import/no-named-default": "off",
        "import/no-named-as-default": "off",
        "import/exports-last": "off",
        "import/group-exports": "off",
        "import/order": "off", // turned off in favor of import-helpers/order-imports
        "import/no-unused-modules": ["off", { "unusedExports": true }], // keep turned off since it takes a long time to run, turn on only when checking for this rule
        "import/no-duplicates": "error",
        "import/newline-after-import": "error",
        "import/no-useless-path-segments": "error",
        "import/no-cycle": ["off", { "maxDepth": 2 }], // turning this off for now but should consider turning it on
        "import/first": "error",
        "import/extensions": ["error", "ignorePackages", {
            "js": "never",
            "jsx": "never",
            "ts": "never",
            "tsx": "never"
        }],
        "import/no-extraneous-dependencies": ["error", { "devDependencies": ["**/*.test.*", "**/*.d.*", "**/setupTests.ts", "**/*.stories.*"] }],

        // Import Helpers Plugin (https://github.com/Tibfib/eslint-plugin-import-helpers)
        "import-helpers/order-imports": ["warn", {
            "newlinesBetween": "never",
            "groups": ["absolute", "module", "parent", "sibling", "index"],
            "alphabetize": { "order": "asc" }
        }],

        // Promise Plugin (https://github.com/xjamundx/eslint-plugin-promise)
        "promise/catch-or-return": "error",
        "promise/no-return-wrap": "error",
        "promise/param-names": "error",
        "promise/always-return": "error",
        "promise/no-native": "off",
        "promise/no-nesting": "error",
        "promise/no-promise-in-callback": "error",
        "promise/no-callback-in-promise": "error",
        "promise/avoid-new": "error",
        "promise/no-new-statics": "error",
        "promise/no-return-in-finally": "error",
        "promise/valid-params": "error",
        "promise/prefer-await-to-then": "error",
        "promise/prefer-await-to-callbacks": "off", // using callbacks for thunks since those cannot be awaited

        // Typescript Plugin (https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin)
        "@typescript-eslint/brace-style": "error",
        "@typescript-eslint/comma-dangle": ["warn", {
            "arrays": "always-multiline",
            "objects": "always-multiline",
            "imports": "always-multiline",
            "exports": "always-multiline",
            "functions": "never", // parameters are positional and should not be easily re-arranged
            "enums": "always-multiline",
            "generics": "ignore", // in a .tsx file you need to do <T,> for generics so that it is not confused with jsx
            "tuples": "always-multiline"
        }],
        "@typescript-eslint/indent": ["error", 4, { "SwitchCase": 1 }],
        "@typescript-eslint/no-empty-function": "warn",
        "@typescript-eslint/no-extra-parens": ["warn", "all", {
            "nestedBinaryExpressions": false,
            "ignoreJSX": "all",
            "enforceForArrowConditionals": false,
            "enforceForNewInMemberExpressions": false
        }],
        "@typescript-eslint/no-unused-vars": "warn",
        "@typescript-eslint/lines-between-class-members": ["warn", "always"],
        "@typescript-eslint/quotes": ["error", "single", {
            "avoidEscape": false,
            "allowTemplateLiterals": false
        }],
        "@typescript-eslint/semi": ["warn", "never"],
        "@typescript-eslint/explicit-function-return-type": ["error", {
            "allowExpressions": true,
            "allowTypedFunctionExpressions": true,
            "allowHigherOrderFunctions": true
        }],
        "@typescript-eslint/naming-convention": ["error",
            {
                "selector": "interface",
                "format": ["PascalCase"],
                "custom": {
                    "regex": "^I[A-Z]",
                    "match": true
                }
            }
        ],
        "@typescript-eslint/interface-name-prefix": "off", // off in favor of @typescript-eslint/naming-convention
        "@typescript-eslint/promise-function-async": "error",
        "@typescript-eslint/type-annotation-spacing": "warn",
        "@typescript-eslint/object-curly-spacing": ["warn", "always"],
        "@typescript-eslint/no-implicit-any-catch": "warn",
        "@typescript-eslint/consistent-type-assertions": "warn", // https://basarat.gitbook.io/typescript/type-system/type-assertion#as-foo-vs-less-than-foo-greater-than
        "@typescript-eslint/no-dynamic-delete": "error",
        "@typescript-eslint/prefer-ts-expect-error": "error",
        "@typescript-eslint/require-array-sort-compare": "error",
        "@typescript-eslint/default-param-last": "error"
    }
}
