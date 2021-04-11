import {actionType} from '../acitonType';
import axios from 'axios';
import _ from 'lodash';
import {apiUrl} from '../../api/api';
import {storeData, getData} from '../../utils';
const {
  GET_LIST_APPLY,
  GET_LIST_APPLY_SUCCESS,
  GET_LIST_APPLY_FAIL,
} = actionType;
const {GET_JOBS_URL} = apiUrl;

export const listApply = (postId) => async (dispatch) => {
  dispatch({type: GET_LIST_APPLY});
  const token = await getData('token');
  try {
    const result = await axios.get(`${GET_JOBS_URL}/${postId}/apply-list`, {
      headers: {Authorization: `Bearer ${token}`},
    });
    dispatch({type: GET_LIST_APPLY_SUCCESS, payload: result.data});
  } catch (error) {
    const msg = _.get(error.response, 'data.msg') || "Cant't connect network";
    dispatch({
      type: GET_LIST_APPLY_FAIL,
      payload: {msg},
    });
  }
};
