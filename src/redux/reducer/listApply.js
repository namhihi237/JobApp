import {actionType} from '../acitonType';
const {
  GET_LIST_APPLY,
  GET_LIST_APPLY_SUCCESS,
  GET_LIST_APPLY_FAIL,
} = actionType;
const initialState = {
  msg: '',
  loading: false,
};
export const listApply = (state = initialState, actions) => {
  switch (actions.type) {
    case GET_LIST_APPLY:
      return {...state, loading: true};
    case GET_LIST_APPLY_SUCCESS:
      return {...state, ...actions.payload, loading: false};
    case GET_LIST_APPLY_FAIL:
      return {...state, ...actions.payload, loading: false};
    default:
      return state;
  }
};
