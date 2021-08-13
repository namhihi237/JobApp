import {actionType} from '../acitonType';
const {GET_FOLLOWING, GET_FOLLOWING_SUCCESS, GET_FOLLOWING_FAIL} = actionType;

const initialState = {
  msg: '',
  loading: false,
};
export const getFollowing = (state = initialState, actions) => {
  switch (actions.type) {
    case GET_FOLLOWING:
      return {...state, loading: true};
    case GET_FOLLOWING_SUCCESS:
      return {...state, ...actions.payload, loading: false};
    case GET_FOLLOWING_FAIL:
      return {...state, ...actions.payload, loading: false};
    default:
      return state;
  }
};
