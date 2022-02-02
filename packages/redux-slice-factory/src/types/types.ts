import { CaseReducer, CaseReducerActions, OutputSelector, PayloadAction, Reducer, Selector, SerializedError, SliceCaseReducers } from '@reduxjs/toolkit'
import { IMetaState, StatusEnum } from '..'

/**
 * @public
 */
export type ISelectSliceState<TGlobalState, TSliceState> = (globalState: TGlobalState) => TSliceState

/**
 * @public
 */
export type ISelectCanRequest<TSliceState> = (sliceState: TSliceState) => boolean

/**
 * @public
 */
export type ISelectShouldRequest<TSliceState> = (sliceState: TSliceState, canRequest: ReturnType<ISelectCanRequest<TSliceState>>) => boolean

/**
 * @public
 */
export interface ISliceOptions<
    TGlobalState,
    TSliceState
> {
    /**
     * The name of the slice in the redux store.
     */
    name: ISliceName<TGlobalState>;

    /**
     * @see {@link ISliceSelectors.selectSliceState}
     */
    selectSliceState: ISelectSliceState<TGlobalState, TSliceState>;

    /**
     * @see {@link ISliceSelectors.selectCanRequest}
     */
    selectCanRequest?: ISelectCanRequest<TSliceState>;

    /**
     * @see {@link ISliceSelectors.selectShouldRequest}
     */
    selectShouldRequest?: ISelectShouldRequest<TSliceState>;

    /**
     * The initial state of the slice.
     */
    initialState?: Partial<TSliceState>;

    /**
     * The function for mapping a `Date` to a timestamp.
     */
    createTimestamp?: (datetime?: Date) => string;
}

/**
 * @public
 */
export type IOutputSelector<TGlobalState, TSliceState, TResult> = OutputSelector<[Selector<TGlobalState, TSliceState>], TResult, (sliceState: TSliceState) => TResult>

/**
 * @public
 */
export interface ISliceSelectors<
    TGlobalState,
    TSliceState
> {
    /**
     * @public
     * Selects the entire slice state.
     */
    selectSliceState: IOutputSelector<TGlobalState, TSliceState, TSliceState>;

    /**
     * @defaultValue (overrideable) The slice can request if it is not requesting, error is empty, and the slice has not been modified
     */
    selectCanRequest: IOutputSelector<TGlobalState, TSliceState, boolean>;

    /**
     * @defaultValue (overrideable) The slice should request if it can request and it has not been hydrated
     * @see {@link ISliceSelectors.selectCanRequest}
     */
    selectShouldRequest: IOutputSelector<TGlobalState, TSliceState, boolean>;
}

/**
 * @internal
 */
export type ISliceName<TGlobalState> = keyof TGlobalState & string

/**
 * @public
 */
export interface ISlice<
    TGlobalState,
    TSliceState,
    TCaseReducers extends SliceCaseReducers<TSliceState>,
    TSliceSelectors extends ISliceSelectors<TGlobalState, TSliceState>
> {
    name: ISliceName<TGlobalState>;
    reducer: Reducer<TSliceState>;
    actions: CaseReducerActions<TCaseReducers>;
    selectors: TSliceSelectors;
}

/**
 * @public
 * @see IMetaState
 */
export interface IMetaSliceSelectors<
    TGlobalState,
    TSliceState,
    TStatusEnum extends keyof typeof StatusEnum | & string = keyof typeof StatusEnum,
    TError extends SerializedError = SerializedError
> {
    /**
     * This selects the status of the slice.
     * @see {@link IMetaState.status}
     */
    selectStatus: IOutputSelector<TGlobalState, TSliceState, TStatusEnum>;

    /**
     * This selects the error of the slice.
     * @see {@link IMetaState.error}
     */
    selectError: IOutputSelector<TGlobalState, TSliceState, TError | null>;

    /**
     * This selects the lastModified of the slice.
     * @see {@link IMetaState.lastModified}
     */
    selectLastModified: IOutputSelector<TGlobalState, TSliceState, string | null>;

    /**
     * This selects the status of the slice.
     * @see {@link IMetaState.lastHydrated}
     */
    selectLastHydrated: IOutputSelector<TGlobalState, TSliceState, string | null>;
}

export interface IMetaSliceReducers<
    TSliceState,
    TStatusEnum extends keyof typeof StatusEnum | & string = keyof typeof StatusEnum,
    TError extends SerializedError = SerializedError
> extends SliceCaseReducers<TSliceState> {
    /**
     * This will set the status of the slice.
     */
    setStatus: CaseReducer<TSliceState, PayloadAction<TStatusEnum>>;

    /**
      * This will set the error of the slice.
      */
    setError: CaseReducer<TSliceState, PayloadAction<TError | null>>;

    /**
      * This will set any meta state properties that are defined
      */
    setMetaState: CaseReducer<TSliceState, PayloadAction<Partial<Pick<IMetaState<TStatusEnum, TError>, 'error' | 'status'>>>>;
}
