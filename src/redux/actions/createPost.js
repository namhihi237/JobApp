import {actionType} from '../acitonType';
import axios from 'axios';
import _ from 'lodash';
import {apiUrl} from '../../api/api';
import {storeData, getData} from '../../utils';
const {CREATE_POST, CREATE_POST_SUCCESS, CREATE_POST_FAIL} = actionType;
const {CREATE_POST_URL} = apiUrl;

export const createPost = (data) => async (dispatch) => {
  dispatch({type: CREATE_POST});
  const token = await getData('token');
  try {
    const result = await axios.post(CREATE_POST_URL, data, {
      headers: {Authorization: `Bearer ${token}`},
    });
    dispatch({type: CREATE_POST_SUCCESS, payload: result.data});
  } catch (error) {
    const msg = _.get(error.response, 'data.msg') || "Cant't connect network";
    dispatch({
      type: CREATE_POST_FAIL,
      payload: {msg},
    });
  }
};
