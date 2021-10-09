import { CaseReducer, PayloadAction, SliceCaseReducers } from "@reduxjs/toolkit";
import { IMetaState } from "../..";

export interface IMetaSliceReducers<TSliceState, TStatusEnum, TError> extends SliceCaseReducers<TSliceState> {
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
     setMetaState: CaseReducer<TSliceState, PayloadAction<Partial<IMetaState<TStatusEnum, TError>>>>;
}
