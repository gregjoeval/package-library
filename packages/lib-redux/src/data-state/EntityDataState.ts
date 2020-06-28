import { EntityState } from '@reduxjs/toolkit';

export enum DataStateStatusEnum {
    Settled = 'Settled',
    Requesting = 'Requesting',
    Failed = 'Failed',
}

export interface IEntityDataState<T> extends EntityState<T> {
    status: DataStateStatusEnum;
    error: Error | null;
    lastModified: string | null;
    lastHydrated: string | null;
}

const create = <T>(args: Partial<IEntityDataState<T>> = {}): IEntityDataState<T> => ({
    status: args.status ?? DataStateStatusEnum.Settled,
    ids: args.ids ?? [],
    entities: args.entities ?? {},
    error: args.error ?? null,
    lastModified: args.lastModified ?? null,
    lastHydrated: args.lastHydrated ?? null
});

const EntityDataState = { create: create };

export default EntityDataState;
