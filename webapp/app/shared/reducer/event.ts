import { ActionReducer, Action } from '@ngrx/store';
import { Event } from '../interface/event';

export const ADD_EVENT = 'ADD_EVENT';
export const REMOVE_EVENT = 'REMOVE_EVENT';
export const UPDATE_EVENT = 'UPDATE_EVENT';

let gameSortID = 0;

export function events(state: Event[], action: Action) {
    switch (action.type) {
        case ADD_EVENT:
            return state.concat([Object.assign({}, action.payload, { gameSortID: gameSortID++ })]);

        case REMOVE_EVENT:
            return state.filter(event => event.id !== action.payload.id);

        case UPDATE_EVENT:
            return state.map(event => {
                return event.id === action.payload.id ?
                    Object.assign({}, event, action.payload) : event;
            });

        default:
            return state;
    }
}