import {actionType} from '../acitonType';
import axios from 'axios';
import _ from 'lodash';
import {apiUrl} from '../../api/api';
import {storeData, getData} from '../../utils';
const {DELETE_POST, DELETE_POST_SUCCESS, DELETE_POST_FAIL} = actionType;
const {DELETE_POST_URL} = apiUrl;

export const deletePost = (postId) => async (dispatch) => {
  dispatch({type: DELETE_POST});
  const token = await getData('token');
  try {
    const result = await axios.delete(`${DELETE_POST_URL}/${postId}`, {
      headers: {Authorization: `Bearer ${token}`},
    });
    dispatch({type: DELETE_POST_SUCCESS, payload: result.data});
  } catch (error) {
    const msg = _.get(error.response, 'data.msg') || "Cant't connect network";
    const status = _.get(error.response, 'data.status' || '');
    dispatch({
      type: DELETE_POST_FAIL,
      payload: {msg, status},
    });
  }
};
