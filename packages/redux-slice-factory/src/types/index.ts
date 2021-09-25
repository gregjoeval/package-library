import { CaseReducer, CaseReducerActions, PayloadAction, Reducer, SerializedError, SliceCaseReducers } from '@reduxjs/toolkit'
import StatusEnum from '../constants/StatusEnum'

/**
 * @public
 */
export interface ISliceSelectors<
    TGlobalState,
    TSliceState
> {
    selectSliceState: (state: TGlobalState) => TSliceState;
    selectCanRequest: (state: TGlobalState) => boolean;
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
 */
export interface IMetaSliceSelectors<
    TGlobalState,
    TStatusEnum extends keyof typeof StatusEnum | & string = keyof typeof StatusEnum,
    TError extends SerializedError = SerializedError
> {
    selectStatus: (state: TGlobalState) => TStatusEnum;
    selectError: (state: TGlobalState) => TError | null;
    selectLastModified: (state: TGlobalState) => string | null;
    selectLastHydrated: (state: TGlobalState) => string | null;
}

/**
 * @public
 */
 export type IMetaSliceReducers <TSliceState, TStatusEnum, TError> = {
    reset: CaseReducer<TSliceState, PayloadAction>;
    setStatus: CaseReducer<TSliceState, PayloadAction<TStatusEnum>>;
    setError: CaseReducer<TSliceState, PayloadAction<TError | null>>;
    succeed: CaseReducer<TSliceState, PayloadAction<TStatusEnum>>;
    fail: CaseReducer<TSliceState, PayloadAction<{ status: TStatusEnum, error: TError | null }>>;
}
