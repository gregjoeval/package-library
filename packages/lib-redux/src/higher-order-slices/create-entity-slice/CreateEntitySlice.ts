import {
    createEntityAdapter,
    createSelector,
    createSlice,
    CaseReducer,
    Comparer,
    EntityId,
    EntitySelectors,
    EntityState as ReduxEntityState,
    PayloadAction,
    Update
} from '@reduxjs/toolkit';
import StateStatusEnum from '../../constants/StateStatusEnum';
import EntityState, { IEntityState } from '../../models/entity-state';
import { IMetaSliceSelectors, ISlice, ISliceSelectors } from '../../types';
import { getISOStringWithOffset, logSlice } from '../../utilities';

export type IEntitySliceReducers <TSliceState, TEntity, TStatusEnum, TError> = {
    addOne: CaseReducer<TSliceState, PayloadAction<TEntity>>;
    addMany: CaseReducer<TSliceState, PayloadAction<Array<TEntity> | Record<EntityId, TEntity>>>;
    hydrateOne: CaseReducer<TSliceState, PayloadAction<TEntity>>;
    hydrateMany: CaseReducer<TSliceState, PayloadAction<Array<TEntity> | Record<EntityId, TEntity>>>;
    hydrateAll: CaseReducer<TSliceState, PayloadAction<Array<TEntity> | Record<EntityId, TEntity>>>;
    updateOne: CaseReducer<TSliceState, PayloadAction<Update<TEntity>>>;
    updateMany: CaseReducer<TSliceState, PayloadAction<Array<Update<TEntity>>>>;
    upsertOne: CaseReducer<TSliceState, PayloadAction<TEntity>>;
    upsertMany: CaseReducer<TSliceState, PayloadAction<Array<TEntity> | Record<EntityId, TEntity>>>;
    removeOne: CaseReducer<TSliceState, PayloadAction<EntityId>>;
    removeMany: CaseReducer<TSliceState, PayloadAction<Array<EntityId>>>;
    removeAll: CaseReducer<TSliceState, PayloadAction>;
    reset: CaseReducer<TSliceState, PayloadAction>;
    setAll: CaseReducer<TSliceState, PayloadAction<Array<TEntity> | Record<EntityId, TEntity>>>;
    setStatus: CaseReducer<TSliceState, PayloadAction<TStatusEnum>>;
    setError: CaseReducer<TSliceState, PayloadAction<TError | null>>;
}

export interface IEntitySliceSelectors<
    TGlobalState,
    TEntity,
    TStatusEnum extends keyof typeof StateStatusEnum = keyof typeof StateStatusEnum, // TODO: will need this
    TError extends Error = Error // TODO: will need this
    >
    extends
        EntitySelectors<TEntity, TGlobalState>,
        ISliceSelectors<TGlobalState, IEntityState<TEntity, TStatusEnum, TError>>,
        IMetaSliceSelectors<TGlobalState, TStatusEnum, TError> {
}

export type IEntitySlice<
    TGlobalState,
    TEntity,
    TStatusEnum extends keyof typeof StateStatusEnum = keyof typeof StateStatusEnum,
    TError extends Error = Error
    > = ISlice<
        TGlobalState,
        IEntityState<TEntity, TStatusEnum, TError>,
        IEntitySliceReducers<IEntityState<TEntity, TStatusEnum, TError>, TEntity, TStatusEnum, TError>,
        IEntitySliceSelectors<TGlobalState, TEntity, TStatusEnum, TError>
        >

interface IMakeEntitySliceOptions<TSliceState> {
    debug: boolean;
    initialState: Partial<TSliceState>;
}

const createEntitySlice = <
    TGlobalState,
    TEntity,
    TStatusEnum extends keyof typeof StateStatusEnum = keyof typeof StateStatusEnum,
    TError extends Error = Error
    > (
        name: string,
        selectSliceState: (state: TGlobalState) => IEntityState<TEntity, TStatusEnum, TError>,
        selectId: (o: TEntity) => EntityId,
        sortComparer: false | Comparer<TEntity>,
        options?: Partial<IMakeEntitySliceOptions<IEntityState<TEntity, TStatusEnum, TError>>>
    ): IEntitySlice<TGlobalState, TEntity, TStatusEnum, TError> => {
    type ISliceState = IEntityState<TEntity, TStatusEnum, TError>

    const selectEntityState = (state: ISliceState): ReduxEntityState<TEntity> => ({
        ids: state.ids,
        entities: state.entities
    });

    // intentional, necessary with immer
    /* eslint-disable no-param-reassign */
    const setEntityState = (state: ISliceState, entityState: ReduxEntityState<TEntity>) => {
        state.ids = entityState.ids;
        state.entities = entityState.entities;
    };

    const setError = (state: ISliceState, error: TError | null) => {
        state.error = error;
    };

    const setStatus = (state: ISliceState, status: TStatusEnum) => {
        state.status = status;
    };

    const setLastModified = (state: ISliceState, lastModified: string | null) => {
        state.lastModified = lastModified;
    };

    const setLastHydrated = (state: ISliceState, lastHydrated: string | null) => {
        state.lastHydrated = lastHydrated;
    };
    /* eslint-enable no-param-reassign */

    const modifyState = (state: ISliceState, entityState: ReduxEntityState<TEntity>) => {
        setEntityState(state, entityState);
        // TODO: should not have a side effect: https://redux.js.org/style-guide/style-guide#reducers-must-not-have-side-effects
        setLastModified(state, getISOStringWithOffset());
    };

    const hydrateState = (state: ISliceState, entityState: ReduxEntityState<TEntity>) => {
        setEntityState(state, entityState);
        setLastModified(state, null);
        // TODO: should not have a side effect: https://redux.js.org/style-guide/style-guide#reducers-must-not-have-side-effects
        setLastHydrated(state, getISOStringWithOffset());
    };

    const entityAdapter = createEntityAdapter({
        selectId: selectId,
        sortComparer: sortComparer
    });

    const initialEntityState = entityAdapter.getInitialState(options?.initialState ?? {});
    const initialState = EntityState.create(initialEntityState);

    const slice = createSlice<ISliceState, IEntitySliceReducers<ISliceState, TEntity, TStatusEnum, TError>>({
        name: name,
        initialState: initialState,
        reducers: {
            addOne: (state, action) => {
                const entityState = selectEntityState(state as ISliceState);
                const newEntityState = entityAdapter.addOne(entityState, action.payload);
                modifyState(state as ISliceState, newEntityState);
            },
            addMany: (state, action) => {
                const entityState = selectEntityState(state as ISliceState);
                const newEntityState = entityAdapter.addMany(entityState, action.payload);
                modifyState(state as ISliceState, newEntityState);
            },
            hydrateOne: (state, action) => {
                const entityState = selectEntityState(state as ISliceState);
                const newEntityState = entityAdapter.upsertOne(entityState, action.payload);
                hydrateState(state as ISliceState, newEntityState);
            },
            hydrateMany: (state, action) => {
                const entityState = selectEntityState(state as ISliceState);
                const newEntityState = entityAdapter.upsertMany(entityState, action.payload);
                hydrateState(state as ISliceState, newEntityState);
            },
            hydrateAll: (state, action) => {
                const entityState = selectEntityState(state as ISliceState);
                const newEntityState = entityAdapter.setAll(entityState, action.payload);
                hydrateState(state as ISliceState, newEntityState);
            },
            updateOne: (state, action) => {
                const entityState = selectEntityState(state as ISliceState);
                const newEntityState = entityAdapter.updateOne(entityState, action.payload);
                modifyState(state as ISliceState, newEntityState);
            },
            updateMany: (state, action) => {
                const entityState = selectEntityState(state as ISliceState);
                const newEntityState = entityAdapter.updateMany(entityState, action.payload);
                modifyState(state as ISliceState, newEntityState);
            },
            upsertOne: (state, action) => {
                const entityState = selectEntityState(state as ISliceState);
                const newEntityState = entityAdapter.upsertOne(entityState, action.payload);
                modifyState(state as ISliceState, newEntityState);
            },
            upsertMany: (state, action) => {
                const entityState = selectEntityState(state as ISliceState);
                const newEntityState = entityAdapter.upsertMany(entityState, action.payload);
                modifyState(state as ISliceState, newEntityState);
            },
            removeOne: (state, action) => {
                const entityState = selectEntityState(state as ISliceState);
                const newEntityState = entityAdapter.removeOne(entityState, action.payload);
                modifyState(state as ISliceState, newEntityState);
            },
            removeMany: (state, action) => {
                const entityState = selectEntityState(state as ISliceState);
                const newEntityState = entityAdapter.removeMany(entityState, action.payload);
                modifyState(state as ISliceState, newEntityState);
            },
            removeAll: (state) => {
                const entityState = selectEntityState(state as ISliceState);
                const newEntityState = entityAdapter.removeAll(entityState);
                modifyState(state as ISliceState, newEntityState);
            },
            reset: () => initialState,
            setAll: (state, action) => {
                const entityState = selectEntityState(state as ISliceState);
                const newEntityState = entityAdapter.setAll(entityState, action.payload);
                modifyState(state as ISliceState, newEntityState);
            },
            setError: (state, action) => {
                setError(state as ISliceState, action.payload);
            },
            setStatus: (state, action) => {
                setStatus(state as ISliceState, action.payload);
            }
        }
    });

    const entitySelectors = entityAdapter.getSelectors((state: TGlobalState) => selectEntityState(selectSliceState(state)));

    const selectors = {
        selectIds: entitySelectors.selectIds,
        selectEntities: entitySelectors.selectEntities,
        selectAll: entitySelectors.selectAll,
        selectTotal: entitySelectors.selectTotal,
        selectById: entitySelectors.selectById,
        selectSliceState: createSelector(selectSliceState, (sliceState) => sliceState),
        selectStatus: createSelector(selectSliceState, (sliceState) => sliceState.status),
        selectError: createSelector(selectSliceState, (sliceState) => sliceState.error),
        selectLastModified: createSelector(selectSliceState, (sliceState) => sliceState.lastModified),
        selectLastHydrated: createSelector(selectSliceState, (sliceState) => sliceState.lastHydrated)
    };

    const entitySlice: IEntitySlice<TGlobalState, TEntity, TStatusEnum, TError> = {
        name: slice.name,
        reducer: slice.reducer,
        actions: slice.actions,
        selectors: selectors
    };

    if (options?.debug) {
        logSlice(entitySlice, initialState);
    }

    return entitySlice;
};

export default createEntitySlice;
