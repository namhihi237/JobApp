import {actionType} from '../acitonType';
const {
  REGISTER_COMPANY,
  REGISTER_COMPANY_SUCCESS,
  REGISTER_COMPANY_FAIL,
} = actionType;
const initialState = {
  msg: '',
  loading: false,
  success: false,
};
export const registerCompany = (state = initialState, actions) => {
  switch (actions.type) {
    case REGISTER_COMPANY:
      return {...state, loading: true};
    case REGISTER_COMPANY_SUCCESS:
      return {...state, ...actions.payload, loading: false, success: true};
    case REGISTER_COMPANY_FAIL:
      return {...state, ...actions.payload, loading: false};
    default:
      return state;
  }
};
