import {actionType} from '../acitonType';
const {
  GET_COMPAY_POST,
  GET_COMPAY_POST_FAIL,
  GET_COMPAY_POST_SUCCESS,
} = actionType;
const initialState = {
  msg: '',
  loading: false,
};
export const getCompanyPost = (state = initialState, actions) => {
  switch (actions.type) {
    case GET_COMPAY_POST:
      return {...state, loading: true};
    case GET_COMPAY_POST_SUCCESS:
      return {...state, ...actions.payload, loading: false};
    case GET_COMPAY_POST_FAIL:
      return {...state, ...actions.payload, loading: false};
    default:
      return state;
  }
};
