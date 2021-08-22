import {actionType} from '../acitonType';
const {
  GET_NOTIFICATIONS,
  GET_NOTIFICATIONS_SUCCESS,
  GET_NOTIFICATIONS_FAIL,
} = actionType;
const initialState = {
  msg: '',
  loading: false,
};
export const notifications = (state = initialState, actions) => {
  switch (actions.type) {
    case GET_NOTIFICATIONS:
      return {...state, loading: true};
    case GET_NOTIFICATIONS_SUCCESS:
      return {...state, ...actions.payload, loading: false};
    case GET_NOTIFICATIONS_FAIL:
      return {...state, ...actions.payload, loading: false};
    default:
      return state;
  }
};
