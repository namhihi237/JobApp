import {actionType} from '../acitonType';
const {GET_JOBS, GET_JOBS_FAIL, GET_JOBS_SUCCESS} = actionType;
const initialState = {
  msg: '',
  loading: false,
};
export const getJob = (state = initialState, actions) => {
  switch (actions.type) {
    case GET_JOBS:
      return {...state, loading: true};
    case GET_JOBS_SUCCESS:
      return {...state, ...actions.payload, loading: false};
    case GET_JOBS_FAIL:
      return {...state, ...actions.payload, loading: false};
    default:
      return state;
  }
};
