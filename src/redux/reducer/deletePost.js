import {actionType} from '../acitonType';
const {DELETE_POST, DELETE_POST_SUCCESS, DELETE_POST_FAIL} = actionType;
const initialState = {
  msg: '',
  loading: false,
};
export const deletePost = (state = initialState, actions) => {
  switch (actions.type) {
    case DELETE_POST:
      return {...state, loading: true};
    case DELETE_POST_SUCCESS:
      return {...state, ...actions.payload, loading: false};
    case DELETE_POST_FAIL:
      return {...state, ...actions.payload, loading: false};
    default:
      return state;
  }
};
