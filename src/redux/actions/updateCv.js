import { actionType } from '../acitonType';
import axios from 'axios';
import _ from 'lodash';
import { apiUrl } from '../../api/api';
import { getData } from '../../utils';
const { UPDATE_CV, UPDATE_CV_SUCCESS, UPDATE_CV_FAIL } = actionType;

export const updateCv = (data) => async (dispatch) => {
  dispatch({ type: UPDATE_CV });

  try {
    const token = await getData('token');

    const result = await axios.patch(`${apiUrl.BASE_URL}/api/v1/cv`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });

    dispatch({ type: UPDATE_CV_SUCCESS, payload: result.data });
  } catch (error) {
    const msg = _.get(error.response, 'data.msg') || "Cant't connect network";
    dispatch({
      type: UPDATE_CV_FAIL,
      payload: { msg },
    });
  }
};
