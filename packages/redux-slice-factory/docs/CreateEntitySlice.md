# `createEntitySlice()`
creates a slice for a collection of entities.

## Parameters

### `name`
A string name for this slice of state. Generated action type constants will use this as a prefix. <br>
See the [`createSlice()` docs](https://redux-toolkit.js.org/api/createSlice#name).

### `selectSliceState`
A selector function that accepts the entire Redux state tree and returns the slice's state object.

### `selectId`
A function that accepts a single `Entity` instance, and returns the entity's unique ID field. <br>
See the [`createEntityAdapter()` docs](https://redux-toolkit.js.org/api/createEntityAdapter#selectid).

### `sortComparer`
A callback function that accepts two `Entity` instances, and should return a standard Array.sort() numeric result (1, 0, -1) to indicate their relative order for sorting. <br>
See [`createEntityAdapter()` docs](https://redux-toolkit.js.org/api/createEntityAdapter#sortcomparer).

### `options`
An optional object that contains the following properties:
- `debug`: `boolean`, Whether to print the values of a slice to the console
- `initialState`: `Partial<TSliceState>`, The initial state value for this slice of state

## Return Value
// TODO add a better description

```
{
    name: string;
    reducer: Reducer<TSliceState>;
    actions: CaseReducerActions<TCaseReducers>;
    selectors: TSliceSelectors;
}
```

### Example

```typescript
import { createEntitySlice } from '@gjv/redux-slice-factory';

interface IUserModel {
    id: string;
    name: string;
    age: string;
}

enum UserSliceStatusEnum {
    Settled = 'Settled',
    Requesting = 'Requesting',
    Failed = 'Failed',
    Saving = 'Saving',
    Saved = 'Saved',
}

const { name, reducer, actions, selectors } = createEntitySlice<
    GlobalStateType,
    IUserModel,
    keyof typeof UserSliceStatusEnum
    >(
    'Users',
    (globalState) => globalState.Users,
    (entity) => entity.id,
    (entityA, entityB) => entityA.name.localeCompare(entityB.name),
);

// Custom Async Thunk
const save = (model: IUserModel) => async (dispatch) => {
    dispatch(actions.setStatus(UserSliceStatusEnum.Saving));
    dispatch(actions.updateOne(model)); // Update state before save request if necessary

    try {
        const response = await saveModelToExternalDataSource(model)
        
        // Let's assume our save operation was a POST and returns the model we just saved
        dispatch(actions.hydrateOne(response.model));
        dispatch(actions.setStatus(UserSliceStatusEnum.Saved));
    } catch (error) {
        // Use the error that bubbled up from the save operation or create your own Error object
        dispatch(actions.setError(error));
        dispatch(actions.setStatus(UserSliceStatusEnum.Failed));
    }
};

const _actions = {
    ...actions,
    save: save
};

const UsersSlice = {
    name: name,
    reducer: reducer,
    actions: _actions
    selectors: selectors
};

export default UsersSlice;
```
