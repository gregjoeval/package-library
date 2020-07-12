# `eslint-config`

[![npm version](https://badgen.net/npm/v/@gjv/eslint-config)](https://www.npmjs.com/package/@gjv/eslint-config)
[![install size](https://badgen.net/packagephobia/install/@gjv/eslint-config)](https://packagephobia.com/result?p=%40gjv%2Feslint-config)
[![publish size](https://badgen.net/packagephobia/publish/@gjv/eslint-config)](https://packagephobia.com/result?p=%40gjv%2Feslint-config)

This package provides gjv's base Javascript .eslintrc (without React plugins) as an extensible shared config.

Inspired by [Airbnb's Javascript Styleguide](https://github.com/airbnb/javascript)

## Usage

Our default export contains all of our ESLint rules, including ECMAScript 6+.

1. Install the correct versions of each peer dependency, which are listed by the command:

  ```sh
  npm info "@gjv/eslint-config" peerDependencies
  ```

  If using **npm 5+**, use this shortcut

  ```sh
  npx install-peerdeps --dev @gjv/eslint-config
  ```

2. Add `"extends": "@gjv/eslint-config"` to your .eslintrc.
