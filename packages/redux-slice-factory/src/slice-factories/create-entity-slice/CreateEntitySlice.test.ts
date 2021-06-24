import StatusEnum from '../../constants/StatusEnum'
import EntityState, { IEntityState } from '../../models/entity-state'
import { getISOStringWithOffset, mapErrorToSerializableObject } from '../../utilities'
import createEntitySlice, { IEntitySlice } from './CreateEntitySlice'

enum UsersSliceStatusEnum {
    Settled = 'Settled',
    Requesting = 'Requesting',
    Failed = 'Failed',
    Saving = 'Saving',
    Saved = 'Saved',
}

interface ITestUserModel {
    id: string;
    name: string;
    age: string;
}

const alice: ITestUserModel = {
    id: '123abc',
    name: 'alice',
    age: '25',
}

const bob: ITestUserModel = {
    id: '456def',
    name: 'bob',
    age: '30',
}

const carl: ITestUserModel = {
    id: '789ghi',
    name: 'carl',
    age: '35',
}

describe('createEntitySlice', () => {
    const testName = 'FooBarThing'
    let sliceState: IEntityState<ITestUserModel>
    let slice: IEntitySlice<Record<string, unknown>, ITestUserModel, keyof typeof UsersSliceStatusEnum>

    beforeEach(() => {
        sliceState = EntityState.create<ITestUserModel>()
        slice = createEntitySlice<Record<typeof testName, unknown>, ITestUserModel, keyof typeof UsersSliceStatusEnum>({
            name: testName,
            selectSliceState: () => sliceState,
            selectId: (model) => model.id,
            sortComparer: (a, b) => a.name.localeCompare(b.name),
        })
    })

    it('initializes', () => {
        expect(slice.name).toEqual(testName)
        expect(typeof slice.reducer).toEqual('function')
        expect(Object.values(slice.actions)).toHaveLength(16)
        expect(Object.values(slice.selectors)).toHaveLength(12)
    })

    it('does not affect state with unregistered action types', () => {
        // GIVEN
        const previousState = sliceState

        // WHEN
        const nextState = slice.reducer(sliceState, { type: 'not_an_action' })

        // THEN
        expect(nextState).toEqual(previousState)
    })

    it('sets error property in state', () => {
        // GIVEN
        const previousState = sliceState
        const error = new Error('this was a test')

        // WHEN
        const nextState = slice.reducer(sliceState, slice.actions.setError(mapErrorToSerializableObject(error)))

        // THEN
        expect(nextState.ids).toEqual(previousState.ids) // should be unaffected
        expect(nextState.entities).toEqual(previousState.entities) // should be unaffected
        expect(nextState.error).toEqual(mapErrorToSerializableObject(error))
        expect(nextState.status).toEqual(previousState.status) // should be unaffected
        expect(nextState.lastModified).toEqual(previousState.lastModified) // should be unaffected
        expect(nextState.lastHydrated).toEqual(previousState.lastHydrated) // should be unaffected
    })

    it('sets status property in state', () => {
        // GIVEN
        const previousState = sliceState
        const status = StatusEnum.Requesting

        // WHEN
        const nextState = slice.reducer(sliceState, slice.actions.setStatus(status))

        // THEN
        expect(nextState.ids).toEqual(previousState.ids) // should be unaffected
        expect(nextState.entities).toEqual(previousState.entities) // should be unaffected
        expect(nextState.error).toEqual(previousState.error) // should be unaffected
        expect(nextState.status).toEqual(status)
        expect(nextState.lastModified).toEqual(previousState.lastModified) // should be unaffected
        expect(nextState.lastHydrated).toEqual(previousState.lastHydrated) // should be unaffected
    })

    it('sets status property in state to custom value', () => {
        // GIVEN
        const previousState = sliceState
        const status = UsersSliceStatusEnum.Saving

        // WHEN
        const nextState = slice.reducer(sliceState, slice.actions.setStatus(status))

        // THEN
        expect(nextState.ids).toEqual(previousState.ids) // should be unaffected
        expect(nextState.entities).toEqual(previousState.entities) // should be unaffected
        expect(nextState.error).toEqual(previousState.error) // should be unaffected
        expect(nextState.status).toEqual(status)
        expect(nextState.lastModified).toEqual(previousState.lastModified) // should be unaffected
        expect(nextState.lastHydrated).toEqual(previousState.lastHydrated) // should be unaffected
    })

    it('hydrates state with data', () => {
        // GIVEN
        const previousData = {
            [alice.id]: alice,
            [bob.id]: {
                id: bob.id,
                name: 'bobby',
                age: bob.age,
            },
        }
        const previousStateWithData = EntityState.create({
            ...sliceState,
            ids: Object.keys(previousData),
            entities: previousData,
        })
        const data = {
            [alice.id]: alice,
            [bob.id]: bob,
            [carl.id]: carl,
        }

        // WHEN
        const nextState = slice.reducer(previousStateWithData, slice.actions.hydrateAll(data))

        // THEN
        expect(nextState.ids).toEqual(Object.keys(data))
        expect(nextState.entities).toEqual(data)
        expect(nextState.error).toEqual(previousStateWithData.error) // should be unaffected
        expect(nextState.status).toEqual(previousStateWithData.status) // should be unaffected
        expect(nextState.lastModified).toEqual(null)
        expect(nextState.lastHydrated).toBeTruthy()
    })

    it('modifies state with data', () => {
        // GIVEN
        const previousData = {
            [alice.id]: alice,
            [bob.id]: {
                id: bob.id,
                name: 'bobby',
                age: bob.age,
            },
        }
        const previousStateWithData = EntityState.create({
            ...sliceState,
            ids: Object.keys(previousData),
            entities: previousData,
        })
        const data = {
            [alice.id]: alice,
            [bob.id]: bob,
            [carl.id]: carl,
        }

        // WHEN
        const nextState = slice.reducer(previousStateWithData, slice.actions.setAll(data))

        // THEN
        expect(nextState.ids).toEqual(Object.keys(data))
        expect(nextState.entities).toEqual(data)
        expect(nextState.error).toEqual(previousStateWithData.error) // should be unaffected
        expect(nextState.status).toEqual(previousStateWithData.status) // should be unaffected
        expect(nextState.lastModified).toBeTruthy()
        expect(nextState.lastHydrated).toEqual(previousStateWithData.lastHydrated) // should be unaffected
    })

    it('resets state', () => {
        // GIVEN
        const initialState = sliceState
        const previousData = {
            [alice.id]: alice,
            [bob.id]: {
                id: bob.id,
                name: 'bobby',
                age: bob.age,
            },
        }
        const previousStateWithData = EntityState.create({
            ids: Object.keys(previousData),
            entities: previousData,
            status: StatusEnum.Failed,
            error: new Error('Oopsie Doopsie'),
            lastHydrated: getISOStringWithOffset(),
            lastModified: getISOStringWithOffset(),
        })

        // WHEN
        const nextState = slice.reducer(previousStateWithData, slice.actions.reset())

        // THEN
        expect(nextState).toEqual(initialState)
        expect(nextState.ids).toEqual(initialState.ids)
        expect(nextState.entities).toEqual(initialState.entities)
        expect(nextState.error).toEqual(initialState.error)
        expect(nextState.status).toEqual(initialState.status)
        expect(nextState.lastModified).toEqual(initialState.lastModified)
        expect(nextState.lastHydrated).toEqual(initialState.lastHydrated)
    })
})
