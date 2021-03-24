import StatusEnum from './constants/StatusEnum'
import { IEntityState } from './models/entity-state'
import { IMetaState } from './models/meta-state'
import { IModelState } from './models/model-state'
import createEntitySlice, { IEntitySlice, IEntitySliceReducers, IEntitySliceSelectors, ICreateEntitySliceOptions } from './slice-factories/create-entity-slice'
import createModelSlice, { IModelSlice, IModelSliceReducers, IModelSliceSelectors, ICreateModelSliceOptions } from './slice-factories/create-model-slice'
import { ISlice, ISliceSelectors, IMetaSliceSelectors } from './types'

export {
    // Generics
    ISlice,
    ISliceSelectors,

    // Meta Slice
    StatusEnum,
    IMetaState,
    IMetaSliceSelectors,

    // Model Slice
    createModelSlice,
    IModelState,
    IModelSlice,
    IModelSliceReducers,
    IModelSliceSelectors,
    ICreateModelSliceOptions,

    // Entity Slice
    createEntitySlice,
    IEntityState,
    IEntitySlice,
    IEntitySliceReducers,
    IEntitySliceSelectors,
    ICreateEntitySliceOptions,
}
