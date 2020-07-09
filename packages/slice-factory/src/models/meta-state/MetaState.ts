import StateStatusEnum from '../../constants/StateStatusEnum';

export interface IMetaState <TStatusEnum extends keyof typeof StateStatusEnum = keyof typeof StateStatusEnum, TError extends Error = Error> {
    status: TStatusEnum;
    error: TError | null;
    lastModified: string | null;
    lastHydrated: string | null;
}

const create = <
    TStatusEnum extends keyof typeof StateStatusEnum = keyof typeof StateStatusEnum,
    TError extends Error = Error
    > (args: Partial<IMetaState<TStatusEnum, TError>> = {}): IMetaState<TStatusEnum, TError> => ({
        status: args.status ?? StateStatusEnum.Settled as TStatusEnum,
        error: args.error ?? null,
        lastModified: args.lastModified ?? null,
        lastHydrated: args.lastHydrated ?? null
    });

const MetaState = {
    create: create
};

export default MetaState;
