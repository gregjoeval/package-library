# `redux-slice-factory`

[![npm version](https://badgen.net/npm/v/@gjv/redux-slice-factory)](https://www.npmjs.com/package/@gjv/redux-slice-factory)
[![types](https://badgen.net/npm/types/@gjv/redux-slice-factory)](https://badgen.net/npm/types/@gjv/redux-slice-factory)
[![install size](https://badgen.net/packagephobia/install/@gjv/redux-slice-factory)](https://packagephobia.com/result?p=%40gjv%2Fredux-slice-factory)
[![publish size](https://badgen.net/packagephobia/publish/@gjv/redux-slice-factory)](https://packagephobia.com/result?p=%40gjv%2Fredux-slice-factory)

> A light-weight package with generic factory functions for common slice data structures

## Install
Install from the NPM registry using `npm`, `yarn`, or `pnpm`:
```shell
npm install @gjv/redux-slice-factory

yarn add @gjv/redux-slice-factory

pnpm add @gjv/redux-slice-factory
```

## What's the goal?
The goal of this package is to provide:
- familiar API inspired by [Redux Toolkit](https://redux-toolkit.js.org/)
- out-of-the-box best-practice interfaces for slice state models (e.g. [status enums vs boolean flags](https://kentcdodds.com/blog/stop-using-isloading-booleans))
- [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself), strongly-typed, generic factory functions for common slice data structures
- common set of actions and selectors shared by slices of the same data structure

## What's included?
- `createModelSlice()` creates a slice for a <b>single model</b>. <br>
Here's an [example](docs/CreateModelSlice.md) with a slice for a user profile.
- `createEntitySlice()` creates a slice for a <b>collection of entities</b>. <br>
Here's an [example](docs/CreateEntitySlice.md) with a slice for multiple user profiles.

## What's a slice?
Very similar to the [Ducks](https://github.com/erikras/ducks-modular-redux) and [Ducks++](https://github.com/dhassaine/ducks-modular-redux) proposals, a slice is a bundle of everything associated to a piece of state (i.e. `{ name, reducer, actions, selectors }`)

the `name` describes the domain the slice is responsible for, 

the `reducer` manages data interactions between state and actions,

the `actions` surface an api of dispatch-able functions to interact with the reducer, and
 
the `selectors` expose memoized functions to read data from global state.

#### Where are the `action types`?
Since these factory functions use `createSlice()` from [Redux Toolkit](https://redux-toolkit.js.org/), you can get the action type for any action creator by simply referencing the function without executing it:

```typescript
const { actions } = createModelSlice('MyModelSliceName', ...)
console.log(`${actions.update}`)
// -> "MyModelSliceName/update
```

## Show me the code
Fair enough. Here's a quick example. <br>
For a more extensive, real-world use case check out the [examples](#What's-included?) listed above.

```typescript
import { combineReducers, createStore } from 'redux';
import { createModelSlice, StatusEnum } from '@gjv/redux-slice-factory';

interface IUserModel {
    id: string;
    name: string;
    age: string;
}

const bob: IUserModel = {
    id: '456def',
    name: 'bobby',
    age: '30'
};

//
// STEP 1: create it
//
const { name, reducer, actions, selectors } = createModelSlice<GlobalStateType, IUserModel>({
    name: 'User',
    selectSliceState: (globalState) => globalState.user,
    initialState: bob
});

const userSlice = {
    name: name,
    reducer: reducer,
    actions: actions,
    selectors: selectors
}


//
// STEP 2: attach it
//
const reducers = combineReducers({
    user: userSlice.reducer
})

const store = createStore(reducers)


//
// STEP 3: use it
//

// initial state of state.user
/**
{
  "status": "Settled",
  "error": null,
  "lastModified": null,
  "lastHydrated": null,
  "model": {
    "id": "456def",
    "name": "bobby",
    "age": "30"
  }
}
**/

// update the slice state with a partial model
store.dispatch(userSlice.actions.update({ age: '26' }))
// state.user is now...
/**
{
  ...
  "lastModified": "2020-07-08T19:34:24-04:00",
  "model": {
    "id": "456def",
    "name": "bobby",
    "age": "26"
  }
}
**/

// set the slice state with a model
store.dispatch(userSlice.actions.set({
    id: '456def',
    name: 'bob',
    age: '30'
}));
// state.user is now...
/**
{
  ...
  "lastModified": "2020-07-08T19:35:23-04:00",
  "model": {
    "id": "456def",
    "name": "bob",
    "age": "30"
  }
}
**/

// set the slice state status enum
store.dispatch(userSlice.actions.setStatus(StatusEnum.Requesting))
// or
store.dispatch(userSlice.actions.setStatus('Requesting'))
// state.user is now...
/**
{
  ...
  "status": "Requesting",
}
**/

// hydrate the slice state with a model
store.dispatch(userSlice.actions.hydrate({
    id: '789ghi',
    name: 'carl',
    age: '35'
}))
// state.user is now...
/**
{
  ...
  "lastModified": null,
  "lastHydrated": "2020-07-08T19:37:37-04:00",
  "model": {
    "id": "789ghi",
    "name": "carl",
    "age": "35"
  }
}
**/

// set the slice state error
// NOTE: the Error is mapped to a serialize-able object by the action creator
store.dispatch(userSlice.actions.setError(new Error('Uh-oh')))
// state.user is now...
/**
{
  ...
  "error": {
    "stack": 'Error: Uh-oh\n ...',
    "message": 'Uh-oh'
  },
}
**/

// reset the slice state back to its initial state
store.dispatch(userSlice.actions.reset())
// state.user is now...
/**
{
  "status": "Settled",
  "error": null,
  "lastModified": null,
  "lastHydrated": null,
  "model": {
    "id": "456def",
    "name": "bobby",
    "age": "30"
  }
}
**/
```
