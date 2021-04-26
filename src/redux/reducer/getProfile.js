import {actionType} from '../acitonType';
const {GET_PROFILE, GET_PROFILE_SUCCESS, GET_PROFILE_FAIL} = actionType;
const initialState = {
  msg: '',
  loading: false,
};
export const getProfile = (state = initialState, actions) => {
  switch (actions.type) {
    case GET_PROFILE:
      return {...state, loading: true};
    case GET_PROFILE_SUCCESS:
      return {...state, ...actions.payload, loading: false};
    case GET_PROFILE_FAIL:
      return {...state, ...actions.payload, loading: false};
    default:
      return state;
  }
};
