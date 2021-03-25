import { CaseReducerActions, Reducer, SliceCaseReducers } from '@reduxjs/toolkit'
import StatusEnum from '../constants/StatusEnum'

/**
 * @public
 */
export interface ISliceSelectors<
    TGlobalState,
    TSliceState
> {
    selectSliceState: (state: TGlobalState) => TSliceState;
    selectShouldFetch: (reFetchOnError?: boolean, overwriteAllData?: boolean) => (state: TGlobalState) => boolean;
}

/**
 * @public
 */
export interface ISlice <
    TGlobalState,
    TSliceState,
    TCaseReducers extends SliceCaseReducers<TSliceState>,
    TSliceSelectors extends ISliceSelectors<TGlobalState, TSliceState>
> {
    name: string;
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
    TError extends Error = Error
> {
    selectStatus: (state: TGlobalState) => TStatusEnum;
    selectError: (state: TGlobalState) => TError | null;
    selectLastModified: (state: TGlobalState) => string | null;
    selectLastHydrated: (state: TGlobalState) => string | null;
}
