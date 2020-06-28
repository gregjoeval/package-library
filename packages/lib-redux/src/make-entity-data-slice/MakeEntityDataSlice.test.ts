import EntityDataState, { DataStateStatusEnum, IEntityDataState } from '../data-state/EntityDataState';
import makeEntityDataSlice, { IEntityDataSlice } from './MakeEntityDataSlice';

interface ITestModel {
    id: string;
    name: string;
    age: string;
}

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

describe('makeEntityDataSlice', () => {
    const testDomain = 'FooBarThing';
    let feature: IEntityDataSlice<ITestModel>;
    let state: IEntityDataState<ITestModel>;

    beforeEach(() => {
        state = EntityDataState.create<ITestModel>();
        feature = makeEntityDataSlice<ITestModel>(
            testDomain,
            (model) => model.id,
            (a, b) => a.name.localeCompare(b.name)
        );
    });

    it('initializes', () => {
        expect(feature.Domain).toEqual(testDomain);
        expect(typeof feature.Reducer).toEqual('function');
        expect(Object.values(feature.Actions)).toHaveLength(15);
        expect(Object.values(feature.Selectors)).toHaveLength(5);
    });

    it('does not affect state with unregistered action types', () => {
        // GIVEN
        const previousState = state;

        // WHEN
        const nextState = feature.Reducer(state, { type: 'not_an_action' });

        // THEN
        expect(nextState).toEqual(previousState);
    });

    it('sets error property in state', () => {
        // GIVEN
        const previousState = state;
        const error = new Error('this was a test');

        // WHEN
        const nextState = feature.Reducer(state, feature.Actions.setError(error));

        // THEN
        expect(nextState.ids).toEqual(previousState.ids); // should be unaffected
        expect(nextState.entities).toEqual(previousState.entities); // should be unaffected
        expect(nextState.error).toEqual(error);
        expect(nextState.status).toEqual(previousState.status); // should be unaffected
        expect(nextState.lastModified).toEqual(previousState.lastModified); // should be unaffected
        expect(nextState.lastHydrated).toBe(previousState.lastHydrated); // should be unaffected
    });

    it('sets status property in state', () => {
        // GIVEN
        const previousState = state;
        const status = DataStateStatusEnum.Requesting;

        // WHEN
        const nextState = feature.Reducer(state, feature.Actions.setStatus(status));

        // THEN
        expect(nextState.ids).toEqual(previousState.ids); // should be unaffected
        expect(nextState.entities).toEqual(previousState.entities); // should be unaffected
        expect(nextState.error).toEqual(previousState.error); // should be unaffected
        expect(nextState.status).toEqual(status);
        expect(nextState.lastModified).toEqual(previousState.lastModified); // should be unaffected
        expect(nextState.lastHydrated).toBe(previousState.lastHydrated); // should be unaffected
    });

    it('hydrates state with data', () => {
        // GIVEN
        const previousData = {
            [alice.id]: alice,
            [bob.id]: {
                id: bob.id,
                name: 'bobby',
                age: bob.age
            }
        };
        const previousStateWithData = EntityDataState.create({
            ...state,
            ids: Object.keys(previousData),
            entities: previousData
        });
        const data = {
            [alice.id]: alice,
            [bob.id]: bob,
            [carl.id]: carl
        };

        // WHEN
        const nextState = feature.Reducer(previousStateWithData, feature.Actions.hydrateAll(data));

        // THEN
        expect(nextState.ids).toEqual(Object.keys(data));
        expect(nextState.entities).toEqual(data);
        expect(nextState.error).toEqual(previousStateWithData.error); // should be unaffected
        expect(nextState.status).toBe(previousStateWithData.status); // should be unaffected
        expect(nextState.lastModified).toEqual(null);
        expect(nextState.lastHydrated).toBeTruthy();
    });

    it('modifies state with data', () => {
        // GIVEN
        const previousData = {
            [alice.id]: alice,
            [bob.id]: {
                id: bob.id,
                name: 'bobby',
                age: bob.age
            }
        };
        const previousStateWithData = EntityDataState.create({
            ...state,
            ids: Object.keys(previousData),
            entities: previousData
        });
        const data = {
            [alice.id]: alice,
            [bob.id]: bob,
            [carl.id]: carl
        };

        // WHEN
        const nextState = feature.Reducer(previousStateWithData, feature.Actions.setAll(data));

        // THEN
        expect(nextState.ids).toEqual(Object.keys(data));
        expect(nextState.entities).toEqual(data);
        expect(nextState.error).toEqual(previousStateWithData.error); // should be unaffected
        expect(nextState.status).toBe(previousStateWithData.status); // should be unaffected
        expect(nextState.lastModified).toBeTruthy();
        expect(nextState.lastHydrated).toEqual(previousStateWithData.lastHydrated); // should be unaffected
    });
});
