import {actionType} from '../acitonType';
const {FORGOT_PASS, FORGOT_PASS_SUCCESS, FORGOT_PASS_FAIL} = actionType;
const initialState = {
  msg: '',
  loading: false,
  status: '',
};
export const forgotPassword = (state = initialState, actions) => {
  switch (actions.type) {
    case FORGOT_PASS:
      return {...state, loading: true};
    case FORGOT_PASS_SUCCESS:
      return {...state, ...actions.payload, loading: false};
    case FORGOT_PASS_FAIL:
      return {...state, ...actions.payload, loading: false};
    default:
      return state;
  }
};
