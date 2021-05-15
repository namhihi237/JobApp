import {actionType} from '../acitonType';
import axios from 'axios';
import _ from 'lodash';
import {apiUrl} from '../../api/api';
const {COMPANIES_JOB, COMPANIES_JOB_FAIL, COMPANIES_JOB_SUCCESS} = actionType;

export const getJobCompany = (companyId) => async (dispatch) => {
  dispatch({type: COMPANIES_JOB});

  try {
    const result = await axios.get(
      `${apiUrl.BASE_URL}/api/v1/posts/company/${companyId}`,
    );
    dispatch({type: COMPANIES_JOB_SUCCESS, payload: result.data});
  } catch (error) {
    const msg = _.get(error.response, 'data.msg') || "Cant't connect network";
    dispatch({
      type: COMPANIES_JOB_FAIL,
      payload: {msg},
    });
  }
};
