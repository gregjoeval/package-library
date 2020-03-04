/*

gregjoeval ESLint config

ESLint Rule Documentation: https://eslint.org/docs/rules/
AirBnB Javascript Style Guide: https://github.com/airbnb/javascript
Tool for comparing configs: https://sqren.github.io/eslint-compare/

*/

module.exports = {
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
    // extended configs should be ordered by least to greatest importance
    "extends": [
        "react-app",
        "eslint:recommended",
        "airbnb/hooks",
        "airbnb"
    ],
    "plugins": [
        "promise",
        "import-helpers"
    ],
    "rules": {
        "linebreak-style": ["error", "unix"],
        "eol-last": ["error", "always"],
        "indent": ["error", 4, { "SwitchCase": 1 }],
        "brace-style": ["error", "1tbs"],
        "semi": ["error", "always"],
        "comma-dangle": ["error", "never"],
        "max-len": ["error", {
            "code": 225,
            "ignoreUrls": true,
            "ignoreComments": false,
            "ignoreRegExpLiterals": true,
            "ignoreStrings": true,
            "ignoreTemplateLiterals": true
        }],
        "no-case-declarations": "off",
        "no-multiple-empty-lines": ["error", { "max": 1 }],
        "no-param-reassign": "error",
        "no-underscore-dangle": "error",
        "no-undefined": "error",
        "no-extra-parens": ["error", "all", {
            "nestedBinaryExpressions": false,
            "ignoreJSX": "all",
            "enforceForArrowConditionals": false,
            "enforceForNewInMemberExpressions": false
        }],
        "lines-between-class-members": ["error", "always"],
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
        "quotes": ["error", "single", {
            "avoidEscape": false,
            "allowTemplateLiterals": false
        }],
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
        "import/no-cycle": ["error", { "maxDepth": 2 }],
        "import/first": "error",
        "import/extensions": ["error", "ignorePackages", {
            "js": "never",
            "jsx": "never",
            "ts": "never",
            "tsx": "never"
        }],

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
