import {actionType} from '../acitonType';
const {LOGIN, LOGIN_FAIL, LOGIN_SUCCESS, UPDATE_ROLE} = actionType;
const initialState = {
  isLoggedIn: false,
  msg: '',
  loading: false,
};
export const login = (state = initialState, actions) => {
  switch (actions.type) {
    case LOGIN:
      return {...state, loading: true};
    case LOGIN_SUCCESS:
      return {...state, ...actions.payload, isLoggedIn: true, loading: false}; // fix
    case LOGIN_FAIL:
      return {...state, ...actions.payload, loading: false};
    case UPDATE_ROLE:
      return {...state, ...actions.payload};
    default:
      return state;
  }
};
