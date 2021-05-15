import {actionType} from '../acitonType';
import axios from 'axios';
import _ from 'lodash';
import {apiUrl} from '../../api/api';
const {CONFIRM_CODE, CONFIRM_CODE_SUCCESS, CONFIRM_CODE_FAIL} = actionType;
const {CONFIRM_CODE_URL} = apiUrl;

export const confirmCode = (data) => async (dispatch) => {
  dispatch({type: CONFIRM_CODE});
  try {
    const result = await axios.post(CONFIRM_CODE_URL, data);
    dispatch({type: CONFIRM_CODE_SUCCESS, payload: result.data});
  } catch (error) {
    const msg = _.get(error.response, 'data.msg') || 'Cant connect network';
    dispatch({
      type: CONFIRM_CODE_FAIL,
      payload: {msg},
    });
  }
};
