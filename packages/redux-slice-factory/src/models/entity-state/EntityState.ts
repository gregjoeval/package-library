import { EntityState as ReduxEntityState } from '@reduxjs/toolkit';
import StatusEnum from '../../constants/StatusEnum';
import MetaState, { IMetaState } from '../meta-state';

/**
 * @public
 */
export interface IEntityState<
    T,
    TStatusEnum extends keyof typeof StatusEnum | & string = keyof typeof StatusEnum,
    TError extends Error = Error
    > extends ReduxEntityState<T>, IMetaState<TStatusEnum, TError> {}

const create = <
    T,
    TStatusEnum extends keyof typeof StatusEnum | & string = keyof typeof StatusEnum,
    TError extends Error = Error
    > (args: Partial<IEntityState<T, TStatusEnum, TError>> = {}): IEntityState<T, TStatusEnum, TError> => {
    const metaState = MetaState.create(args);
    return {
        ...metaState,
        ids: args.ids ?? [],
        entities: args.entities ?? {}
    };
};

/**
 * @public
 */
const EntityState = {
    create: create
};

export default EntityState;
