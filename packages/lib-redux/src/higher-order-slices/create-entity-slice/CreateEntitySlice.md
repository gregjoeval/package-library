# `createModelSlice`

### Example:

```typescript
import { createEntitySlice } from '@gjv/lib-redux';

interface IUserModel {
    id: string;
    name: string;
    age: string;
}

enum MyCustomStatusEnum {
    Settled = 'Settled',
    Requesting = 'Requesting',
    Failed = 'Failed',
    Saving = 'Saving',
    Saved = 'Saved',
}

const { Name, Reducer, Actions, Selectors } = createEntitySlice<
    GlobalStateType,
    IUserModel,
    keyof typeof MyCustomStatusEnum
    >(
    'Users',
    (globalState) => globalState.Users,
    (entity) => entity.id,
    (entityA, entityB) => entityA.name.localeCompare(entityB.name),
);

// Custom Async Thunk
const save = (model: IUserModel) => async (dispatch) => {
    dispatch(Actions.setStatus(MyCustomStatusEnum.Saving));
    dispatch(Actions.updateOne(model)); // Update state before save request if necessary

    try {
        const response = await saveModelToExternalDataSource(model)
        
        // Let's assume our save operation was a POST and returns the model we just saved
        dispatch(Actions.hydrateOne(response.model));
        dispatch(Actions.setStatus(MyCustomStatusEnum.Saved));
    } catch (error) {
        // Use the error that bubbled up from the save operation or create your own Error object
        dispatch(Actions.setError(error));
        dispatch(Actions.setStatus(MyCustomStatusEnum.Failed));
    }
};

const actions = {
    ...Actions,
    save: save
};

const MySlice = {
    Name: Name,
    Reducer: Reducer,
    Actions: actions
    Selectors: Selectors
};

export default MySlice;
```
