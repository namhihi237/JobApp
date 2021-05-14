import {actionType} from '../acitonType';
const {UPDATE_CV, UPDATE_CV_SUCCESS, UPDATE_CV_FAIL} = actionType;
const initialState = {
  msg: '',
  loading: false,
};
export const updateCv = (state = initialState, actions) => {
  switch (actions.type) {
    case UPDATE_CV:
      return {...state, loading: true};
    case UPDATE_CV_SUCCESS:
      return {...state, ...actions.payload, loading: false};
    case UPDATE_CV_FAIL:
      return {...state, ...actions.payload, loading: false};
    default:
      return state;
  }
};
