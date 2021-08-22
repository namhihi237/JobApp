import {actionType} from '../acitonType';
import axios from 'axios';
import _ from 'lodash';
import {apiUrl} from '../../api/api';
import {getData} from '../../utils';
const {
  GET_SAVED_POSTS,
  GET_SAVED_POSTS_SUCCESS,
  GET_SAVED_POSTS_FAIL,
} = actionType;
const {BASE_URL} = apiUrl;

export const getSavedPost = () => async (dispatch) => {
  dispatch({type: GET_SAVED_POSTS});

  try {
    const token = await getData('token');

    const result = await axios.get(`${BASE_URL}/api/v1/posts/saved`, {
      headers: {Authorization: `Bearer ${token}`},
    });
    dispatch({type: GET_SAVED_POSTS_SUCCESS, payload: result.data});
  } catch (error) {
    const msg = _.get(error.response, 'data.msg') || "Can't connect network";
    dispatch({
      type: GET_SAVED_POSTS_FAIL,
      payload: {msg},
    });
  }
};
