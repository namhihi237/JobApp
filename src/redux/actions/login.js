import {actionType} from '../acitonType';
import axios from 'axios';
import _ from 'lodash';
import {apiUrl} from '../../api/api';
import {storeData} from '../../utils';
const {LOGIN, LOGIN_FAIL, LOGIN_SUCCESS} = actionType;
const {LOGIN_URL} = apiUrl;

export const login = (data) => async (dispatch) => {
  dispatch({type: LOGIN});
  storeData('token', '');
  let result;
  try {
    result = await axios.post(LOGIN_URL, data);
    let token = result.data.token;
    // storeData('userId', result.data.user._id);
    storeData('token', token);
    storeData('role', result.data.role + '');
    storeData('userId', result.data.userId + '');

    dispatch({type: LOGIN_SUCCESS, payload: result.data});
  } catch (error) {
    const msg = _.get(error.response, 'data.msg') || "Cant't connect network";
    dispatch({
      type: LOGIN_FAIL,
      payload: {msg},
    });
  }
};
