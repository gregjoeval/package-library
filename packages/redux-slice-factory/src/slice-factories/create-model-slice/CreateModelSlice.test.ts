import { describe, beforeEach, it, expect } from '@jest/globals'
import { miniSerializeError, SerializedError } from '@reduxjs/toolkit'
import merge from 'ts-deepmerge'
import StatusEnum from '../../constants/StatusEnum'
import ModelState, { IModelState } from '../../models/model-state'
import { getISOString } from '../../utilities'
import createModelSlice, { IModelSlice } from './CreateModelSlice'

enum UserSliceStatusEnum {
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

describe('createModelSlice', () => {
    const testName = 'FooBarThing'
    let sliceState: IModelState<ITestUserModel, keyof typeof UserSliceStatusEnum, SerializedError>
    let slice: IModelSlice<Record<string, unknown>, ITestUserModel, keyof typeof UserSliceStatusEnum, SerializedError>

    beforeEach(() => {
        sliceState = ModelState.create<ITestUserModel>()
        slice = createModelSlice<Record<typeof testName, unknown>, ITestUserModel, keyof typeof UserSliceStatusEnum, SerializedError>({
            name: testName,
            handleUpdate: merge,
            selectSliceState: () => sliceState,
        })
    })

    it('initializes', () => {
        expect(slice.name).toEqual(testName)
        expect(typeof slice.reducer).toEqual('function')
        expect(Object.values(slice.actions)).toHaveLength(7)
        expect(Object.values(slice.selectors)).toHaveLength(8)
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
        const nextState = slice.reducer(sliceState, slice.actions.setError(miniSerializeError(error)))

        // THEN
        expect(nextState.model).toEqual(previousState.model) // should be unaffected
        expect(nextState.error).toEqual(miniSerializeError(error))
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
        expect(nextState.model).toEqual(previousState.model) // should be unaffected
        expect(nextState.error).toEqual(previousState.error) // should be unaffected
        expect(nextState.status).toEqual(status)
        expect(nextState.lastModified).toEqual(previousState.lastModified) // should be unaffected
        expect(nextState.lastHydrated).toEqual(previousState.lastHydrated) // should be unaffected
    })

    it('sets status property in state to custom value', () => {
        // GIVEN
        const previousState = sliceState
        const status = UserSliceStatusEnum.Saving

        // WHEN
        const nextState = slice.reducer(sliceState, slice.actions.setStatus(status))

        // THEN
        expect(nextState.model).toEqual(previousState.model) // should be unaffected
        expect(nextState.error).toEqual(previousState.error) // should be unaffected
        expect(nextState.status).toEqual(status)
        expect(nextState.lastModified).toEqual(previousState.lastModified) // should be unaffected
        expect(nextState.lastHydrated).toEqual(previousState.lastHydrated) // should be unaffected
    })

    it('hydrates state with data', () => {
        // GIVEN
        const previousData = {
            id: alice.id,
            name: 'alicia',
            age: alice.age,
        }
        const previousStateWithData = ModelState.create({
            ...sliceState,
            model: previousData,
        })
        const data = alice

        // WHEN
        const nextState = slice.reducer(previousStateWithData, slice.actions.hydrate(data))

        // THEN
        expect(nextState.model).toEqual(data)
        expect(nextState.error).toEqual(previousStateWithData.error) // should be unaffected
        expect(nextState.status).toEqual(previousStateWithData.status) // should be unaffected
        expect(nextState.lastModified).toEqual(null)
        expect(nextState.lastHydrated).toBeTruthy()
    })

    it('modifies state with data', () => {
        // GIVEN
        const previousData = {
            id: bob.id,
            name: 'bobby',
            age: bob.age,
        }
        const previousStateWithData = ModelState.create({
            ...sliceState,
            model: previousData,
        })
        const data = bob

        // WHEN
        const nextState = slice.reducer(previousStateWithData, slice.actions.set(data))

        // THEN
        expect(nextState.model).toEqual(data)
        expect(nextState.error).toEqual(previousStateWithData.error) // should be unaffected
        expect(nextState.status).toEqual(previousStateWithData.status) // should be unaffected
        expect(nextState.lastModified).toBeTruthy()
        expect(nextState.lastHydrated).toEqual(previousStateWithData.lastHydrated) // should be unaffected
    })

    it('resets state', () => {
        // GIVEN
        const initialState = sliceState
        const previousData = {
            id: carl.id,
            name: 'carlton',
            age: carl.age,
        }
        const previousStateWithData = ModelState.create({
            model: previousData,
            status: StatusEnum.Failed,
            error: new Error('Whoops.'),
            lastHydrated: getISOString(),
            lastModified: getISOString(),
        })

        // WHEN
        const nextState = slice.reducer(previousStateWithData, slice.actions.reset())

        // THEN
        expect(nextState).toEqual(initialState)
        expect(nextState.model).toEqual(initialState.model)
        expect(nextState.error).toEqual(initialState.error)
        expect(nextState.status).toEqual(initialState.status)
        expect(nextState.lastModified).toEqual(initialState.lastModified)
        expect(nextState.lastHydrated).toEqual(initialState.lastHydrated)
    })
})
