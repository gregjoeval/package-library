import _ from 'lodash';
import Action, { IAction } from '../action';
import { IDataState } from '../data-state';
import makeDataSlice, {
    IDataSlice,
    IDataSliceActions
} from '../make-data-slice';
import { IDictionary } from '../types';

export interface IDictionaryDataSliceActions<T> extends IDataSliceActions<IDictionary<T>> {
    hydrateWithList: (elementList: Array<T>) => IAction<IDictionary<T>>;
    hydrateWithElement: (element: T) => IAction<IDictionary<T>>;
    removeElementById: (elementId: string) => IAction<Array<string>>;
    updateWithList: (elementList: Array<T>) => IAction<IDictionary<T>>;
    updateWithElement: (element: T) => IAction<IDictionary<T>>;
    setWithList: (elementList: Array<T>) => IAction<IDictionary<T>>;
    setWithElement: (element: T) => IAction<IDictionary<T>>;
}

export interface IDictionaryDataSlice<TData> extends IDataSlice<IDictionary<TData>> {
    Actions: IDictionaryDataSliceActions<TData>;
}

const makeDictionaryDataSlice = <TElement>(
    domain: string,
    keyFunction: (arg: TElement) => string,
    initialState?: Partial<IDataState<IDictionary<TElement>>>,
    namespace?: string,
    actionTypeSeparator?: string
): IDictionaryDataSlice<TElement> => {
    const { Domain, Reducer, Actions, ActionTypes } = makeDataSlice<IDictionary<TElement>>(domain, {
        namespace: namespace,
        actionTypeSeparator: actionTypeSeparator,
        initialState: initialState
    });

    /**
     * hydrates the resource with a dictionary from a list of elements
     * @param {Array<TElement>} elementList -
     * @return {IAction<IDictionary<TElement>>} - action
     */
    const hydrateWithList = (elementList: Array<TElement>): IAction<IDictionary<TElement>> => {
        const elementDictionary = _.keyBy(elementList, keyFunction);
        return Action.create(ActionTypes.HYDRATE, elementDictionary, false, { timeStamp: new Date().toISOString() });
    };
    /**
     * hydrates the resource wtih a dictionary from a single element
     * @param {TElement} element -
     * @return {IAction<IDictionary<TElement>>} - action
     */
    const hydrateWithElement = (element: TElement): IAction<IDictionary<TElement>> => hydrateWithList([element]);
    /**
     * removes a single element from the resource by ID
     * @param {string} elementId -
     * @return {IAction<Array<string>>} - action
     */
    const removeElementById = (elementId: string): IAction<Array<string>> => Action.create(ActionTypes.REMOVE, [elementId]);
    /**
     * updates the resource with a dictionary from a list of elements
     * @param {Array<TElement>} elementList -
     * @return {IAction<IDictionary<TElement>>} - action
     */
    const updateWithList = (elementList: Array<TElement>): IAction<IDictionary<TElement>> => {
        const elementDictionary = _.keyBy(elementList, keyFunction);
        return Action.create(ActionTypes.UPDATE, elementDictionary);
    };
    /**
     * updates the resource with a dictionary from a single element
     * updates/adds a single element
     * @param {TElement} element -
     * @return {IAction<IDictionary<TElement>>} - action
     */
    const updateWithElement = (element: TElement): IAction<IDictionary<TElement>> => updateWithList([element]);
    /**
     * sets a dictionary from a list elements in the resource
     * @param {Array<TElement>} elementList -
     * @return {IAction<IDictionary<TElement>>} - action
     */
    const setWithList = (elementList: Array<TElement>): IAction<IDictionary<TElement>> => {
        const elementDictionary = _.keyBy(elementList, keyFunction);
        return Action.create(ActionTypes.SET, elementDictionary);
    };
    /**
     * sets a dictionary from a single element in the resource
     * @param {Array<TElement>} element -
     * @return {IAction<IDictionary<TElement>>} - action
     */
    const setWithElement = (element: TElement): IAction<IDictionary<TElement>> => setWithList([element]);

    const extendedActions: IDictionaryDataSliceActions<TElement> = {
        ...Actions,
        hydrateWithList,
        removeElementById,
        hydrateWithElement,
        updateWithList,
        updateWithElement,
        setWithList,
        setWithElement
    };

    return {
        Domain: Domain,
        Reducer: Reducer,
        Actions: extendedActions,
        ActionTypes: ActionTypes
    };
};

export default makeDictionaryDataSlice;
