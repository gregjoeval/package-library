import { CaseReducer, createEntityAdapter, createSlice, EntityId, PayloadAction, Update } from '@reduxjs/toolkit';
import EntityDataState, { DataStateStatusEnum, IEntityDataState } from '../data-state/EntityDataState';

interface IUser {
    id: string;
    name: string;
    age: number;
}

type UserDataState = IEntityDataState<IUser>

type DataSliceAction<TEntity = void> = PayloadAction<TEntity>

type EntityDataSliceReducers<TState, TEntity> = {
    addOne: CaseReducer<TState, DataSliceAction<TEntity>>;
    addMany: CaseReducer<TState, DataSliceAction<Array<TEntity> | Record<EntityId, TEntity>>>;
    setAll: CaseReducer<TState, DataSliceAction<Array<TEntity> | Record<EntityId, TEntity>>>;
    removeOne: CaseReducer<TState, DataSliceAction<EntityId>>;
    removeMany: CaseReducer<TState, DataSliceAction<Array<EntityId>>>;
    removeAll: CaseReducer<TState, DataSliceAction>;
    updateOne: CaseReducer<TState, DataSliceAction<Update<TEntity>>>;
    updateMany: CaseReducer<TState, DataSliceAction<Array<Update<TEntity>>>>;
    upsertOne: CaseReducer<TState, DataSliceAction<TEntity>>;
    upsertMany: CaseReducer<TState, DataSliceAction<Array<TEntity> | Record<EntityId, TEntity>>>;

    hydrateOne: CaseReducer<TState, DataSliceAction<TEntity>>;
    hydrateMany: CaseReducer<TState, DataSliceAction<Array<TEntity> | Record<EntityId, TEntity>>>;
    hydrateAll: CaseReducer<TState, DataSliceAction<Array<TEntity> | Record<EntityId, TEntity>>>;

    setStatus: CaseReducer<TState, DataSliceAction<DataStateStatusEnum>>;
    setError: CaseReducer<TState, DataSliceAction<Error | null>>;
}

const usersAdapter = createEntityAdapter<IUser>({
    selectId: (o) => o.id,
    sortComparer: (a, b) => a.name.localeCompare(b.name)
});

const entityState = usersAdapter.getInitialState();

const initialState = EntityDataState.create<IUser>({
    ids: entityState.ids,
    entities: entityState.entities
});

const handleModifiedState = (state: UserDataState): UserDataState => ({
    ...state,
    lastModified: new Date().toISOString() // TODO: this is temp
});

const handleHydratedState = (state: UserDataState): UserDataState => ({
    ...state,
    lastModified: null,
    lastHydrated: new Date().toISOString() // TODO: this is temp
});

const x = createSlice<UserDataState, EntityDataSliceReducers<UserDataState, IUser>>({
    name: 'User',
    initialState: initialState,
    reducers: {
        addOne: (state, action): UserDataState => handleModifiedState(usersAdapter.addOne(state, action)),
        addMany: (state, action): UserDataState => handleModifiedState(usersAdapter.addMany(state, action)),
        setAll: (state, action): UserDataState => handleModifiedState(usersAdapter.setAll(state, action)),
        removeOne: (state, action): UserDataState => handleModifiedState(usersAdapter.removeOne(state, action)),
        removeMany: (state, action): UserDataState => handleModifiedState(usersAdapter.removeMany(state, action)),
        removeAll: (state): UserDataState => handleModifiedState(usersAdapter.removeAll(state)),
        updateOne: (state, action): UserDataState => handleModifiedState(usersAdapter.updateOne(state, action)),
        updateMany: (state, action): UserDataState => handleModifiedState(usersAdapter.updateMany(state, action)),
        upsertOne: (state, action): UserDataState => handleModifiedState(usersAdapter.upsertOne(state, action)),
        upsertMany: (state, action): UserDataState => handleModifiedState(usersAdapter.upsertMany(state, action)),

        hydrateOne: (state, action): UserDataState => handleHydratedState(usersAdapter.upsertOne(state, action.payload)),
        hydrateMany: (state, action): UserDataState => handleHydratedState(usersAdapter.upsertMany(state, action.payload)),
        hydrateAll: (state, action): UserDataState => handleHydratedState(usersAdapter.setAll(state, action.payload)),

        setStatus: (state, action): UserDataState => ({
            ...state,
            status: action.payload
        }),
        setError: (state, action): UserDataState => ({
            ...state,
            error: action.payload
        })
    }
});
