import {actionType} from '../acitonType';
import axios from 'axios';
import _ from 'lodash';
import {apiUrl} from '../../api/api';
import {getData} from '../../utils';
const {FEEDBACK, FEEDBACK_SUCCESS, FEEDBACK_FAIL} = actionType;

export const sendFeedback = (data) => async (dispatch) => {
  dispatch({type: FEEDBACK});
  try {
    const token = await getData('token');
    const result = await axios.post(
      `${apiUrl.BASE_URL}/api/v1/feedbacks`,
      data,
      {
        headers: {Authorization: `Bearer ${token}`},
      },
    );
    dispatch({type: FEEDBACK_SUCCESS, payload: result.data});
  } catch (error) {
    const msg = _.get(error.response, 'data.msg') || 'Cant connect network';
    dispatch({
      type: FEEDBACK_FAIL,
      payload: {msg},
    });
  }
};
