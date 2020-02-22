/*

jovial-dev ESLint config

ESLint Rule Documentation: https://eslint.org/docs/rules/
AirBnB Javascript Style Guide: https://github.com/airbnb/javascript
Tool for comparing configs: https://sqren.github.io/eslint-compare/
Typescript ESLint: https://github.com/typescript-eslint/typescript-eslint

*/

module.exports = {
    // https://stackoverflow.com/a/56696478/7571132
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
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "project": "./tsconfig.json"
    },
    // extended configs should be ordered by least to greatest importance
    "extends": [
        "plugin:import/typescript",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
        "@jovial-dev/eslint-config"
    ],
    "rules": {
        // Typescript Plugin (https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin)
        "@typescript-eslint/interface-name-prefix": ["error", { "prefixWithI": "always", "allowUnderscorePrefix": false }]
    }
};
