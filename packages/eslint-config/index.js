/*

jovial-dev ESLint config

ESLint Rule Documentation: https://eslint.org/docs/rules/
AirBnB Javascript Style Guide: https://github.com/airbnb/javascript
Tool for comparing configs: https://sqren.github.io/eslint-compare/

*/

module.exports = {
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": 'module'
    },
    // extended configs should be ordered by least to greatest importance
    "extends": [
        "eslint:recommended",
        "airbnb-base"
    ],
    "plugins": [
        "promise",
        "import-helpers"
    ],
    "rules": {
        "linebreak-style": ["error", "windows"],
        "eol-last": ["error", "always"],
        "indent": ["error", 4, { "SwitchCase": 1 }],
        "max-len": ["error", {
            "code": 225,
            "ignoreUrls": true,
            "ignoreComments": false,
            "ignoreRegExpLiterals": true,
            "ignoreStrings": true,
            "ignoreTemplateLiterals": true
        }], // extended from airbnb TODO: determine if this is necessary after trying prettier
        "function-paren-newline": "off",
        "multiline-ternary": ["error", "always-multiline"],
        "no-case-declarations": "off",
        "no-multiple-empty-lines": ["error", { "max": 1 }],
        "no-param-reassign": "error",
        "no-use-before-define": "off",
        "no-underscore-dangle": "error",
        "prefer-destructuring": "off",
        "object-curly-newline": ["error", { "consistent": true }],
        "object-shorthand": ["error", "consistent"], // TODO: revisit, made this consistent for now
        "comma-dangle": ["error", "never"],
        "lines-between-class-members": ["error", "always"],
        "implicit-arrow-linebreak": ["error", "beside"],
        "no-extra-parens": ["error", "all", {
            "nestedBinaryExpressions": false,
            "ignoreJSX": "all",
            "enforceForArrowConditionals": false,
            "enforceForNewInMemberExpressions": false
        }],
        "quotes": ["error", "single", {
            "avoidEscape": true,
            "allowTemplateLiterals": false
        }],
        "jsx-quotes": ["error", "prefer-single"], // TODO: revisit, decide if we want to use single or double quotes everywhere
        "no-undefined": "error",

        // Import Plugin (https://github.com/benmosher/eslint-plugin-import)
        "import/prefer-default-export": "off",
        "import/no-named-default": "off",
        "import/no-duplicates": "error",
        "import/newline-after-import": "error",
        "import/no-useless-path-segments": "error",
        "import/no-named-as-default": "off",
        "import/no-unresolved": [2, {"caseSensitive": true}],
        "import/no-unused-modules": ["off", { "unusedExports": true }], // keep turned off since it takes a long time to run, turn on only when checking for this rule
        "import/no-cycle": ["error", { "maxDepth": 2 }],
        "import/order": "off", // turned off in favor of import-helpers/order-imports

        // Import Helpers Plugin (https://github.com/Tibfib/eslint-plugin-import-helpers)
        "import-helpers/order-imports": ["error", {
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
        "promise/prefer-await-to-callbacks": "off" // using callbacks for thunks since those cannot be awaited
    }
};
