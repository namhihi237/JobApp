import {actionType} from '../acitonType';
import axios from 'axios';
import _ from 'lodash';
import {apiUrl} from '../../api/api';
const {UPDATE_PASS, UPDATE_PASS_SUCCESS, UPDATE_PASS_FAIL} = actionType;
const {UPDATE_PASS_URL} = apiUrl;

export const updatePass = (data) => async (dispatch) => {
  dispatch({type: UPDATE_PASS});
  try {
    const result = await axios.post(UPDATE_PASS_URL, data);
    dispatch({type: UPDATE_PASS_SUCCESS, payload: result.data});
  } catch (error) {
    const msg = _.get(error.response, 'data.msg') || 'Cant connect network';
    dispatch({
      type: UPDATE_PASS_FAIL,
      payload: {msg},
    });
  }
};
