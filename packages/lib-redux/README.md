# `lib-redux`

[![npm version](https://badgen.net/npm/v/@gjv/lib-redux)](https://www.npmjs.com/package/@gjv/lib-redux)
[![types](https://badgen.net/npm/types/@gjv/lib-redux)](https://www.npmjs.com/package/@gjv/lib-redux)
[![install size](https://badgen.net/packagephobia/install/@gjv/lib-redux)](https://packagephobia.com/result?p=%40gjv%2Flib-redux)
[![publish size](https://badgen.net/packagephobia/publish/@gjv/lib-redux)](https://packagephobia.com/result?p=%40gjv%2Flib-redux)

> Library of shared code for use with Redux

## What is a slice?
Very similar to the [Ducks](https://github.com/erikras/ducks-modular-redux) and [Ducks++](https://github.com/dhassaine/ducks-modular-redux) proposals, a slice is a bundle of everything associated to a piece of state (i.e. `{ name, reducer, actions, selectors }`)

the `name` describes the domain the slice is responsible for, 

the `reducer` manages data interactions within state,

the `actions` surface an api of dispatch-able functions to interact with the reducer, and
 
the `selectors` expose memoized functions to read data from global state.

## Higher Order Slices
[createModelSlice](src/higher-order-slices/create-model-slice/CreateModelSlice.md)
creates a slice for a single data model (e.g. a user profile)

[createEntitySlice](src/higher-order-slices/create-entity-slice/CreateEntitySlice.md)
create a slice for a collection of entities (e.g. multiple user profiles)
