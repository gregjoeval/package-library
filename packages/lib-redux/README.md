# `lib-redux`

[![npm version](https://badgen.net/npm/v/@gjv/lib-redux)](https://www.npmjs.com/package/@gjv/lib-redux)
[![types](https://badgen.net/npm/types/@gjv/lib-redux)](https://www.npmjs.com/package/@gjv/lib-redux)
[![install size](https://badgen.net/packagephobia/install/@gjv/lib-redux)](https://packagephobia.com/result?p=%40gjv%2Flib-redux)
[![publish size](https://badgen.net/packagephobia/publish/@gjv/lib-redux)](https://packagephobia.com/result?p=%40gjv%2Flib-redux)

> Library of shared code for use with Redux

## Install
Install from the NPM registry using npm, yarn, or pnpm:
```shell
npm install @gjv/lib-redux

yarn add @gjv/lib-redux

pnpm add @gjv/lib-redux
```

## Purpose
To provide generic factory methods for common slice data structures.

## Higher Order Slices
`createModelSlice()` creates a slice for a single model. <br>
Here's an [example](docs/CreateModelSlice.md) with a slice for a user profile slice.

`createEntitySlice()` creates a slice for a collection of entities. <br>
Here's an [example](docs/CreateEntitySlice.md) with a slice for multiple user profiles.

## What is a Higher Order Slice?
A function that returns a slice responsible for interacting with one or more models/entities in a data structure specific to that function.

## What is a slice?
Very similar to the [Ducks](https://github.com/erikras/ducks-modular-redux) and [Ducks++](https://github.com/dhassaine/ducks-modular-redux) proposals, a slice is a bundle of everything associated to a piece of state (i.e. `{ name, reducer, actions, selectors }`)

the `name` describes the domain the slice is responsible for, 

the `reducer` manages data interactions between state and actions,

the `actions` surface an api of dispatch-able functions to interact with the reducer, and
 
the `selectors` expose memoized functions to read data from global state.

#### Where are the `action types`?
Since these higher order slices use on [createSlice](https://redux-toolkit.js.org/api/createSlice#examples) from `@reduxjs/toolkit` you can get the action type by accessing the action function without calling it:

```typescript
const { actions } = createModelSlice('MyModelSliceName', ...)
console.log(`${actions.update}`)
// -> "MyModelSliceName/update
```

