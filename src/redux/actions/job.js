import {actionType} from '../acitonType';
import axios from 'axios';
import _ from 'lodash';
import {apiUrl} from '../../api/api';
import {storeData, getData} from '../../utils';
const {GET_JOBS, GET_JOBS_SUCCESS, GET_JOBS_FAIL} = actionType;
const {GET_JOBS_URL} = apiUrl;

export const getJob = () => async (dispatch) => {
  dispatch({type: GET_JOBS});
  //   const token = await getData('token');

  try {
    const result = await axios.get(GET_JOBS_URL);
    dispatch({type: GET_JOBS_SUCCESS, payload: result.data});
  } catch (error) {
    const msg = _.get(error.response, 'data.msg') || "Cant't connect network";
    dispatch({
      type: GET_JOBS_FAIL,
      payload: {msg},
    });
  }
};
