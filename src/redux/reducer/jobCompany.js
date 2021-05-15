import {actionType} from '../acitonType';
const {COMPANIES_JOB, COMPANIES_JOB_FAIL, COMPANIES_JOB_SUCCESS} = actionType;
const initialState = {
  msg: '',
  loading: false,
};
export const getJobCompany = (state = initialState, actions) => {
  switch (actions.type) {
    case COMPANIES_JOB:
      return {...state, loading: true};
    case COMPANIES_JOB_SUCCESS:
      return {...state, ...actions.payload, loading: false};
    case COMPANIES_JOB_FAIL:
      return {...state, ...actions.payload, loading: false};
    default:
      return state;
  }
};
