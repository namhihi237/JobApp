import {actionType} from '../acitonType';
const {FOLLOW, FOLLOW_SUCCESS, FOLLOW_FAIL} = actionType;

const initialState = {
  msg: '',
  loading: false,
};
export const follow = (state = initialState, actions) => {
  switch (actions.type) {
    case FOLLOW:
      return {...state, loading: true};
    case FOLLOW_SUCCESS:
      return {...state, ...actions.payload, loading: false};
    case FOLLOW_FAIL:
      return {...state, ...actions.payload, loading: false};
    default:
      return state;
  }
};
