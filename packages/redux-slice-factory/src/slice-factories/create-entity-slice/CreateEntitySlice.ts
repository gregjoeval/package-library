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
    Update, SerializedError, createNextState,
} from '@reduxjs/toolkit'
import StatusEnum from '../../constants/StatusEnum'
import EntityState, { IEntityState } from '../../models/entity-state'
import { IMetaSliceReducers, IMetaSliceSelectors, ISlice, ISliceName, ISliceOptions, ISliceSelectors } from '../../types'
import { getISOString } from '../../utilities'

/**
 * @public
 */
export interface IEntitySliceReducers <
    TSliceState,
    TEntity,
    TStatusEnum extends keyof typeof StatusEnum |& string,
    TError extends SerializedError
> extends IMetaSliceReducers<TSliceState, TStatusEnum, TError> {
    /**
     * This will modify the slice. This adds one entity to the slice and sets lastModified.
     * @see {@link @reduxjs/toolkit#EntityStateAdapter}
     */
    addOne: CaseReducer<TSliceState, PayloadAction<TEntity>>;

    /**
     * This will modify the slice. This adds many entities to the slice and sets lastModified.
     * @see {@link @reduxjs/toolkit#EntityStateAdapter}
     */
    addMany: CaseReducer<TSliceState, PayloadAction<Array<TEntity> | Record<EntityId, TEntity>>>;

    /**
     * This will hydrate the slice. This sets one entity of the slice and lastHydrated, and resets lastModified.
     * @see {@link @reduxjs/toolkit#EntityStateAdapter.setOne}
     */
    hydrateOne: CaseReducer<TSliceState, PayloadAction<TEntity>>;

    /**
     * This will hydrate the slice. This sets many entities of the slice and lastHydrated, and resets lastModified.
     * @see {@link @reduxjs/toolkit#EntityStateAdapter.setMany}
     */
    hydrateMany: CaseReducer<TSliceState, PayloadAction<Array<TEntity> | Record<EntityId, TEntity>>>;

    /**
     * This will hydrate the slice. This sets all entities of the slice and lastHydrated, and resets lastModified.
     * @see {@link @reduxjs/toolkit#EntityStateAdapter.setAll}
     */
    hydrateAll: CaseReducer<TSliceState, PayloadAction<Array<TEntity> | Record<EntityId, TEntity>>>;

    /**
     * This will modify the slice. This updates one entity of the slice and sets lastModified.
     * @see {@link @reduxjs/toolkit#EntityStateAdapter.updateOne}
     */
    updateOne: CaseReducer<TSliceState, PayloadAction<Update<TEntity>>>;

    /**
     * This will modify the slice. This updates many entities of the slice and sets lastModified.
     * @see {@link @reduxjs/toolkit#EntityStateAdapter.updateMany}
     */
    updateMany: CaseReducer<TSliceState, PayloadAction<Array<Update<TEntity>>>>;

    /**
     * This will modify the slice. This updates or inserts one entity of the slice and sets lastModified.
     * @see {@link @reduxjs/toolkit#EntityStateAdapter.upsertOne}
     */
    upsertOne: CaseReducer<TSliceState, PayloadAction<TEntity>>;

    /**
     * This will modify the slice. This updates or inserts many entities of the slice and sets lastModified.
     * @see {@link @reduxjs/toolkit#EntityStateAdapter.upsertMany}
     */
    upsertMany: CaseReducer<TSliceState, PayloadAction<Array<TEntity> | Record<EntityId, TEntity>>>;

    /**
     * This will modify the slice. This removes one entity of the slice and sets lastModified.
     * @see {@link @reduxjs/toolkit#EntityStateAdapter.removeOne}
     */
    removeOne: CaseReducer<TSliceState, PayloadAction<EntityId>>;

    /**
     * This will modify the slice. This removes many entities of the slice and sets lastModified.
     * @see {@link @reduxjs/toolkit#EntityStateAdapter.removeMany}
     */
    removeMany: CaseReducer<TSliceState, PayloadAction<Array<EntityId>>>;

    /**
     * This will modify the slice. This removes all entities of the slice and sets lastModified.
     * @see {@link @reduxjs/toolkit#EntityStateAdapter.removeAll}
     */
    removeAll: CaseReducer<TSliceState, PayloadAction>;

    /**
     * This will reset the slice to its initial state.
     */
    reset: CaseReducer<TSliceState, PayloadAction>;

    /**
     * This will modify the slice. This sets all entities of the slice and sets lastModified.
     * @see {@link @reduxjs/toolkit#EntityStateAdapter.setAll}
     */
    setAll: CaseReducer<TSliceState, PayloadAction<Array<TEntity> | Record<EntityId, TEntity>>>;
}

/**
 * @public
 */
export interface IEntitySliceSelectors<
    TGlobalState,
    TEntity,
    TStatusEnum extends keyof typeof StatusEnum |& string,
    TError extends SerializedError
> extends
    EntitySelectors<TEntity, TGlobalState>,
    ISliceSelectors<TGlobalState, IEntityState<TEntity, TStatusEnum, TError>>,
    IMetaSliceSelectors<TGlobalState, TStatusEnum, TError> {}

/**
 * @public
 */
export type IEntitySlice<
    TGlobalState,
    TEntity,
    TStatusEnum extends keyof typeof StatusEnum |& string,
    TError extends SerializedError
> = ISlice<
TGlobalState,
IEntityState<TEntity, TStatusEnum, TError>,
IEntitySliceReducers<IEntityState<TEntity, TStatusEnum, TError>, TEntity, TStatusEnum, TError>,
IEntitySliceSelectors<TGlobalState, TEntity, TStatusEnum, TError>
>

/**
 * @public
 */
export interface ICreateEntitySliceOptions<
    TGlobalState,
    TEntity,
    TStatusEnum extends keyof typeof StatusEnum |& string,
    TError extends SerializedError
> extends ISliceOptions<TGlobalState, IEntityState<TEntity, TStatusEnum, TError>> {
    selectId: (o: TEntity) => EntityId;
    sortComparer: false | Comparer<TEntity>;
}

/**
 * @public
 */
function createEntitySlice<
    TGlobalState,
    TEntity,
    TStatusEnum extends keyof typeof StatusEnum | & string = keyof typeof StatusEnum,
    TError extends SerializedError = Error
>(options: ICreateEntitySliceOptions<TGlobalState, TEntity, TStatusEnum, TError>): IEntitySlice<TGlobalState, TEntity, TStatusEnum, TError> {
    type ISliceState = IEntityState<TEntity, TStatusEnum, TError>

    const defaultCanRequestSelector = (sliceState: ISliceState): boolean => sliceState.status !== StatusEnum.Requesting
        && sliceState.error === null
        && sliceState.lastModified === null

    const defaultShouldRequestSelector = (sliceState: ISliceState, canRequest: boolean): boolean => canRequest && sliceState.lastHydrated === null

    const {
        name,
        selectId,
        sortComparer,
        selectSliceState,
        selectShouldRequest = defaultShouldRequestSelector,
        selectCanRequest = defaultCanRequestSelector,
        initialState = {},
        createTimestamp = getISOString,
    } = options

    // intentional, necessary with immer
    /* eslint-disable no-param-reassign */
    const setEntityState = (state: ISliceState, entityState: ReduxEntityState<TEntity>): void => {
        state.ids = entityState.ids
        state.entities = entityState.entities
    }

    const setError = (state: ISliceState, error: TError | null): void => {
        state.error = error === null ? null : error
    }

    const setStatus = (state: ISliceState, status: TStatusEnum): void => {
        state.status = status
    }

    const setLastModified = (state: ISliceState, lastModified: string | null): void => {
        state.lastModified = lastModified
    }

    const setLastHydrated = (state: ISliceState, lastHydrated: string | null): void => {
        state.lastHydrated = lastHydrated
    }
    /* eslint-enable no-param-reassign */

    const modifyState = (state: ISliceState, entityState: ReduxEntityState<TEntity>): void => {
        setEntityState(state, entityState)
        // TODO: should not have a side effect: https://redux.js.org/style-guide/style-guide#reducers-must-not-have-side-effects
        setLastModified(state, createTimestamp())
    }

    const hydrateState = (state: ISliceState, entityState: ReduxEntityState<TEntity>): void => {
        setEntityState(state, entityState)
        setLastModified(state, null)
        // TODO: should not have a side effect: https://redux.js.org/style-guide/style-guide#reducers-must-not-have-side-effects
        setLastHydrated(state, createTimestamp())
    }

    const entityAdapter = createEntityAdapter({
        selectId: selectId,
        sortComparer: sortComparer,
    })

    const initialEntityState = entityAdapter.getInitialState(initialState)
    const initialSliceState = EntityState.create<TEntity, TStatusEnum, TError>(initialEntityState)

    /* eslint-disable no-param-reassign */
    const slice = createSlice<ISliceState, IEntitySliceReducers<ISliceState, TEntity, TStatusEnum, TError>, ISliceName<TGlobalState>>({
        name: name,
        initialState: initialSliceState,
        reducers: {
            addOne: (state, action) => {
                const newEntityState = entityAdapter.addOne(state as ISliceState, action.payload)
                modifyState(state as ISliceState, newEntityState)
            },
            addMany: (state, action) => {
                const newEntityState = entityAdapter.addMany(state as ISliceState, action.payload)
                modifyState(state as ISliceState, newEntityState)
            },
            hydrateOne: (state, action) => {
                const newEntityState = entityAdapter.upsertOne(state as ISliceState, action.payload)
                hydrateState(state as ISliceState, newEntityState)
            },
            hydrateMany: (state, action) => {
                const newEntityState = entityAdapter.upsertMany(state as ISliceState, action.payload)
                hydrateState(state as ISliceState, newEntityState)
            },
            hydrateAll: (state, action) => {
                const newEntityState = entityAdapter.setAll(state as ISliceState, action.payload)
                hydrateState(state as ISliceState, newEntityState)
            },
            updateOne: (state, action) => {
                const newEntityState = entityAdapter.updateOne(state as ISliceState, action.payload)
                modifyState(state as ISliceState, newEntityState)
            },
            updateMany: (state, action) => {
                const newEntityState = entityAdapter.updateMany(state as ISliceState, action.payload)
                modifyState(state as ISliceState, newEntityState)
            },
            upsertOne: (state, action) => {
                const newEntityState = entityAdapter.upsertOne(state as ISliceState, action.payload)
                modifyState(state as ISliceState, newEntityState)
            },
            upsertMany: (state, action) => {
                const newEntityState = entityAdapter.upsertMany(state as ISliceState, action.payload)
                modifyState(state as ISliceState, newEntityState)
            },
            removeOne: (state, action) => {
                const newEntityState = entityAdapter.removeOne(state as ISliceState, action.payload)
                modifyState(state as ISliceState, newEntityState)
            },
            removeMany: (state, action) => {
                const newEntityState = entityAdapter.removeMany(state as ISliceState, action.payload)
                modifyState(state as ISliceState, newEntityState)
            },
            removeAll: (state) => {
                const newEntityState = entityAdapter.removeAll(state as ISliceState)
                modifyState(state as ISliceState, newEntityState)
            },
            reset: () => initialSliceState,
            setAll: (state, action) => {
                const newEntityState = entityAdapter.setAll(state as ISliceState, action.payload)
                modifyState(state as ISliceState, newEntityState)
            },
            setError: (state, action) => {
                setError(state as ISliceState, action.payload)
            },
            setStatus: (state, action) => {
                setStatus(state as ISliceState, action.payload)
            },
            setMetaState: (state, action) => {
                state.status = createNextState(state.status, () => action.payload)
            },
        },
    })
    /* eslint-disable no-param-reassign */

    const entitySelectors = entityAdapter.getSelectors((state: TGlobalState) => selectSliceState(state))
    const selectors: IEntitySliceSelectors<TGlobalState, TEntity, TStatusEnum, TError> = {
        selectIds: entitySelectors.selectIds,
        selectEntities: entitySelectors.selectEntities,
        selectAll: entitySelectors.selectAll,
        selectTotal: entitySelectors.selectTotal,
        selectById: entitySelectors.selectById,
        selectSliceState: createSelector((state): ISliceState => selectSliceState(state), (sliceState) => sliceState),
        selectStatus: createSelector(selectSliceState, (sliceState) => sliceState.status),
        selectError: createSelector(selectSliceState, (sliceState) => sliceState.error),
        selectLastModified: createSelector(selectSliceState, (sliceState) => sliceState.lastModified),
        selectLastHydrated: createSelector(selectSliceState, (sliceState) => sliceState.lastHydrated),
        selectCanRequest: createSelector(selectSliceState, (sliceState) => selectCanRequest(sliceState)),
        selectShouldRequest: createSelector(selectSliceState, (sliceState) => selectShouldRequest(sliceState, selectCanRequest(sliceState))),
    }

    return {
        name: slice.name,
        reducer: slice.reducer,
        actions: slice.actions,
        selectors: selectors,
    }
}

export default createEntitySlice
