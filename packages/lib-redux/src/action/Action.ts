import { Action as ReduxAction } from 'redux';

export interface ITimeStampMeta {
    timeStamp: string;
}

export interface IAction<T, TMeta = any> extends ReduxAction<string> {
    payload: T;
    error: boolean;
    meta: TMeta;
}

const create = <T, TMeta = any>(type: string, payload: T = Object(), error = false, meta: any = {}): IAction<T, TMeta> => ({
    type: type,
    payload: payload,
    error: error,
    meta: meta
});

const Action = { create: create };

export default Action;
