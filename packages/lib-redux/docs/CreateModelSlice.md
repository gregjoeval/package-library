# `createModelSlice()`
creates a slice for a single model.

## Parameters

### `name`
A string name for this slice of state. Generated action type constants will use this as a prefix. <br>
See [createSlice](https://redux-toolkit.js.org/api/createSlice#name) docs.

### `selectSliceState`
A selector function that accepts the entire Redux state tree and returns the slice's state object.

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

## Example:

```typescript
import { createModelSlice } from '@gjv/lib-redux';

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

const { name, reducer, actions, selectors } = createModelSlice<
    GlobalStateType,
    IUserModel,
    keyof typeof UserSliceStatusEnum
    >(
    'User',
    (globalState) => globalState.User
);

// Custom Async Thunk
const save = (model: IUserModel) => async (dispatch) => {
    dispatch(actions.setStatus(UserSliceStatusEnum.Saving));
    dispatch(actions.update(model)); // Update state before save request if necessary

    try {
        const response = await saveModelToExternalDataSource(model)
        
        // Let's assume our save operation was a POST and returns the model we just saved
        dispatch(actions.hydrate(response.model));
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

const MySlice = {
    name: name,
    reducer: reducer,
    actions: _actions
    selectors: selectors
};

export default MySlice;
```
