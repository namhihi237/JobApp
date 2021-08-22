import {actionType} from '../acitonType';
import axios from 'axios';
import _ from 'lodash';
import {apiUrl} from '../../api/api';
import {getData} from '../../utils';
const {FOLLOW, FOLLOW_SUCCESS, FOLLOW_FAIL} = actionType;

export const follow = (data) => async (dispatch) => {
  dispatch({type: FOLLOW});
  try {
    const token = await getData('token');
    const result = await axios.post(
      `${apiUrl.BASE_URL}/api/v1/followers`,
      data,
      {
        headers: {Authorization: `Bearer ${token}`},
      },
    );
    dispatch({type: FOLLOW_SUCCESS, payload: result.data});
  } catch (error) {
    const msg = _.get(error.response, 'data.msg') || 'Cant connect network';
    dispatch({
      type: FOLLOW_FAIL,
      payload: {msg},
    });
  }
};
