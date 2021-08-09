# `createEntitySlice()`
creates a slice for a collection of entities.

## Parameters

### `name`
A `string` name for this slice. Generated action type constants will use this as a prefix. <br>
See the [`createSlice()` docs](https://redux-toolkit.js.org/api/createSlice#name).

### `selectId`
A `function` that accepts a single `Entity` instance, and returns the entity's unique ID field. <br>
See the [`createEntityAdapter()` docs](https://redux-toolkit.js.org/api/createEntityAdapter#selectid).

### `sortComparer`
A callback `function` that accepts two `Entity` instances, and should return a standard Array.sort() numeric result (1, 0, -1) to indicate their relative order for sorting. <br>
See [`createEntityAdapter()` docs](https://redux-toolkit.js.org/api/createEntityAdapter#sortcomparer).

### `initialState`
`optional` <br>
An initial value for the reducer of the slice. Should satisfy the type `Partial<TSliceState>`. <br>
See the [`createSlice()` docs](https://redux-toolkit.js.org/api/createSlice#initialstate).

### `selectSliceState`
A selector `function` that returns the slice's state object.

### `selectCanRequest`
`optional` <br>
A selector `function` that returns true if the slice is able the make a request. <br>
The default behavior returns true if the slice is not requesting, doesn't have an error, and hasn't been modified.

### `selectShouldRequest`
`optional` <br>
A selector `function` that returns true if the slice should make a request. <br>
The default behavior returns true if `selectCanRequest` returns true, and the slice has not been hydrated.

### `createTimestamp`
`optional` <br>
A function that takes a `Date` object and returns a string. <br>
The default behavior returns an [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) timestamp with an offset.

### `debug`
`optional` <br>
A `boolean` value that, when `true`, logs information about the slice to the console.


    name: ISliceName<TGlobalState>;
    selectSliceState: (state: TGlobalState) => TSliceState;
    selectCanRequest?: (sliceState: TSliceState) => boolean;
    selectShouldRequest?: (sliceState: TSliceState, canRequest: boolean) => boolean;
    initialState?: Partial<TSliceState>;
    createTimestamp?: (datetime?: Date) => string;
    debug?: boolean;

## Return Value
```
{
    name: keyof TGlobalState & string;
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

const slice = createEntitySlice<
    GlobalStateType,
    IUserModel,
    keyof typeof UserSliceStatusEnum
    >({
        name: 'Users',
        selectSliceState: (globalState) => globalState.Users,
        selectId: (entity) => entity.id,
        sortComparer: (entityA, entityB) => entityA.name.localeCompare(entityB.name)
    });

// Custom Async Thunk
const save = (model: IUserModel) => async (dispatch) => {
    dispatch(slice.actions.setStatus(UserSliceStatusEnum.Saving));
    dispatch(slice.actions.updateOne(model)); // Update state before save request if necessary

    try {
        const response = await saveModelToExternalDataSource(model)
        
        // Let's assume our save operation was a POST and returns the model we just saved
        dispatch(slice.actions.hydrateOne(response.model));
        dispatch(slice.actions.setStatus(UserSliceStatusEnum.Saved));
    } catch (error) {
        // Use the error that bubbled up from the save operation or create your own Error object
        dispatch(slice.actions.setError(error));
        dispatch(slice.actions.setStatus(UserSliceStatusEnum.Failed));
    }
};

const _actions = {
    ...slice.actions,
    save: save
};

const UsersSlice = {
    name: slice.name,
    reducer: slice.reducer,
    actions: _actions
    selectors: slice.selectors
};

export default UsersSlice;
```
