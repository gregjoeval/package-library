/* eslint-disable @typescript-eslint/explicit-function-return-type */
import {
    CaseReducer,
    CaseReducerActions,
    Comparer,
    createEntityAdapter,
    createSlice,
    Dictionary,
    Draft,
    EntityId, EntitySelectors,
    EntityState,
    PayloadAction,
    Reducer,
    Update
} from '@reduxjs/toolkit';
import EntityDataState, { DataStateStatusEnum, IEntityDataState } from '../data-state/EntityDataState';

type EntityDataSliceReducers<TState, TEntity> = {
    addOne: CaseReducer<TState, PayloadAction<TEntity>>;
    addMany: CaseReducer<TState, PayloadAction<Array<TEntity> | Record<EntityId, TEntity>>>;
    hydrateOne: CaseReducer<TState, PayloadAction<TEntity>>;
    hydrateMany: CaseReducer<TState, PayloadAction<Array<TEntity> | Record<EntityId, TEntity>>>;
    hydrateAll: CaseReducer<TState, PayloadAction<Array<TEntity> | Record<EntityId, TEntity>>>;
    updateOne: CaseReducer<TState, PayloadAction<Update<TEntity>>>;
    updateMany: CaseReducer<TState, PayloadAction<Array<Update<TEntity>>>>;
    upsertOne: CaseReducer<TState, PayloadAction<TEntity>>;
    upsertMany: CaseReducer<TState, PayloadAction<Array<TEntity> | Record<EntityId, TEntity>>>;
    removeOne: CaseReducer<TState, PayloadAction<EntityId>>;
    removeMany: CaseReducer<TState, PayloadAction<Array<EntityId>>>;
    removeAll: CaseReducer<TState, PayloadAction>;
    setAll: CaseReducer<TState, PayloadAction<Array<TEntity> | Record<EntityId, TEntity>>>;
    setStatus: CaseReducer<TState, PayloadAction<DataStateStatusEnum>>;
    setError: CaseReducer<TState, PayloadAction<Error | null>>;
}

type MakeEntityDataSliceOptions<TEntity> = {
    debug: boolean;
    initialState: Partial<IEntityDataState<TEntity>>;
}

const selectEntityState = <TEntity> (state: Draft<IEntityDataState<TEntity>>): EntityState<TEntity> => ({
    ids: state.ids,
    entities: state.entities as Dictionary<TEntity>
});

// intentional, necessary with immer
/* eslint-disable no-param-reassign */
const setEntityState = <TEntity> (state: Draft<IEntityDataState<TEntity>>, entityState: EntityState<TEntity>) => {
    state.ids = entityState.ids;
    state.entities = entityState.entities as Dictionary<Draft<TEntity>>;
};

const setError = <TEntity> (state: Draft<IEntityDataState<TEntity>>, error: Error | null) => {
    state.error = error;
};

const setStatus = <TEntity> (state: Draft<IEntityDataState<TEntity>>, status: DataStateStatusEnum) => {
    state.status = status;
};

const setLastModified = <TEntity> (state: Draft<IEntityDataState<TEntity>>, lastModified: string | null) => {
    state.lastModified = lastModified;
};

const setLastHydrated = <TEntity> (state: Draft<IEntityDataState<TEntity>>, lastHydrated: string | null) => {
    state.lastHydrated = lastHydrated;
};
/* eslint-enable no-param-reassign */

const modifyState = <TEntity> (state: Draft<IEntityDataState<TEntity>>, entityState: EntityState<TEntity>) => {
    setEntityState(state, entityState);
    setLastModified(state, new Date().toISOString());
};

const hydrateState = <TEntity> (state: Draft<IEntityDataState<TEntity>>, entityState: EntityState<TEntity>) => {
    setEntityState(state, entityState);
    setLastModified(state, null);
    setLastHydrated(state, new Date().toISOString());
};

type EntityDataSliceActions <TEntity> = CaseReducerActions<EntityDataSliceReducers<IEntityDataState<TEntity>, TEntity>>

export interface IEntityDataSlice<TEntity> {
    Domain: string;
    Reducer: Reducer<IEntityDataState<TEntity>>;
    Actions: EntityDataSliceActions<TEntity>;
    Selectors: EntitySelectors<TEntity, IEntityDataState<TEntity>>;
}

const makeEntityDataSlice = <TEntity> (
    name: string,
    selectId: (o: TEntity) => EntityId,
    sortComparer: false | Comparer<TEntity>,
    options?: Partial<MakeEntityDataSliceOptions<TEntity>>
): IEntityDataSlice<TEntity> => {
    type State = IEntityDataState<TEntity>

    const entityAdapter = createEntityAdapter({
        selectId: selectId,
        sortComparer: sortComparer
    });

    const initialEntityState = entityAdapter.getInitialState(options?.initialState ?? {});
    const initialState = EntityDataState.create(initialEntityState);

    const slice = createSlice<State, EntityDataSliceReducers<State, TEntity>>({
        name: name,
        initialState: initialState,
        reducers: {
            addOne: (state: Draft<State>, action: PayloadAction<TEntity>) => {
                const entityState = selectEntityState<TEntity>(state);
                const newEntityState = entityAdapter.addOne(entityState, action.payload);
                modifyState(state, newEntityState);
            },
            addMany: (state: Draft<State>, action: PayloadAction<Array<TEntity> | Record<EntityId, TEntity>>) => {
                const entityState = selectEntityState<TEntity>(state);
                const newEntityState = entityAdapter.addMany(entityState, action.payload);
                modifyState(state, newEntityState);
            },
            hydrateOne: (state: Draft<State>, action: PayloadAction<TEntity>) => {
                const entityState = selectEntityState<TEntity>(state);
                const newEntityState = entityAdapter.upsertOne(entityState, action.payload);
                hydrateState(state, newEntityState);
            },
            hydrateMany: (state: Draft<State>, action: PayloadAction<Array<TEntity> | Record<EntityId, TEntity>>) => {
                const entityState = selectEntityState<TEntity>(state);
                const newEntityState = entityAdapter.upsertMany(entityState, action.payload);
                hydrateState(state, newEntityState);
            },
            hydrateAll: (state: Draft<State>, action: PayloadAction<Array<TEntity> | Record<EntityId, TEntity>>) => {
                const entityState = selectEntityState<TEntity>(state);
                const newEntityState = entityAdapter.setAll(entityState, action.payload);
                hydrateState(state, newEntityState);
            },
            updateOne: (state: Draft<State>, action: PayloadAction<Update<TEntity>>) => {
                const entityState = selectEntityState<TEntity>(state);
                const newEntityState = entityAdapter.updateOne(entityState, action.payload);
                modifyState(state, newEntityState);
            },
            updateMany: (state: Draft<State>, action: PayloadAction<Array<Update<TEntity>>>) => {
                const entityState = selectEntityState<TEntity>(state);
                const newEntityState = entityAdapter.updateMany(entityState, action.payload);
                modifyState(state, newEntityState);
            },
            upsertOne: (state: Draft<State>, action: PayloadAction<TEntity>) => {
                const entityState = selectEntityState<TEntity>(state);
                const newEntityState = entityAdapter.upsertOne(entityState, action.payload);
                modifyState(state, newEntityState);
            },
            upsertMany: (state: Draft<State>, action: PayloadAction<Array<TEntity> | Record<EntityId, TEntity>>) => {
                const entityState = selectEntityState<TEntity>(state);
                const newEntityState = entityAdapter.upsertMany(entityState, action.payload);
                modifyState(state, newEntityState);
            },
            removeOne: (state: Draft<State>, action: PayloadAction<EntityId>) => {
                const entityState = selectEntityState<TEntity>(state);
                const newEntityState = entityAdapter.removeOne(entityState, action.payload);
                modifyState(state, newEntityState);
            },
            removeMany: (state: Draft<State>, action: PayloadAction<Array<EntityId>>) => {
                const entityState = selectEntityState<TEntity>(state);
                const newEntityState = entityAdapter.removeMany(entityState, action.payload);
                modifyState(state, newEntityState);
            },
            removeAll: (state: Draft<State>) => {
                const entityState = selectEntityState<TEntity>(state);
                const newEntityState = entityAdapter.removeAll(entityState);
                modifyState(state, newEntityState);
            },
            setAll: (state: Draft<State>, action: PayloadAction<Array<TEntity> | Record<EntityId, TEntity>>) => {
                const entityState = selectEntityState<TEntity>(state);
                const newEntityState = entityAdapter.setAll(entityState, action.payload);
                modifyState(state, newEntityState);
            },
            setError: (state: Draft<State>, action: PayloadAction<Error | null>) => {
                setError(state, action.payload);
            },
            setStatus: (state: Draft<State>, action: PayloadAction<DataStateStatusEnum>) => {
                setStatus(state, action.payload);
            }
        }
    });

    const entityStateSelectors = entityAdapter.getSelectors();

    if (options?.debug) {
        // eslint-disable-next-line no-console
        console.log('slice', slice);
        // eslint-disable-next-line no-console
        console.log('entityStateSelectors', entityStateSelectors);
    }

    return {
        Domain: slice.name,
        Reducer: slice.reducer,
        Actions: slice.actions,
        Selectors: entityStateSelectors
    };
};

export default makeEntityDataSlice;
