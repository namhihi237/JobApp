import {actionType} from '../acitonType';
import axios from 'axios';
import _ from 'lodash';
import {apiUrl} from '../../api/api';
import {getData} from '../../utils';
const {
  SAVE_POST,
  SAVE_POST_SUCCESS,
  SAVE_POST_FAIL,
  UPDATE_SAVE_POST,
} = actionType;
const {BASE_URL} = apiUrl;

export const savePost = (data, newPosts) => async (dispatch) => {
  dispatch({type: UPDATE_SAVE_POST, payload: {posts: newPosts}});
  let result;
  dispatch({type: SAVE_POST});
  try {
    const token = await getData('token');
    result = await axios.post(
      `${BASE_URL}/api/v1/posts/saved`,
      {
        postId: data._id,
      },
      {
        headers: {Authorization: `Bearer ${token}`},
      },
    );
    dispatch({type: SAVE_POST_SUCCESS, payload: result.data});
  } catch (error) {
    const msg = _.get(error.response, 'data.msg') || "Cant't connect network";
    dispatch({
      type: SAVE_POST_FAIL,
      payload: {msg},
    });
  }
};
