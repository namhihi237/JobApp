import {actionType} from '../acitonType';
import axios from 'axios';
import _ from 'lodash';
import {apiUrl} from '../../api/api';
const {SEARCH_JOB, SEARCH_JOB_SUCCESS, SEARCH_JOB_FAIL} = actionType;
const {GET_JOBS_URL} = apiUrl;

export const searchJob = (query) => async (dispatch) => {
  dispatch({type: SEARCH_JOB});

  try {
    const result = await axios.get(`${GET_JOBS_URL}?query=${query}`);
    dispatch({type: SEARCH_JOB_SUCCESS, payload: result.data});
  } catch (error) {
    const msg = _.get(error.response, 'data.msg') || "Cant't connect network";
    dispatch({
      type: SEARCH_JOB_FAIL,
      payload: {msg},
    });
  }
};
