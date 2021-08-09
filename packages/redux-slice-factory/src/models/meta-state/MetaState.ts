import { SerializedError } from '@reduxjs/toolkit'
import StatusEnum from '../../constants/StatusEnum'

/**
 * @public
 */
export interface IMetaState <TStatusEnum extends keyof typeof StatusEnum | & string = keyof typeof StatusEnum, TError extends SerializedError = SerializedError> {
    status: TStatusEnum;
    error: TError | null;
    lastModified: string | null;
    lastHydrated: string | null;
}

const create = <
    TStatusEnum extends keyof typeof StatusEnum | & string = keyof typeof StatusEnum,
    TError extends SerializedError = Error
> (args: Partial<IMetaState<TStatusEnum, TError>> = {}): IMetaState<TStatusEnum, TError> => ({
    status: args.status ?? StatusEnum.Settled as unknown as TStatusEnum,
    error: args.error ?? null,
    lastModified: args.lastModified ?? null,
    lastHydrated: args.lastHydrated ?? null,
})

/**
 * @public
 */
const MetaState = {
    create: create,
}

export default MetaState
