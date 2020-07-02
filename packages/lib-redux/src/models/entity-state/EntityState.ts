import { EntityState as ReduxEntityState } from '@reduxjs/toolkit';
import StateStatusEnum from '../../constants/StateStatusEnum';
import MetaState, { IMetaState } from '../meta-state';

export interface IEntityState<
    T,
    TStatusEnum extends keyof typeof StateStatusEnum = keyof typeof StateStatusEnum,
    TError extends Error = Error
    > extends ReduxEntityState<T>, IMetaState<TStatusEnum, TError> {}

const create = <
    T,
    TStatusEnum extends keyof typeof StateStatusEnum = keyof typeof StateStatusEnum,
    TError extends Error = Error
    > (args: Partial<IEntityState<T, TStatusEnum, TError>> = {}): IEntityState<T, TStatusEnum, TError> => {
    const metaState = MetaState.create(args);
    return {
        ...metaState,
        ids: args.ids ?? [],
        entities: args.entities ?? {}
    };
};

const EntityState = {
    create: create
};

export default EntityState;
