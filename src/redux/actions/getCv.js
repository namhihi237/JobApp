import {actionType} from '../acitonType';
import axios from 'axios';
import _ from 'lodash';
import {apiUrl} from '../../api/api';
import {storeData, getData} from '../../utils';
const {GET_CV, GET_CV_FAIL, GET_CV_SUCCESS} = actionType;
const {GET_A_CV} = apiUrl;

export const getCv = () => async (dispatch) => {
  dispatch({type: GET_CV});

  try {
    const token = await getData('token');

    const result = await axios.get(GET_A_CV, {
      headers: {Authorization: `Bearer ${token}`},
    });
    dispatch({type: GET_CV_SUCCESS, payload: result.data});
  } catch (error) {
    const msg = _.get(error.response, 'data.msg') || "Can't connect network";
    dispatch({
      type: GET_CV_FAIL,
      payload: {msg},
    });
  }
};