import {
    CaseReducer,
    createEntityAdapter,
    createSlice,
    EntityState,
    PayloadAction
} from '@reduxjs/toolkit';
import DataState, { IDataState } from '../data-state';
import { IDictionary } from '../types';

interface IUser {
    id: string;
    name: string;
    age: number;
}

const usersAdapter = createEntityAdapter<IUser>({
    selectId: (o) => o.id,
    sortComparer: (a, b) => a.name.localeCompare(b.name)
});

const initialState = DataState.create<EntityState<IUser>>({ data: usersAdapter.getInitialState() });

type IReducers<TState> = {
    fail: CaseReducer<TState, PayloadAction<Error>>;
    hydrate: CaseReducer<TState, PayloadAction<IDictionary<IUser>>>;
    remove: CaseReducer<TState, PayloadAction<Array<string>>>;
    request: CaseReducer<TState, PayloadAction<IDictionary<IUser>>>;
    reset: CaseReducer<TState, PayloadAction>;
    set: CaseReducer<TState, PayloadAction<IDictionary<IUser>>>;
    update: CaseReducer<TState, PayloadAction<IDictionary<IUser>>>;
}

const usersSlice = createSlice<IDataState<EntityState<IUser>>, IReducers<IDataState<EntityState<IUser>>>>({
    name: 'users',
    initialState: initialState,
    reducers: {
        fail: (state, action) => DataState.create({
            data: state.data,
            error: action.payload,
            lastUpdated: state.lastUpdated,
            loading: false
        }),
        hydrate: (state, action) => {
            const data = usersAdapter.setAll(state.data, action.payload);
            return DataState.create({
                data: data,
                error: initialState.error,
                lastUpdated: new Date().toISOString(), // really annoying cant use meta right now: action.meta.timeStamp,
                loading: false
            });
        },
        remove: (state, action) => {
            const data = usersAdapter.removeMany(state.data, action.payload);
            return DataState.create({
                data: data,
                error: initialState.error,
                lastUpdated: state.lastUpdated,
                loading: state.loading
            });
        },
        request: (state) => DataState.create({
            data: state.data,
            error: initialState.error,
            lastUpdated: state.lastUpdated,
            loading: true
        }),
        reset: () => initialState,
        set: (state, action) => {
            const data = usersAdapter.setAll(state.data, action.payload);
            return DataState.create({
                data: data,
                error: initialState.error,
                lastUpdated: state.lastUpdated,
                loading: false
            });
        },
        update: (state, action) => {
            const data = usersAdapter.upsertMany(state.data, action.payload);
            return {
                data: data,
                error: initialState.error,
                lastUpdated: state.lastUpdated,
                loading: false
            };
        }
    }
});

usersSlice.actions.fail(new Error('something'));
usersSlice.actions.set({});
usersSlice.actions.fail(new Error('something'));
