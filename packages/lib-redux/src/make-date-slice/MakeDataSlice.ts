import { Reducer } from '@reduxjs/toolkit';
import * as R from 'ramda';
import Action, { IAction, ITimeStampMeta } from '../action';
import { ActionVerb } from '../constants/ActionVerb';
import DataState, { IDataState } from '../data-state';
import makeReducer from '../make-reducer';

type DataStateReducer<TData, TAction> = (state: IDataState<TData>, action: IAction<TAction>) => IDataState<TData>;

export interface IDataSliceActionHandlers<TData> {
    [ActionVerb.FAIL]: DataStateReducer<TData, Error>;
    [ActionVerb.HYDRATE]: DataStateReducer<TData, TData>;
    [ActionVerb.REMOVE]: DataStateReducer<TData, Array<string>>;
    [ActionVerb.REQUEST]: DataStateReducer<TData, void>;
    [ActionVerb.RESET]: DataStateReducer<TData, void>;
    [ActionVerb.SET]: DataStateReducer<TData, TData>;
    [ActionVerb.UPDATE]: DataStateReducer<TData, Partial<TData>>;
}

interface IMakeDataSliceOptionsArguments<TData> {
    namespace: string;
    actionTypeSeparator: string;
    initialState: Partial<IDataState<TData>>;
    actionHandlers: Partial<IDataSliceActionHandlers<TData>>;
}

interface IMakeDataSliceOptions<TData> extends IMakeDataSliceOptionsArguments<TData> {
    initialState: IDataState<TData>;
    actionHandlers: IDataSliceActionHandlers<TData>;
}

const createOptions = <TData extends Record<string, any>> (args: Partial<IMakeDataSliceOptionsArguments<TData>> = {}): IMakeDataSliceOptions<TData> => {
    const namespace = args.namespace ?? 'App';
    const actionTypeSeparator = args.actionTypeSeparator ?? '__';
    const initialDataState = DataState.create<TData>(args.initialState ?? { data: Object() });
    const actionHandlersDefaults: IDataSliceActionHandlers<TData> = {
        FAIL: (state, action) => DataState.create({
            data: state.data,
            error: action.payload,
            lastUpdated: state.lastUpdated,
            loading: false
        }),
        HYDRATE: (state, action) => DataState.create({
            data: action.payload,
            error: initialDataState.error,
            lastUpdated: action.meta.timeStamp,
            loading: false
        }),
        REMOVE: (state, action) => {
            const data = R.omit(action.payload, state.data) as TData; // keep this for now, technically if TData was a model (not a collection of models) it would be a Partial<TData> which is invalid
            return DataState.create({
                data: data,
                error: initialDataState.error,
                lastUpdated: state.lastUpdated,
                loading: state.loading
            });
        },
        REQUEST: (state) => DataState.create({
            data: state.data,
            error: initialDataState.error,
            lastUpdated: state.lastUpdated,
            loading: true
        }),
        RESET: () => initialDataState,
        SET: (state, action) => DataState.create({
            data: action.payload,
            error: initialDataState.error,
            lastUpdated: state.lastUpdated,
            loading: initialDataState.loading
        }),
        UPDATE: (state, action) => {
            const data = R.mergeDeepRight(state.data, action.payload) as TData; // keep this for now, technically if TData was a model (not a collection of models) it would be a Partial<TData> which is invalid;
            return DataState.create({
                data: data,
                error: initialDataState.error,
                lastUpdated: state.lastUpdated,
                loading: initialDataState.loading
            });
        }
    };

    return {
        namespace: namespace,
        actionTypeSeparator: actionTypeSeparator,
        initialState: initialDataState,
        actionHandlers: {
            ...actionHandlersDefaults,
            ...args.actionHandlers
        }
    };
};

export interface IDataSliceActions<TData> {
    fail: (error: Error) => IAction<Error>;
    hydrate: (model: TData) => IAction<TData>;
    remove: (idList: Array<string>) => IAction<Array<string>>;
    request: () => IAction<void>;
    reset: () => IAction<void>;
    set: (model: TData) => IAction<TData>;
    update: (model: Partial<TData>) => IAction<Partial<TData>>;
}

export interface IDataSlice<TData> {
    Domain: string;
    Reducer: Reducer<IDataState<TData>>;
    Actions: IDataSliceActions<TData>;
    ActionTypes: Record<keyof IDataSliceActionHandlers<TData>, string>;
}

const makeDataSlice = <TData extends Record<string, any>>(
    domain: string,
    options?: Partial<IMakeDataSliceOptionsArguments<TData>>
): IDataSlice<TData> => {
    type State = IDataState<TData>;

    const opts = createOptions<TData>(options);

    const actionHandlerDictionary = {
        [ActionVerb.FAIL]: opts.actionHandlers.FAIL,
        [ActionVerb.HYDRATE]: opts.actionHandlers.HYDRATE,
        [ActionVerb.REMOVE]: opts.actionHandlers.REMOVE,
        [ActionVerb.REQUEST]: opts.actionHandlers.REQUEST,
        [ActionVerb.RESET]: opts.actionHandlers.RESET,
        [ActionVerb.SET]: opts.actionHandlers.SET,
        [ActionVerb.UPDATE]: opts.actionHandlers.UPDATE
    };

    const [reducer, actionTypeDictionary] = makeReducer<State>(opts.namespace, domain, opts.initialState, actionHandlerDictionary, { actionTypeSeparator: opts.actionTypeSeparator });

    /**
     * sets that there was an error with the resource (e.g. the request failed)
     * @param {Error} error -
     * @return {IAction} - action
     */
    const fail = (error: Error): IAction<Error> => Action.create(actionTypeDictionary.FAIL, error, true);

    /**
     * add/remove/update element or elements from a data source
     * @param {TData} model -
     * @return {IAction<TData>} - action
     */
    const hydrate = (model: TData): IAction<TData, ITimeStampMeta> => Action.create(actionTypeDictionary.HYDRATE, model, false, { timeStamp: new Date().toISOString() });

    /**
     * deletes an array of elements from the resource
     * @param {Array<string>} elementIdList -
     * @return {IAction<Array<string>>} - action
     */
    const remove = (elementIdList: Array<string>): IAction<Array<string>> => Action.create(actionTypeDictionary.REMOVE, elementIdList);

    /**
     * sets that the resource is being requested
     * @return {IAction} - action
     */
    const request = (): IAction<void> => Action.create(actionTypeDictionary.REQUEST);

    /**
     * resets the resource
     * @return {IAction} - action
     */
    const reset = (): IAction<void> => Action.create(actionTypeDictionary.RESET);

    /**
     * sets the elements in the resource
     * @param {TData} element
     * @return {IAction<TData>} - action
     */
    const set = (element: TData): IAction<TData> => Action.create(actionTypeDictionary.SET, element);

    /**
     * updates the resource
     * updates/adds element
     * @param {TData} element -
     * @return {IAction<TData>} - action
     */
    const update = (element: Partial<TData>): IAction<Partial<TData>> => Action.create(actionTypeDictionary.UPDATE, element);

    const actions: IDataSliceActions<TData> = {
        fail: fail,
        hydrate: hydrate,
        remove: remove,
        request: request,
        reset: reset,
        set: set,
        update: update
    };

    return {
        Domain: domain,
        Reducer: reducer,
        Actions: actions,
        ActionTypes: actionTypeDictionary
    };
};

export default makeDataSlice;
