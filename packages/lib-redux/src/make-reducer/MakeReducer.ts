import { Reducer, createReducer } from '@reduxjs/toolkit';
import R from 'ramda';
import { IAction } from '../action';
import { IDictionary } from '../types';

const actionTypeSeparatorDefault = '__';

/**
 * create a dictionary of action types such that [verb]: noun__verb
 * @param {string} namespace -
 * @param {string} domain -
 * @param {Array<string>} verbs - verbs list
 * @param {string} separator -
 * @returns {IDictionary} - action types dictionary
 */
const createActionTypes = (
    namespace: string,
    domain: string,
    verbs: Array<string>,
    separator = actionTypeSeparatorDefault
): IDictionary<string> => {
    const list = R.filter((x: string) => Boolean(x), verbs); // remove falsy items
    return R.reduce(
        (acc: IDictionary<string>, verb: string) => {
            const actionType = R.join(separator, [namespace, domain, verb]);
            return R.assoc(verb, actionType, acc);
        },
        {},
        list
    );
};

type MakeReducerOptions = {
    actionTypeSeparator: string;
    actionHandlerDictionaryKeyBlacklist: Array<string>; // keys in the actionsDictionary that you dont want to used with the namespace/domain/verb creator
};

const createOptions = (options: Partial<MakeReducerOptions> = {}): MakeReducerOptions => {
    const o: MakeReducerOptions = {
        actionTypeSeparator: options.actionTypeSeparator ?? '__',
        actionHandlerDictionaryKeyBlacklist: options.actionHandlerDictionaryKeyBlacklist ?? []
    };

    return Object.freeze(o);
};

export type ActionHandlerDictionary<TState, TAction> = Record<string, (state: TState, action: IAction<TAction>) => TState>

/**
 * make a reducer
 * @param {string} namespace -
 * @param {string} domain -
 * @param {*} initialState -
 * @param {ActionHandlerDictionary} actionHandlerDictionary -
 * @param {MakeReducerOptions} options -
 * @returns {[Reducer, Record<string, string>]} - returns a reducers and a dictionary of qualified action types indexed by their action handler dictionary key
 */
const makeReducer = <TState, TActionPayload = any>(
    namespace: string,
    domain: string,
    initialState: TState,
    actionHandlerDictionary: ActionHandlerDictionary<TState, TActionPayload>,
    options?: Partial<MakeReducerOptions>
): [Reducer<TState>, Record<keyof ActionHandlerDictionary<TState, TActionPayload>, string>] => {
    const opts = createOptions(options);

    const verbs = R.without(
        opts.actionHandlerDictionaryKeyBlacklist,
        Object.keys(actionHandlerDictionary)
    );
    const actionTypes = createActionTypes(namespace, domain, verbs, opts.actionTypeSeparator);
    const actionTypesKeys = R.concat(
        Object.keys(actionTypes),
        opts.actionHandlerDictionaryKeyBlacklist
    );

    if (process.env.NODE_ENV !== 'production') {
        /* eslint-disable no-console */
        console.groupCollapsed(domain);

        console.group('initialState');
        console.log(initialState);
        console.groupEnd();

        console.group('actionTypes');
        console.table(actionTypes);
        console.groupEnd();

        console.group('actionTypesKeys');
        console.log(actionTypesKeys);
        console.groupEnd();

        console.groupEnd();
        /* eslint-enable no-console */
    }

    const handlerDictionary = R.reduce(
        (acc, verb: string) => {
            const actionType = actionTypes[verb] ?? verb;
            const action = actionHandlerDictionary[verb];
            return R.assoc(actionType, action, acc);
        },
        {},
        actionTypesKeys
    );

    const reducer = createReducer(initialState, handlerDictionary);

    return [reducer, actionTypes];
};

export default makeReducer;
