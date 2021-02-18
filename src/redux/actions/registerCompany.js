import {actionType} from '../acitonType';
import axios from 'axios';
import _ from 'lodash';
import {apiUrl} from '../../api/api';
const {
  REGISTER_COMPANY,
  REGISTER_COMPANY_SUCCESS,
  REGISTER_COMPANY_FAIL,
} = actionType;
const {REGISTER_COMPANY_URL} = apiUrl;

export const registerCompany = (data) => async (dispatch) => {
  let result;
  dispatch({type: REGISTER_COMPANY});
  try {
    result = await axios.post(REGISTER_COMPANY_URL, data);
    dispatch({type: REGISTER_COMPANY_SUCCESS, payload: result.data});
  } catch (error) {
    const msg = _.get(error.response, 'data.msg') || "Cant't connect network";
    dispatch({
      type: REGISTER_COMPANY_FAIL,
      payload: {msg},
    });
  }
};
