import {actionType} from '../acitonType';
const {CHANGE_PASS, CHANGE_PASS_SUCCESS, CHANGE_PASS_FAIL} = actionType;
const initialState = {
  msg: '',
  loading: false,
};
export const changePassword = (state = initialState, actions) => {
  switch (actions.type) {
    case CHANGE_PASS:
      return {...state, loading: true};
    case CHANGE_PASS_SUCCESS:
      return {...state, ...actions.payload, loading: false};
    case CHANGE_PASS_FAIL:
      return {...state, ...actions.payload, loading: false};
    default:
      return state;
  }
};
