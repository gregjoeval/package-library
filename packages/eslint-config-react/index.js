/*

gregjoeval ESLint config

ESLint Rule Documentation: https://eslint.org/docs/rules/
AirBnB Javascript Style Guide: https://github.com/airbnb/javascript
Tool for comparing configs: https://sqren.github.io/eslint-compare/

*/

module.exports = {
    // extended configs should be ordered by least to greatest importance
    "extends": [
        "react-app",
        "airbnb/hooks",
        "airbnb",
        "plugin:react/recommended",
        "@gjv/eslint-config"
    ],
    "rules": {
        // React Plugin (https://github.com/yannickcr/eslint-plugin-react)
        "react/no-array-index-key": "off", // TODO: if we turn this on we need an new pattern for populating the key prop when rendering lists of constant values
        "react/no-unused-prop-types": "error",
        "react/prop-types": "off", // typescript does this for us
        "react/display-name": "off",
        "react/require-default-props": "off", // this rule expects us to use .defaultProps, but we dont
        "react/jsx-boolean-value": ["error", "always"],
        "react/jsx-curly-brace-presence": ["error", {
            "props": "always",
            "children": "ignore" // cannot enforce "never" for components and "always" for expressions
        }],
        "react/jsx-curly-newline": ["error", "consistent"],
        "react/jsx-filename-extension": ["error", { "extensions": [".tsx", ".jsx"] }],
        "react/jsx-fragments": ["error", "element"],
        "react/jsx-indent": "off", // turned off for consistent indenting, falls back to eslint's indent rule
        "react/jsx-indent-props": "off", // turned off for consistent indenting, falls back to eslint's indent rule
        "react/jsx-max-props-per-line": ["error", {
            "maximum": 1,
            "when": "always"
        }],
        "react/jsx-props-no-spreading": "off",
        "react/jsx-sort-props": ["warn", {
            "shorthandFirst": true,
            "callbacksLast": true
        }]
    }
};
