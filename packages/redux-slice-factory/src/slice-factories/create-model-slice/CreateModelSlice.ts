import {
    CaseReducer,
    createSelector,
    createSlice,
    PayloadAction,
} from '@reduxjs/toolkit'
import merge from 'lodash.merge'
import StatusEnum from '../../constants/StatusEnum'
import ModelState, { IModelState } from '../../models/model-state'
import { IMetaSliceSelectors, ISlice, ISliceName, ISliceSelectors } from '../../types'
import { getISOStringWithOffset, logSlice } from '../../utilities'

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
    TStatusEnum extends keyof typeof StatusEnum | & string = keyof typeof StatusEnum,
    TError extends Error = Error
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
    TStatusEnum extends keyof typeof StatusEnum | & string = keyof typeof StatusEnum,
    TError extends Error = Error
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
    TError extends Error = Error
> {
    name: ISliceName<TGlobalState>;
    selectSliceState: (state: TGlobalState) => IModelState<TModel, TStatusEnum, TError>;
    selectCanRequest?: (sliceState: IModelState<TModel, TStatusEnum, TError>) => boolean;
    selectShouldRequest?: (sliceState: IModelState<TModel, TStatusEnum, TError>, canRequest: boolean) => boolean;
    initialState?: Partial<IModelState<TModel, TStatusEnum, TError>>;
    debug?: boolean;
}

/**
 * @public
 */
function createModelSlice<
    TGlobalState,
    TModel,
    TStatusEnum extends keyof typeof StatusEnum | & string = keyof typeof StatusEnum,
    TError extends Error = Error
>(options: ICreateModelSliceOptions<TGlobalState, TModel, TStatusEnum, TError>): IModelSlice<TGlobalState, TModel, TStatusEnum, TError> {
    type ISliceState = IModelState<TModel, TStatusEnum, TError>

    const defaultCanRequestSelector = (sliceState: ISliceState): boolean => sliceState.status !== StatusEnum.Requesting
        && sliceState.error === null
        && sliceState.lastModified === null

    const defaultShouldRequestSelector = (sliceState: ISliceState, canRequest: boolean): boolean => canRequest && sliceState.lastHydrated === null

    const { name, selectSliceState, selectCanRequest = defaultCanRequestSelector, selectShouldRequest = defaultShouldRequestSelector, initialState, debug } = options

    // intentional, necessary with immer
    /* eslint-disable no-param-reassign */
    const setModelState = (state: ISliceState, model: TModel): void => {
        state.model = model
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

    const modifyState = (state: ISliceState, model: TModel): void => {
        setModelState(state, model)
        // TODO: should not have a side effect: https://redux.js.org/style-guide/style-guide#reducers-must-not-have-side-effects
        setLastModified(state, getISOStringWithOffset())
    }

    const hydrateState = (state: ISliceState, model: TModel): void => {
        setModelState(state, model)
        setLastModified(state, null)
        // TODO: should not have a side effect: https://redux.js.org/style-guide/style-guide#reducers-must-not-have-side-effects
        setLastHydrated(state, getISOStringWithOffset())
    }

    const initialSliceState = ModelState.create<TModel, TStatusEnum, TError>(initialState ?? {})

    const slice = createSlice<ISliceState, IModelSliceReducers<ISliceState, TModel, TStatusEnum, TError>, ISliceName<TGlobalState>>({
        name: name,
        initialState: initialSliceState,
        reducers: {
            hydrate: (state, action) => {
                hydrateState(state as ISliceState, action.payload)
            },
            update: (state, action) => {
                const newModel = merge(state.model, action.payload) as TModel
                modifyState(state as ISliceState, newModel)
            },
            reset: () => initialSliceState,
            set: (state, action) => {
                modifyState(state as ISliceState, action.payload)
            },
            setError: (state, action) => {
                setError(state as ISliceState, action.payload)
            },
            setStatus: (state, action) => {
                setStatus(state as ISliceState, action.payload)
            },
        },
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

    const modelSlice: IModelSlice<TGlobalState, TModel, TStatusEnum, TError> = {
        name: slice.name,
        reducer: slice.reducer,
        actions: slice.actions,
        selectors: selectors,
    }

    if (debug) {
        logSlice(modelSlice, initialSliceState)
    }

    return modelSlice
}

export default createModelSlice
