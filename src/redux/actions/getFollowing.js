import {actionType} from '../acitonType';
import axios from 'axios';
import _ from 'lodash';
import {apiUrl} from '../../api/api';
import {getData, storeObject} from '../../utils';
const {GET_FOLLOWING, GET_FOLLOWING_SUCCESS, GET_FOLLOWING_FAIL} = actionType;

export const getFollowing = () => async (dispatch) => {
  dispatch({type: GET_FOLLOWING});
  try {
    const token = await getData('token');
    const result = await axios.get(
      `${apiUrl.BASE_URL}/api/v1/followers/following`,
      {
        headers: {Authorization: `Bearer ${token}`},
      },
    );
    await storeObject('following', result.data.following);
    dispatch({type: GET_FOLLOWING_SUCCESS, payload: result.data});
  } catch (error) {
    const msg = _.get(error.response, 'data.msg') || 'Cant connect network';
    dispatch({
      type: GET_FOLLOWING_FAIL,
      payload: {msg},
    });
  }
};
