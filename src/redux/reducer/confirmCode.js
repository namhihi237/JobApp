import {actionType} from '../acitonType';
const {CONFIRM_CODE, CONFIRM_CODE_SUCCESS, CONFIRM_CODE_FAIL} = actionType;
const initialState = {
  msg: '',
  loading: false,
};
export const confirmCode = (state = initialState, actions) => {
  switch (actions.type) {
    case CONFIRM_CODE:
      return {...state, loading: true};
    case CONFIRM_CODE_SUCCESS:
      return {...state, ...actions.payload, loading: false};
    case CONFIRM_CODE_FAIL:
      return {...state, ...actions.payload, loading: false};
    default:
      return state;
  }
};
