import makeEntitySlice from './higher-order-slices/make-entity-slice';
import type { IEntitySlice, IEntitySliceReducers, IEntitySliceSelectors } from './higher-order-slices/make-entity-slice';
import makeModelSlice from './higher-order-slices/make-model-slice';
import type { IModelSlice, IModelSliceReducers, IModelSliceSelectors } from './higher-order-slices/make-model-slice';
import { ISlice, ISliceSelectors, IMetaSliceSelectors } from './types';

export {
    makeEntitySlice,
    makeModelSlice
};

export type {
    ISlice,
    ISliceSelectors,
    IMetaSliceSelectors,
    IEntitySlice,
    IEntitySliceReducers,
    IEntitySliceSelectors,
    IModelSlice,
    IModelSliceReducers,
    IModelSliceSelectors
};
