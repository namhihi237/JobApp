import {actionType} from '../acitonType';
const {CREATE_POST, CREATE_POST_SUCCESS, CREATE_POST_FAIL} = actionType;
const initialState = {
  msg: '',
  loading: false,
};
export const createPost = (state = initialState, actions) => {
  switch (actions.type) {
    case CREATE_POST:
      return {...state, loading: true};
    case CREATE_POST_SUCCESS:
      return {...state, ...actions.payload, loading: false};
    case CREATE_POST_FAIL:
      return {...state, ...actions.payload, loading: false};
    default:
      return state;
  }
};
