export type IDataState<T> = {
    loading: boolean;
    data: T;
    error: Error | null;
    lastUpdated: string | null;
};

const create = <T>(args: Partial<IDataState<T>> = {}): IDataState<T> => ({
    loading: args.loading ?? false,
    data: args.data as T,
    error: args.error ?? null,
    lastUpdated: args.lastUpdated ?? null
});

const DataState = { create: create };

export default DataState;
