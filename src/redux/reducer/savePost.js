import {actionType} from '../acitonType';
const {SAVE_POST, SAVE_POST_SUCCESS, SAVE_POST_FAIL} = actionType;
const initialState = {
  msg: '',
  loading: false,
  success: false,
};
export const savePost = (state = initialState, actions) => {
  switch (actions.type) {
    case SAVE_POST:
      return {...state, loading: true};
    case SAVE_POST_SUCCESS:
      return {...state, ...actions.payload, loading: false, success: true};
    case SAVE_POST_FAIL:
      return {...state, ...actions.payload, loading: false};
    default:
      return state;
  }
};
