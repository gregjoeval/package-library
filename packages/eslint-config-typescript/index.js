/*

gregjoeval ESLint config

ESLint Rule Documentation: https://eslint.org/docs/rules/
AirBnB Javascript Style Guide: https://github.com/airbnb/javascript
Tool for comparing configs: https://sqren.github.io/eslint-compare/
Typescript ESLint: https://github.com/typescript-eslint/typescript-eslint

*/

module.exports = {
    "parser": "@typescript-eslint/parser",
    // extended configs should be ordered by least to greatest importance
    "extends": [
        "plugin:import/typescript",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
        "@gjv/eslint-config"
    ],
    "rules": {
        // Typescript Plugin (https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin)
        "@typescript-eslint/interface-name-prefix": ["error", {
            "prefixWithI": "always",
            "allowUnderscorePrefix": false
        }]
    }
};
