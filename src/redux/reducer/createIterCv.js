import {actionType} from '../acitonType';
const {CREATE_CV, CREATE_CV_SUCCESS, CREATE_CV_FAIL} = actionType;
const initialState = {
  msg: '',
  loading: false,
};
export const createIterCv = (state = initialState, actions) => {
  switch (actions.type) {
    case CREATE_CV:
      return {...state, loading: true};
    case CREATE_CV_SUCCESS:
      return {...state, ...actions.payload, loading: false};
    case CREATE_CV_FAIL:
      return {...state, ...actions.payload, loading: false};
    default:
      return state;
  }
};
