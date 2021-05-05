import {actionType} from '../acitonType';
const {
  UPDATE_WAITING_POST,
  UPDATE_WAITING_POST_SUCCESS,
  UPDATE_WAITING_POST_FAIL,
} = actionType;
const initialState = {
  msg: '',
  loading: false,
};
export const editWaitingPost = (state = initialState, actions) => {
  switch (actions.type) {
    case UPDATE_WAITING_POST:
      return {...state, loading: true};
    case UPDATE_WAITING_POST_SUCCESS:
      return {...state, ...actions.payload, loading: false};
    case UPDATE_WAITING_POST_FAIL:
      return {...state, ...actions.payload, loading: false};
    default:
      return state;
  }
};
