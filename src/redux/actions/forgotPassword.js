import {actionType} from '../acitonType';
import axios from 'axios';
import _ from 'lodash';
import {apiUrl} from '../../api/api';
const {FORGOT_PASS, FORGOT_PASS_SUCCESS, FORGOT_PASS_FAIL} = actionType;
const {FORGOT_PASS_URL} = apiUrl;

export const forgotPassword = (data) => async (dispatch) => {
  dispatch({type: FORGOT_PASS});
  try {
    const result = await axios.post(FORGOT_PASS_URL, data);
    dispatch({type: FORGOT_PASS_SUCCESS, payload: result.data});
  } catch (error) {
    const msg = _.get(error.response, 'data.msg') || 'Cant connect network';
    dispatch({
      type: FORGOT_PASS_FAIL,
      payload: {msg},
    });
  }
};
