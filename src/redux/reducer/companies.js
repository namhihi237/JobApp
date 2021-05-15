import {actionType} from '../acitonType';
const {COMPANIES, COMPANIES_SUCCESS, COMPANIES_FAIL} = actionType;
const initialState = {
  msg: '',
  loading: false,
};
export const getCompanies = (state = initialState, actions) => {
  switch (actions.type) {
    case COMPANIES:
      return {...state, loading: true};
    case COMPANIES_SUCCESS:
      return {...state, ...actions.payload, loading: false};
    case COMPANIES_FAIL:
      return {...state, ...actions.payload, loading: false};
    default:
      return state;
  }
};
