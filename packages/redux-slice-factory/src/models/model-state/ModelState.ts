import { SerializedError } from '@reduxjs/toolkit'
import StatusEnum from '../../constants/StatusEnum'
import MetaState, { IMetaState } from '../meta-state'

/**
 * @public
 */
export interface IModelState<
    T,
    TStatusEnum extends keyof typeof StatusEnum | & string = keyof typeof StatusEnum,
    TError extends SerializedError = Error
> extends IMetaState<TStatusEnum, TError> {
    model: T;
}

const create = <
    T,
    TStatusEnum extends keyof typeof StatusEnum | & string = keyof typeof StatusEnum,
    TError extends SerializedError = Error
> (args: Partial<IModelState<T, TStatusEnum, TError>> = {}): IModelState<T, TStatusEnum, TError> => {
    const metaState = MetaState.create(args)
    return {
        ...metaState,
        model: args.model as T,
    }
}

/**
 * @public
 */
const ModelState = {
    create: create,
}

export default ModelState
