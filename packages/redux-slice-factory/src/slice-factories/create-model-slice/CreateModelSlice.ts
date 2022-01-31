import {
    CaseReducer,
    createNextState,
    createSelector,
    createSlice,
    Draft,
    PayloadAction,
    SerializedError,
} from '@reduxjs/toolkit'
import merge from 'ts-deepmerge'
import StatusEnum from '../../constants/StatusEnum'
import ModelState, { IModelState } from '../../models/model-state'
import { IMetaSliceReducers, IMetaSliceSelectors, ISlice, ISliceName, ISliceOptions, ISliceSelectors, IOutputSelector } from '../../types'
import { getISOString } from '../../utilities'

/**
 * @public
 */
export interface IModelSliceReducers <
    TSliceState,
    TModel,
    TStatusEnum extends keyof typeof StatusEnum | & string = keyof typeof StatusEnum,
    TError extends SerializedError = SerializedError
> extends IMetaSliceReducers<TSliceState, TStatusEnum, TError> {
    /**
     * This will hydrate the slice. This sets the model and lastHydrated, and resets lastModified.
     */
    hydrate: CaseReducer<TSliceState, PayloadAction<TModel>>;

    /**
     * This will modify the slice. This updates the model and sets lastModified.
     */
    update: CaseReducer<TSliceState, PayloadAction<Partial<TModel>>>;

    /**
     * This will modify the slice. This sets the model and sets lastModified.
     */
    set: CaseReducer<TSliceState, PayloadAction<TModel>>;

    /**
     * This will reset the slice to its initial state.
     */
    reset: CaseReducer<TSliceState, PayloadAction>;
}

/**
 * @public
 */
export interface IModelSliceSelectors <
    TGlobalState,
    TModel,
    TStatusEnum extends keyof typeof StatusEnum | & string = keyof typeof StatusEnum,
    TError extends SerializedError = SerializedError
>
    extends
    ISliceSelectors<TGlobalState, IModelState<TModel, TStatusEnum, TError>>,
    IMetaSliceSelectors<TGlobalState, IModelState<TModel, TStatusEnum, TError>, TStatusEnum, TError> {
    /**
     * This selects the slice model.
     */
    selectModel: IOutputSelector<TGlobalState, IModelState<TModel, TStatusEnum, TError>, TModel>;
}

/**
 * @public
 */
export type IModelSlice<
    TGlobalState,
    TModel,
    TStatusEnum extends keyof typeof StatusEnum | & string = keyof typeof StatusEnum,
    TError extends SerializedError = SerializedError
> = ISlice<
TGlobalState,
IModelState<TModel, TStatusEnum, TError>,
IModelSliceReducers<IModelState<TModel, TStatusEnum, TError>, TModel, TStatusEnum, TError>,
IModelSliceSelectors<TGlobalState, TModel, TStatusEnum, TError>
>

/**
 * @public
 */
export interface ICreateModelSliceOptions<
    TGlobalState,
    TModel,
    TStatusEnum extends keyof typeof StatusEnum | & string = keyof typeof StatusEnum,
    TError extends SerializedError = SerializedError
> extends ISliceOptions<TGlobalState, IModelState<TModel, TStatusEnum, TError>> {
    /**
     * This is how the slice will merge the current model and the update model during an update action
     * @defaultValue `merge` from {@link https://www.npmjs.com/package/ts-deepmerge}
     */
    handleUpdate?: (current: Draft<TModel>, update: Partial<TModel>) => TModel;
}

/**
 * @public
 */
function createModelSlice<
    TGlobalState,
    TModel,
    TStatusEnum extends keyof typeof StatusEnum |& string = keyof typeof StatusEnum,
    TError extends SerializedError = SerializedError
>(options: ICreateModelSliceOptions<TGlobalState, TModel, TStatusEnum, TError>): IModelSlice<TGlobalState, TModel, TStatusEnum, TError> {
    type ISliceState = IModelState<TModel, TStatusEnum, TError>

    const defaultCanRequestSelector = (sliceState: ISliceState): boolean => sliceState.status !== 'Requesting'
        && sliceState.error === null
        && sliceState.lastModified === null

    const defaultShouldRequestSelector = (sliceState: ISliceState, canRequest: boolean): boolean => canRequest && sliceState.lastHydrated === null

    const {
        name,
        handleUpdate = merge,
        selectSliceState,
        selectCanRequest = defaultCanRequestSelector,
        selectShouldRequest = defaultShouldRequestSelector,
        initialState = {},
        createTimestamp = getISOString,
    } = options

    const initialSliceState = ModelState.create<TModel, TStatusEnum, TError>(initialState)

    const slice = createSlice<ISliceState, IModelSliceReducers<ISliceState, TModel, TStatusEnum, TError>, ISliceName<TGlobalState>>({
        name: name,
        initialState: initialSliceState,
        // intentional, necessary with immer
        /* eslint-disable no-param-reassign */
        reducers: {
            hydrate: (state, action) => {
                state.model = createNextState(state.model, () => action.payload)
                state.lastModified = null
                // TODO: should not have a side effect: https://redux.js.org/style-guide/style-guide#reducers-must-not-have-side-effects
                state.lastHydrated = createTimestamp()
            },
            update: (state, action) => {
                state.model = createNextState(state.model, () => handleUpdate(state.model, action.payload))
                // TODO: should not have a side effect: https://redux.js.org/style-guide/style-guide#reducers-must-not-have-side-effects
                state.lastModified = createTimestamp()
            },
            reset: () => initialSliceState,
            set: (state, action) => {
                state.model = createNextState(state.model, () => action.payload)
                // TODO: should not have a side effect: https://redux.js.org/style-guide/style-guide#reducers-must-not-have-side-effects
                state.lastModified = createTimestamp()
            },
            setError: (state, action) => {
                state.error = createNextState(state.error, () => action.payload)
            },
            setStatus: (state, action) => {
                state.status = createNextState(state.status, () => action.payload)
            },
            setMetaState: (state, action) => {
                state.status = createNextState(state.status, () => action.payload)
            },
        },
        /* eslint-enable no-param-reassign */
    })

    type ISelectors = IModelSliceSelectors<TGlobalState, TModel, TStatusEnum, TError>
    const selectors: ISelectors = {
        selectSliceState: createSelector([selectSliceState], (sliceState) => sliceState) as unknown as ISelectors['selectSliceState'],
        selectModel: createSelector([selectSliceState], (sliceState) => sliceState.model) as unknown as ISelectors['selectModel'],
        selectStatus: createSelector([selectSliceState], (sliceState) => sliceState.status) as unknown as ISelectors['selectStatus'],
        selectError: createSelector([selectSliceState], (sliceState) => sliceState.error) as unknown as ISelectors['selectError'],
        selectLastModified: createSelector([selectSliceState], (sliceState) => sliceState.lastModified) as unknown as ISelectors['selectLastModified'],
        selectLastHydrated: createSelector([selectSliceState], (sliceState) => sliceState.lastHydrated) as unknown as ISelectors['selectLastHydrated'],
        selectCanRequest: createSelector([selectSliceState], (sliceState) => selectCanRequest(sliceState)) as unknown as ISelectors['selectCanRequest'],
        selectShouldRequest: createSelector([selectSliceState], (sliceState) => selectShouldRequest(sliceState, selectCanRequest(sliceState))) as unknown as ISelectors['selectShouldRequest'],
    }

    return {
        name: slice.name,
        reducer: slice.reducer,
        actions: slice.actions,
        selectors: selectors,
    }
}

export default createModelSlice
