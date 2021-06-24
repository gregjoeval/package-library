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
```
{
    name: keyof TGlobalState & string;
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

const slice = createModelSlice<
    GlobalStateType,
    IUserModel,
    keyof typeof UserSliceStatusEnum
    >({
        name: 'User',
        selectSliceState: (globalState) => globalState.User,
    });

// Custom Async Thunk
const save = (model: IUserModel) => async (dispatch) => {
    dispatch(slice.actions.setStatus(UserSliceStatusEnum.Saving));
    dispatch(slice.actions.update(model)); // Update state before save request if necessary

    try {
        const response = await saveModelToExternalDataSource(model)
        
        // Let's assume our save operation was a POST and returns the model we just saved
        dispatch(slice.actions.hydrate(response.model));
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

const UserSlice = {
    name: slice.name,
    reducer: slice.reducer,
    actions: _actions
    selectors: slice.selectors
};

export default UserSlice;
```
