import {actionType} from '../acitonType';
import axios from 'axios';
import _ from 'lodash';
import {apiUrl} from '../../api/api';
import {storeData, getData} from '../../utils';
const {UPDATE_WAITING_POST, UPDATE_WAITING_POST_SUCCESS, UPDATE_WAITING_POST_FAIL} = actionType;
const {UPDATE_WAITING_POST_PATH} = apiUrl;

export const editWaitingPost = (data, postId) => async (dispatch) => {
  dispatch({type: UPDATE_WAITING_POST});
  try {
    const token = await getData('token');
    const result = await axios.put(`https://job-it-cnpmp.herokuapp.com/api/v1/posts/${postId}`, data, {
      headers: {Authorization: `Bearer ${token}`},
    });
    dispatch({type: UPDATE_WAITING_POST_SUCCESS, payload: result.data});
  } catch (error) {
    const msg = _.get(error.response, 'data.msg') || "Cant't connect network";
    dispatch({
      type: UPDATE_WAITING_POST_FAIL,
      payload: {msg},
    });
  }
};
