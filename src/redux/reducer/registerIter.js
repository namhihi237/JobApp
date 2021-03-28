import {actionType} from '../acitonType';
const {REGISTER_ITER, REGISTER_ITER_FAIL, REGISTER_ITER_SUCCESS} = actionType;
const initialState = {
  msg: '',
  loading: false,
  success: false,
};
export const registerIter = (state = initialState, actions) => {
  switch (actions.type) {
    case REGISTER_ITER:
      return {...state, loading: true};
    case REGISTER_ITER_SUCCESS:
      return {...state, ...actions.payload, loading: false, success: true};
    case REGISTER_ITER_FAIL:
      return {...state, ...actions.payload, loading: false};
    default:
      return state;
  }
};
