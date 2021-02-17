import {actionType} from '../acitonType';
const {REGISTER, REGISTER_FAIL, REGISTER_SUCCESS} = actionType;
const initialState = {
  msg: '',
  loading: false,
};
export const registerIter = (state = initialState, actions) => {
  switch (actions.type) {
    case REGISTER:
      return {...state, loading: true};
    case REGISTER_SUCCESS:
      return {...state, ...actions.payload, loading: false};
    case REGISTER_FAIL:
      return {...state, ...actions.payload, loading: false};
    default:
      return state;
  }
};
