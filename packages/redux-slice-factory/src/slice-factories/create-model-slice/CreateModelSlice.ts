import {
    CaseReducer,
    createNextState,
    createSelector,
    createSlice,
    Draft,
    PayloadAction,
    SerializedError,
} from '@reduxjs/toolkit'
import StatusEnum from '../../constants/StatusEnum'
import ModelState, { IModelState } from '../../models/model-state'
import { IMetaSliceSelectors, ISlice, ISliceName, ISliceOptions, ISliceSelectors } from '../../types'
import { getISOString } from '../../utilities'

/**
 * @public
 */
export type IModelSliceReducers <TSliceState, TModel, TStatusEnum, TError> = {
    hydrate: CaseReducer<TSliceState, PayloadAction<TModel>>;
    update: CaseReducer<TSliceState, PayloadAction<Partial<TModel>>>;
    set: CaseReducer<TSliceState, PayloadAction<TModel>>;
    reset: CaseReducer<TSliceState, PayloadAction>;
    setStatus: CaseReducer<TSliceState, PayloadAction<TStatusEnum>>;
    setError: CaseReducer<TSliceState, PayloadAction<TError | null>>;
}

/**
 * @public
 */
export interface IModelSliceSelectors <
    TGlobalState,
    TModel,
    TStatusEnum extends keyof typeof StatusEnum |& string = keyof typeof StatusEnum |& string,
    TError extends SerializedError = Error
>
    extends
    ISliceSelectors<TGlobalState, IModelState<TModel, TStatusEnum, TError>>,
    IMetaSliceSelectors<TGlobalState, TStatusEnum, TError> {
    selectModel: (state: TGlobalState) => TModel;
}

/**
 * @public
 */
export type IModelSlice<
    TGlobalState,
    TModel,
    TStatusEnum extends keyof typeof StatusEnum |& string = keyof typeof StatusEnum,
    TError extends SerializedError = Error
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
    TStatusEnum extends keyof typeof StatusEnum |& string = keyof typeof StatusEnum,
    TError extends SerializedError = Error
> extends ISliceOptions<TGlobalState, IModelState<TModel, TStatusEnum, TError>> {
    handleUpdate: (current: Draft<TModel>, update: Partial<TModel>) => TModel;
}

/**
 * @public
 */
function createModelSlice<
    TGlobalState,
    TModel,
    TStatusEnum extends keyof typeof StatusEnum |& string = keyof typeof StatusEnum,
    TError extends SerializedError = Error
>(options: ICreateModelSliceOptions<TGlobalState, TModel, TStatusEnum, TError>): IModelSlice<TGlobalState, TModel, TStatusEnum, TError> {
    type ISliceState = IModelState<TModel, TStatusEnum, TError>

    const defaultCanRequestSelector = (sliceState: ISliceState): boolean => sliceState.status !== 'Requesting'
        && sliceState.error === null
        && sliceState.lastModified === null

    const defaultShouldRequestSelector = (sliceState: ISliceState, canRequest: boolean): boolean => canRequest && sliceState.lastHydrated === null

    const {
        name,
        handleUpdate,
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
        },
        /* eslint-enable no-param-reassign */
    })

    const selectors: IModelSliceSelectors<TGlobalState, TModel, TStatusEnum, TError> = {
        selectSliceState: createSelector(selectSliceState, (sliceState) => sliceState),
        selectModel: createSelector(selectSliceState, (sliceState) => sliceState.model),
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

export default createModelSlice
