import {actionType} from '../acitonType';
import axios from 'axios';
import _ from 'lodash';
import {apiUrl} from '../../api/api';
import {storeData, getData} from '../../utils';
const {
  CREATE_CV,
  CREATE_CV_SUCCESS,
  CREATE_CV_FAIL
} = actionType;
const {CREATE_CV_URL} = apiUrl;

export const createIterCv = (data) => async (dispatch) => {
  dispatch({type: CREATE_CV});

  try {
    const token = await getData('token');

    const result = await axios.post(CREATE_CV_URL, data, {
      headers: {Authorization: `Bearer ${token}`},
    });

    dispatch({type: CREATE_CV_SUCCESS, payload: result.data});
  } catch (error) {
    const msg = _.get(error.response, 'data.msg') || "Cant't connect network";
    dispatch({
      type: CREATE_CV_FAIL,
      payload: {msg},
    });
  }
};
