import {actionType} from '../acitonType';
import axios from 'axios';
import _ from 'lodash';
import {apiUrl} from '../../api/api';
const {GET_JOBS, GET_JOBS_SUCCESS, GET_JOBS_FAIL} = actionType;
const {GET_JOBS_URL} = apiUrl;

export const getJob = (page, take = 10) => async (dispatch) => {
  dispatch({type: GET_JOBS});

  try {
    const result = await axios.get(`${GET_JOBS_URL}?page=${page}&take=${take}`);
    dispatch({type: GET_JOBS_SUCCESS, payload: result.data});
  } catch (error) {
    const msg = _.get(error.response, 'data.msg') || "Cant't connect network";
    dispatch({
      type: GET_JOBS_FAIL,
      payload: {msg},
    });
  }
};
