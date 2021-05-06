import {actionType} from '../acitonType';
import axios from 'axios';
import _ from 'lodash';
import {apiUrl} from '../../api/api';
import {getData} from '../../utils';
const {GET_PROFILE, GET_PROFILE_SUCCESS, GET_PROFILE_FAIL} = actionType;
const {GET_PROFILE_PATH} = apiUrl;

export const getProfile = () => async (dispatch) => {
  dispatch({type: GET_PROFILE});

  try {
    const token = await getData('token');

    const result = await axios.get(GET_PROFILE_PATH, {
      headers: {Authorization: `Bearer ${token}`},
    });
    dispatch({type: GET_PROFILE_SUCCESS, payload: result.data});
  } catch (error) {
    const msg = _.get(error.response, 'data.msg') || "Can't connect network";
    dispatch({
      type: GET_PROFILE_FAIL,
      payload: {msg},
    });
  }
};
