import {actionType} from '../acitonType';
const {
  GET_SAVED_POSTS,
  GET_SAVED_POSTS_SUCCESS,
  GET_SAVED_POSTS_FAIL,
} = actionType;
const initialState = {
  msg: '',
  loading: false,
};
export const getSavedPost = (state = initialState, actions) => {
  switch (actions.type) {
    case GET_SAVED_POSTS:
      return {...state, loading: true};
    case GET_SAVED_POSTS_SUCCESS:
      return {...state, ...actions.payload, loading: false};
    case GET_SAVED_POSTS_FAIL:
      return {...state, ...actions.payload, loading: false};
    default:
      return state;
  }
};
