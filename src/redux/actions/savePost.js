import {actionType} from '../acitonType';
import axios from 'axios';
import _ from 'lodash';
import {apiUrl} from '../../api/api';
import {getData} from '../../utils';
const {SAVE_POST, SAVE_POST_SUCCESS, SAVE_POST_FAIL} = actionType;
const {BASE_URL} = apiUrl;

export const savePost = (data) => async (dispatch) => {
  let result;
  dispatch({type: SAVE_POST});
  try {
    const token = await getData('token');
    result = await axios.post(`${BASE_URL}/api/v1/posts/saved`, data, {
      headers: {Authorization: `Bearer ${token}`},
    });
    console.log(result.data);
    dispatch({type: SAVE_POST_SUCCESS, payload: result.data});
  } catch (error) {
    console.log(error);
    const msg = _.get(error.response, 'data.msg') || "Cant't connect network";
    dispatch({
      type: SAVE_POST_FAIL,
      payload: {msg},
    });
  }
};
