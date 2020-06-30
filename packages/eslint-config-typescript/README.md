# @gjv/eslint-config-typescript

[![npm version](https://badgen.net/npm/v/@gjv/eslint-config-typescript)](https://www.npmjs.com/package/@gjv/eslint-config-typescript)
[![install size](https://badgen.net/packagephobia/install/@gjv/eslint-config-typescript)](https://packagephobia.com/result?p=%40gjv%2Feslint-config-typescript)
[![publish size](https://badgen.net/packagephobia/publish/@gjv/eslint-config-typescript)](https://packagephobia.com/result?p=%40gjv%2Feslint-config-typescript)

This package provides gjv-dev's base TS .eslintrc (without React plugins) as an extensible shared config.

Inspired by [Airbnb's Javascript Styleguide](https://github.com/airbnb/javascript)

## Usage

Our default export contains all of our ESLint rules, including ECMAScript 6+.

1. Install the correct versions of each peer dependency, which are listed by the command:

  ```sh
  npm info "@gjv/eslint-config-typescript" peerDependencies
  ```

  If using **npm 5+**, use this shortcut

  ```sh
  npx install-peerdeps --dev @gjv/eslint-config-typescript
  ```

2. Add `"extends": "@gjv/eslint-config-typescript"` to your .eslintrc.
