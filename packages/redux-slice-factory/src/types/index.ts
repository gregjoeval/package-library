import { CaseReducerActions, Reducer, SerializedError, SliceCaseReducers } from '@reduxjs/toolkit'
import StatusEnum from '../constants/StatusEnum'

/**
 * @public
 */
export interface ISliceOptions<
    TGlobalState,
    TSliceState
> {
    name: ISliceName<TGlobalState>;
    selectSliceState: (state: TGlobalState) => TSliceState;
    selectCanRequest?: (sliceState: TSliceState) => boolean;
    selectShouldRequest?: (sliceState: TSliceState, canRequest: boolean) => boolean;
    initialState?: Partial<TSliceState>;
    createTimestamp?: (datetime?: Date) => string;
    debug?: boolean;
}

/**
 * @public
 */
export interface ISliceSelectors<
    TGlobalState,
    TSliceState
> {
    selectSliceState: (state: TGlobalState) => TSliceState;
    /**
     * (overrideable) The slice can request if it is not requesting, error is empty, and the slice has not been modified
     * @see IMetaState
     */
    selectCanRequest: (state: TGlobalState) => boolean;
    /**
     * (overrideable) The slice should request if it can request and it has not been hydrated
     * @see IMetaState
     * @see ISliceSelectors.selectCanRequest
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
    TStatusEnum extends keyof typeof StatusEnum | & string = keyof typeof StatusEnum,
    TError extends SerializedError = Error
> {
    selectStatus: (state: TGlobalState) => TStatusEnum;
    selectError: (state: TGlobalState) => TError | null;
    selectLastModified: (state: TGlobalState) => string | null;
    selectLastHydrated: (state: TGlobalState) => string | null;
}
