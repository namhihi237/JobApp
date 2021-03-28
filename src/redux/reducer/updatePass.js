import {actionType} from '../acitonType';
const {UPDATE_PASS, UPDATE_PASS_SUCCESS, UPDATE_PASS_FAIL} = actionType;
const initialState = {
  msg: '',
  loading: false,
};
export const updatePass = (state = initialState, actions) => {
  switch (actions.type) {
    case UPDATE_PASS:
      return {...state, loading: true};
    case UPDATE_PASS_SUCCESS:
      return {...state, ...actions.payload, loading: false};
    case UPDATE_PASS_FAIL:
      return {...state, ...actions.payload, loading: false};
    default:
      return state;
  }
};
