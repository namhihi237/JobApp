import {actionType} from '../acitonType';
const {FEEDBACK, FEEDBACK_SUCCESS, FEEDBACK_FAIL} = actionType;

const initialState = {
  msg: '',
  loading: false,
};
export const sendFeedback = (state = initialState, actions) => {
  switch (actions.type) {
    case FEEDBACK:
      return {...state, loading: true};
    case FEEDBACK_SUCCESS:
      return {...state, ...actions.payload, loading: false};
    case FEEDBACK_FAIL:
      return {...state, ...actions.payload, loading: false};
    default:
      return state;
  }
};
