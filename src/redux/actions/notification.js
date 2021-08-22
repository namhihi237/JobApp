import {actionType} from '../acitonType';
import axios from 'axios';
import _ from 'lodash';
import {apiUrl} from '../../api/api';
import {getData} from '../../utils';
const {
  GET_NOTIFICATIONS,
  GET_NOTIFICATIONS_SUCCESS,
  GET_NOTIFICATIONS_FAIL,
} = actionType;

export const notifications = () => async (dispatch) => {
  dispatch({type: GET_NOTIFICATIONS});
  try {
    const token = await getData('token');
    const result = await axios.get(`${apiUrl.BASE_URL}/api/v1/notifications`, {
      headers: {Authorization: `Bearer ${token}`},
    });
    dispatch({type: GET_NOTIFICATIONS_SUCCESS, payload: result.data});
  } catch (error) {
    const msg = _.get(error.response, 'data.msg') || 'Cant connect network';
    dispatch({
      type: GET_NOTIFICATIONS_FAIL,
      payload: {msg},
    });
  }
};
