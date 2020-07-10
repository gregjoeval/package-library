# `createModelSlice()`
creates a slice for a single model.

## Parameters

### `name`
A `string` name for this slice. Generated action type constants will use this as a prefix. <br>
See the [`createSlice()` docs](https://redux-toolkit.js.org/api/createSlice#name).

### `selectSliceState`
A selector `function` that accepts the entire Redux state tree and returns the slice's state object.

### `initialState`
An initial value for the reducer of the slice. Should satisfy the type `Partial<TSliceState>`. <br>
See the [`createSlice()` docs](https://redux-toolkit.js.org/api/createSlice#initialstate).

### `debug`
A `boolean` value that, when `true`, logs information about the slice to the console.

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

## Example

```typescript
import { createModelSlice } from '@gjv/redux-slice-factory';

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
    >({
        name: 'User',
        selectSliceState: (globalState) => globalState.User,
    });

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

const UserSlice = {
    name: name,
    reducer: reducer,
    actions: _actions
    selectors: selectors
};

export default UserSlice;
```
