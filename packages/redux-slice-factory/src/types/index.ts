import { CaseReducerActions, Reducer, SerializedError, SliceCaseReducers } from '@reduxjs/toolkit'

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
    selectSliceState: (state: TGlobalState) => TSliceState;

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
export interface ISliceSelectors<
    TGlobalState,
    TSliceState
> {
    /**
     * @public
     * Selects the entire slice state.
     */
    selectSliceState: (state: TGlobalState) => TSliceState;

    /**
     * @defaultValue (overrideable) The slice can request if it is not requesting, error is empty, and the slice has not been modified
     */
    selectCanRequest: (state: TGlobalState) => boolean;

    /**
     * @defaultValue (overrideable) The slice should request if it can request and it has not been hydrated
     * @see {@link ISliceSelectors.selectCanRequest}
     */
    selectShouldRequest: (state: TGlobalState) => boolean
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
    TStatusEnum,
    TError
> {
    /**
     * This selects the status of the slice.
     * @see {@link IMetaState.status}
     */
    selectStatus: (state: TGlobalState) => TStatusEnum;

    /**
     * This selects the error of the slice.
     * @see {@link IMetaState.error}
     */
    selectError: (state: TGlobalState) => TError | null;

    /**
     * This selects the lastModified of the slice.
     * @see {@link IMetaState.lastModified}
     */
    selectLastModified: (state: TGlobalState) => string | null;

    /**
     * This selects the status of the slice.
     * @see {@link IMetaState.lastHydrated}
     */
    selectLastHydrated: (state: TGlobalState) => string | null;
}
