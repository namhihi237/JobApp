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
    console.log('login', LOGIN_URL);
    console.log(data);
    result = await axios.post(LOGIN_URL, data);
    console.log(result.data);
    let token = result.data.token;
    console.log('token', token);
    // storeData('userId', result.data.user._id);
    storeData('token', token);
    storeData('role', result.data.role + '');

    dispatch({type: LOGIN_SUCCESS, payload: result.data});
  } catch (error) {
    console.log(error);
    const msg = _.get(error.response, 'data.msg') || "Cant't connect network";
    dispatch({
      type: LOGIN_FAIL,
      payload: {msg},
    });
  }
};
