import {actionType} from '../acitonType';
import axios from 'axios';
import _ from 'lodash';
import {apiUrl} from '../../api/api';
import {storeData, getData} from '../../utils';
const {CHANGE_PASS, CHANGE_PASS_SUCCESS, CHANGE_PASS_FAIL} = actionType;
const {CHANGE_PASSWORD_URL} = apiUrl;

export const changePassword = (data) => async (dispatch) => {
  dispatch({type: CHANGE_PASS});

  try {
    const token = await getData('token');
    const result = await axios.post(CHANGE_PASSWORD_URL, data, {
      headers: {Authorization: `Bearer ${token}`},
    });
    dispatch({type: CHANGE_PASS_SUCCESS, payload: result.msg});
  } catch (error) {
    const msg = _.get(error.response, 'data.msg') || "Cant't connect network";
    dispatch({
      type: CHANGE_PASS_FAIL,
      payload: {msg},
    });
  }
};
