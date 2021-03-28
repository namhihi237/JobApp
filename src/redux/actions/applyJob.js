import {actionType} from '../acitonType';
import axios from 'axios';
import _ from 'lodash';
import {apiUrl} from '../../api/api';
import {storeData, getData} from '../../utils';
const {APPLY_JOB, APPLY_JOB_FAIL, APPLY_JOB_SUCCESS} = actionType;
const {APPLY_JOB_URL} = apiUrl;

export const applyJob = (jobId) => async (dispatch) => {
  dispatch({type: APPLY_JOB});

  try {
    const token = await getData('token');

    const result = await axios.get(APPLY_JOB_URL + `/${jobId}/apply`, {
      headers: {Authorization: `Bearer ${token}`},
    });
    dispatch({type: APPLY_JOB_SUCCESS, payload: result.data});
  } catch (error) {
    const msg = _.get(error.response, 'data.msg') || "Can't connect network";
    dispatch({
      type: APPLY_JOB_FAIL,
      payload: {msg},
    });
  }
};
