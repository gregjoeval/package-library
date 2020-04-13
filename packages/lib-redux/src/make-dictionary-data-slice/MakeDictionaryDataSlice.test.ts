import DataState, { IDataState } from '../data-state';
import { IDictionary } from '../types';
import makeDictionaryDataSlice, { IDictionaryDataSlice } from './MakeDictionaryDataSlice';

interface ITestModel {
    id: string;
    name: string;
    age: string;
}

type TestState = IDataState<IDictionary<ITestModel>>;

const alice: ITestModel = {
    id: '123abc',
    name: 'alice',
    age: '25'
};

const bob: ITestModel = {
    id: '456def',
    name: 'bob',
    age: '30'
};

const carl: ITestModel = {
    id: '789ghi',
    name: 'carl',
    age: '35'
};

describe('makeDictionaryDataSlice', () => {
    const testDomain = 'FooBarThing';
    let feature: IDictionaryDataSlice<ITestModel>;
    let state: TestState;

    beforeEach(() => {
        const initState = { data: {} };
        state = DataState.create(initState);
        feature = makeDictionaryDataSlice<ITestModel>(testDomain, (model) => model.id, initState);
    });

    it('initializes', () => {
        expect(feature.Domain).toEqual(testDomain);
        expect(typeof feature.Reducer).toEqual('function');
        expect(Object.values(feature.ActionTypes)).toHaveLength(7);
        expect(Object.values(feature.Actions)).toHaveLength(14);
    });

    it('does not affect state with unregistered action types', () => {
        // GIVEN
        const previousState = state;

        // WHEN
        state = feature.Reducer(state, { type: 'not_an_action' });

        // THEN
        expect(state).toEqual(previousState);
    });

    it('sets error property in state', () => {
        // GIVEN
        const previousState = state;
        const error = new Error('this was a test');

        // WHEN
        const nextState: TestState = feature.Reducer(state, feature.Actions.fail(error));

        // THEN
        expect(nextState.data).toEqual(previousState.data);
        expect(nextState.error).toEqual(error);
        expect(nextState.lastUpdated).toEqual(previousState.lastUpdated);
        expect(nextState.loading).toBe(previousState.loading);
    });

    it('sets data property in state with a dictionary after hydrate action creator', () => {
        // GIVEN
        const previousState = state;
        const previousData = {
            [alice.id]: alice,
            [bob.id]: {
                id: bob.id,
                name: 'bobby',
                age: bob.age
            }
        };
        const stateWithData = DataState.create({
            ...state,
            data: previousData
        });
        const data = {
            [alice.id]: alice,
            [bob.id]: bob,
            [carl.id]: carl
        };

        // WHEN
        const nextState: TestState = feature.Reducer(stateWithData, feature.Actions.hydrate(data));

        // THEN
        expect(nextState.data).toEqual(data);
        expect(nextState.error).toEqual(previousState.error);
        expect(nextState.lastUpdated).toBeTruthy();
        expect(nextState.loading).toBe(false);
    });

    it('sets data property in state with a list after hydrateList action creator', () => {
        // GIVEN
        const previousState = state;
        const previousData = {
            [alice.id]: alice,
            [bob.id]: {
                id: bob.id,
                name: 'bobby',
                age: bob.age
            }
        };
        const stateWithData = DataState.create({
            ...state,
            data: previousData
        });
        const data = {
            [bob.id]: bob,
            [carl.id]: carl
        };

        // WHEN
        const nextState: TestState = feature.Reducer(stateWithData, feature.Actions.hydrateWithList([bob, carl]));

        // THEN
        expect(nextState.data).toEqual(data);
        expect(nextState.error).toEqual(previousState.error);
        expect(nextState.lastUpdated).toBeTruthy();
        expect(nextState.loading).toBe(previousState.loading);
    });

    it('sets data property in state with an element after hydrateWithElement action creator', () => {
        // GIVEN
        const previousState = state;
        const previousData = {
            [alice.id]: alice,
            [bob.id]: {
                id: bob.id,
                name: 'bobby',
                age: bob.age
            },
            [carl.id]: carl
        };
        const stateWithData = DataState.create({
            ...state,
            data: previousData
        });
        const data = { [bob.id]: bob };

        // WHEN
        const nextState: TestState = feature.Reducer(stateWithData, feature.Actions.hydrateWithElement(bob));

        // THEN
        expect(nextState.data).toEqual(data);
        expect(nextState.error).toEqual(previousState.error);
        expect(nextState.lastUpdated).toBeTruthy();
        expect(nextState.loading).toBe(previousState.loading);
    });

    it('removes list of elements by id from data property in state after remove action creator', () => {
        // GIVEN
        const previousData = {
            [alice.id]: alice,
            [bob.id]: bob,
            [carl.id]: carl
        };
        const stateWithData = DataState.create({
            ...state,
            data: previousData
        });
        const data = { [bob.id]: bob };

        // WHEN
        const nextState: TestState = feature.Reducer(stateWithData, feature.Actions.remove([alice.id, carl.id]));

        // THEN
        expect(nextState.data).toEqual(data);
        expect(nextState.error).toEqual(stateWithData.error);
        expect(nextState.lastUpdated).toEqual(stateWithData.lastUpdated);
        expect(nextState.loading).toBe(false);
    });

    it('removes an element by id from data property in state after removeElementById action creator', () => {
        // GIVEN
        const previousData = {
            [alice.id]: alice,
            [bob.id]: bob,
            [carl.id]: carl
        };
        const stateWithData = DataState.create({
            ...state,
            data: previousData
        });
        const data = {
            [bob.id]: bob,
            [carl.id]: carl
        };

        // WHEN
        const nextState: TestState = feature.Reducer(stateWithData, feature.Actions.removeElementById(alice.id));

        // THEN
        expect(nextState.data).toEqual(data);
        expect(nextState.error).toEqual(stateWithData.error);
        expect(nextState.lastUpdated).toEqual(stateWithData.lastUpdated);
        expect(nextState.loading).toBe(false);
    });

    it('sets the loading property of state to true after request action creator', () => {
        // GIVEN
        const data = {
            [alice.id]: alice,
            [bob.id]: bob,
            [carl.id]: carl
        };
        const stateWithData = DataState.create({
            ...state,
            data
        });

        // WHEN
        const nextState: TestState = feature.Reducer(stateWithData, feature.Actions.request());

        // THEN
        expect(nextState.data).toEqual(stateWithData.data);
        expect(nextState.error).toEqual(stateWithData.error);
        expect(nextState.lastUpdated).toEqual(stateWithData.lastUpdated);
        expect(nextState.loading).toBe(true);
    });

    it('sets state to its initial state after reset action creator', () => {
        // GIVEN
        const previousState = state;
        const data = {
            [alice.id]: alice,
            [bob.id]: bob,
            [carl.id]: carl
        };
        const stateWithData = DataState.create({
            ...state,
            data
        });

        // WHEN
        const nextState: TestState = feature.Reducer(stateWithData, feature.Actions.reset());

        // THEN
        expect(nextState).toEqual(previousState);
    });

    it('sets data property of state after set action creator', () => {
        // GIVEN
        const previousState = state;
        const data = {
            [alice.id]: alice,
            [bob.id]: bob,
            [carl.id]: carl
        };

        // WHEN
        const nextState: TestState = feature.Reducer(state, feature.Actions.setWithList([alice, bob, carl]));

        // THEN
        expect(nextState.data).toEqual(data);
        expect(nextState.error).toEqual(previousState.error);
        expect(nextState.lastUpdated).toEqual(previousState.lastUpdated);
        expect(nextState.loading).toBe(previousState.loading);
    });

    it('updates data property of state with a dictionary after update action creator', () => {
        // GIVEN
        const previousState = state;
        const previousData = {
            [alice.id]: alice,
            [bob.id]: {
                id: bob.id,
                name: 'bobby',
                age: bob.age
            }
        };
        const stateWithData = DataState.create({
            ...state,
            data: previousData
        });
        const data = {
            [alice.id]: alice,
            [bob.id]: bob,
            [carl.id]: carl
        };

        // WHEN
        const nextState: TestState = feature.Reducer(stateWithData, feature.Actions.update(data));

        // THEN
        expect(nextState.data).toEqual(data);
        expect(nextState.error).toEqual(previousState.error);
        expect(nextState.lastUpdated).toEqual(previousState.lastUpdated);
        expect(nextState.loading).toBe(previousState.loading);
    });

    it('updates data property of state with a list after updateWithList action creator', () => {
        // GIVEN
        const previousState = state;
        const previousData = {
            [alice.id]: alice,
            [bob.id]: {
                id: bob.id,
                name: 'bobby',
                age: bob.age
            }
        };
        const stateWithData = DataState.create({
            ...state,
            data: previousData
        });
        const data = {
            [alice.id]: alice,
            [bob.id]: bob,
            [carl.id]: carl
        };

        // WHEN
        const nextState: TestState = feature.Reducer(stateWithData, feature.Actions.updateWithList([bob, carl]));

        // THEN
        expect(nextState.data).toEqual(data);
        expect(nextState.error).toEqual(previousState.error);
        expect(nextState.lastUpdated).toEqual(previousState.lastUpdated);
        expect(nextState.loading).toBe(previousState.loading);
    });

    it('updates data property of state with an element after updateWithElement action creator', () => {
        // GIVEN
        const previousState = state;
        const previousData = {
            [alice.id]: alice,
            [bob.id]: {
                id: bob.id,
                name: 'bobby',
                age: bob.age
            },
            [carl.id]: carl
        };
        const stateWithData = DataState.create({
            ...state,
            data: previousData
        });
        const data = {
            [alice.id]: alice,
            [bob.id]: bob,
            [carl.id]: carl
        };

        // WHEN
        const nextState: TestState = feature.Reducer(stateWithData, feature.Actions.updateWithElement(bob));

        // THEN
        expect(nextState.data).toEqual(data);
        expect(nextState.error).toEqual(previousState.error);
        expect(nextState.lastUpdated).toEqual(previousState.lastUpdated);
        expect(nextState.loading).toBe(previousState.loading);
    });
});
