import {actionType} from '../acitonType';
const {GET_CV, GET_CV_SUCCESS, GET_CV_FAIL} = actionType;
const initialState = {
  msg: '',
  loading: false,
};
export const getCv = (state = initialState, actions) => {
  switch (actions.type) {
    case GET_CV:
      return {...state, loading: true};
    case GET_CV_SUCCESS:
      return {...state, ...actions.payload, loading: false};
    case GET_CV_FAIL:
      return {...state, ...actions.payload, loading: false};
    default:
      return state;
  }
};
