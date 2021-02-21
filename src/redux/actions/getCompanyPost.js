import {actionType} from '../acitonType';
import axios from 'axios';
import _ from 'lodash';
import {apiUrl} from '../../api/api';
import {storeData, getData} from '../../utils';
const {
  GET_COMPAY_POST,
  GET_COMPAY_POST_SUCCESS,
  GET_COMPAY_POST_FAIL,
} = actionType;
const {GET_COMPANY_POST} = apiUrl;

export const getCompanyPost = () => async (dispatch) => {
  dispatch({type: GET_COMPAY_POST});

  try {
    const token = await getData('token');

    const result = await axios.get(GET_COMPANY_POST, {
      headers: {Authorization: `Bearer ${token}`},
    });
    dispatch({type: GET_COMPAY_POST_SUCCESS, payload: result.data});
  } catch (error) {
    const msg = _.get(error.response, 'data.msg') || "Cant't connect network";
    dispatch({
      type: GET_COMPAY_POST_FAIL,
      payload: {msg},
    });
  }
};
