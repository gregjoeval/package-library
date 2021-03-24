import { SliceCaseReducers } from '@reduxjs/toolkit'
import { ISlice, ISliceSelectors } from '../types'

/**
 * @internal
 * Reference: https://stackoverflow.com/a/17415677/7571132
 */
export const getISOStringWithOffset = (dateTime: Date = new Date()): string => {
    const tzo = -dateTime.getTimezoneOffset()
    const dif = tzo >= 0 ? '+' : '-'
    const pad = (num: number): string => {
        const norm = Math.floor(Math.abs(num))
        return `${norm < 10 ? '0' : ''}${norm}`
    }

    return `${dateTime.getFullYear()}-${pad(dateTime.getMonth() + 1)}-${pad(dateTime.getDate())}T${pad(dateTime.getHours())}:${pad(dateTime.getMinutes())}:${pad(dateTime.getSeconds())}${dif}${pad(tzo / 60)}:${pad(tzo % 60)}`
}

/**
 * @internal
 */
export const mapErrorToSerializableObject = <TError extends Error = Error> (error: TError): Record<keyof Error, string> => {
    const propertyNames = Object.getOwnPropertyNames(error)
    return propertyNames.reduce((accumulator, propertyName) => {
        const propertyDescriptorValue: unknown = Object.getOwnPropertyDescriptor(error, propertyName)?.value
        return {
            ...accumulator,
            [propertyName]: propertyDescriptorValue,
        }
    }, {} as Record<keyof Error, string>)
}

/**
 * @internal
 */
export const logSlice = <
    TGlobalState,
    TSliceState,
    TCaseReducers extends SliceCaseReducers<TSliceState>,
    TSliceSelectors extends ISliceSelectors<TGlobalState, TSliceState>
> (slice: ISlice<TGlobalState, TSliceState, TCaseReducers, TSliceSelectors>, initialState: TSliceState): void => {
    /* eslint-disable no-console */
    console.groupCollapsed(slice.name)

    console.group('initialState')
    console.log(initialState)
    console.groupEnd()

    console.group('actions')
    console.table(slice.actions)
    console.groupEnd()

    console.group('selectors')
    console.log(slice.selectors)
    console.groupEnd()

    console.groupEnd()
    /* eslint-enable no-console */
}
