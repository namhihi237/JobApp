import {actionType} from '../acitonType';
const {SEARCH_JOB, SEARCH_JOB_SUCCESS, SEARCH_JOB_FAIL} = actionType;
const initialState = {
  msg: '',
  loading: false,
};
export const searchJob = (state = initialState, actions) => {
  switch (actions.type) {
    case SEARCH_JOB:
      return {...state, loading: true};
    case SEARCH_JOB_SUCCESS:
      return {...state, ...actions.payload, loading: false};
    case SEARCH_JOB_FAIL:
      return {...state, ...actions.payload, loading: false};
    default:
      return state;
  }
};
