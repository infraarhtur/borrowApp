
import { createReducer, on } from '@ngrx/store';
import {setUser, unSetUser} from './auth.actions';
import { UserModel } from '../../models/shared/user.model';
// import {} from ''

export interface State {
  user  : UserModel | any; 
}

export const initialState: State = {
    user: null,
}

const _authReducer = createReducer(initialState,

    on(setUser, (state, {user}) => ({ ...state, user: {...user} })),
    on(unSetUser, state => ({ ...state, user:null })),

);

export function authReducer(state:any, action:any) {
    return _authReducer(state, action);
}