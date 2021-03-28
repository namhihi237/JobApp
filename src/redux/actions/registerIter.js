import {actionType} from '../acitonType';
import axios from 'axios';
import _ from 'lodash';
import {apiUrl} from '../../api/api';
const {REGISTER_ITER, REGISTER_ITER_FAIL, REGISTER_ITER_SUCCESS} = actionType;
const {REGISTER_ITER_URL} = apiUrl;

export const registerIter = (data) => async (dispatch) => {
  let result;
  dispatch({type: REGISTER_ITER});
  try {
    result = await axios.post(REGISTER_ITER_URL, data);
    dispatch({type: REGISTER_ITER_SUCCESS, payload: result.data});
  } catch (error) {
    const msg = _.get(error.response, 'data.msg') || "Cant't connect network";
    dispatch({
      type: REGISTER_ITER_FAIL,
      payload: {msg},
    });
  }
};
