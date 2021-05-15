import {actionType} from '../acitonType';
import axios from 'axios';
import _ from 'lodash';
import {apiUrl} from '../../api/api';
const {COMPANIES, COMPANIES_SUCCESS, COMPANIES_FAIL} = actionType;

export const getCompanies = (page, take = 10) => async (dispatch) => {
  dispatch({type: COMPANIES});

  try {
    const result = await axios.get(
      `${apiUrl.BASE_URL}/api/v1/companies/info?page=${page}&take=${take}`,
    );
    dispatch({type: COMPANIES_SUCCESS, payload: result.data});
  } catch (error) {
    const msg = _.get(error.response, 'data.msg') || "Cant't connect network";
    dispatch({
      type: COMPANIES_FAIL,
      payload: {msg},
    });
  }
};
