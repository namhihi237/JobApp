import {actionType} from '../acitonType';
const {APPLY_JOB, APPLY_JOB_FAIL, APPLY_JOB_SUCCESS} = actionType;
const initialState = {
  msg: '',
  loading: false,
};
export const applyJob = (state = initialState, actions) => {
  switch (actions.type) {
    case APPLY_JOB:
      return {...state, loading: true};
    case APPLY_JOB_SUCCESS:
      return {...state, ...actions.payload, loading: false};
    case APPLY_JOB_FAIL:
      return {...state, ...actions.payload, loading: false};
    default:
      return state;
  }
};
