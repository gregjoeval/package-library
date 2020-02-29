# @gjv/eslint-config

This package provides gjv-dev's base JS .eslintrc (without React plugins) as an extensible shared config.

Inspired by [Airbnb's Javascript Styleguide](https://github.com/airbnb/javascript)

## Usage

### @gjv/eslint-config

Our default export contains all of our ESLint rules, including ECMAScript 6+.
It requires `eslint`, `eslint-config-airbnb-base`, `eslint-plugin-import`, `eslint-plugin-import-helpers`, and `eslint-plugin-promise`.

1. Install the correct versions of each package, which are listed by the command:

  ```sh
  npm info "@gjv/eslint-config" peerDependencies
  ```

  If using **npm 5+**, use this shortcut

  ```sh
  npx install-peerdeps --dev @gjv/eslint-config
  ```

2. Add `"extends": "@gjv/eslint-config"` to your .eslintrc.
