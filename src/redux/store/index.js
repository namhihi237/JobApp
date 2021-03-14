import thunkMiddleware from 'redux-thunk';
import {createStore, combineReducers, applyMiddleware} from 'redux';

import {
  login,
  registerIter,
  registerCompany,
  getJob,
  getCompanyPost,
  createPost,
  applyJob,
  forgotPassword,
  confirmCode,
  updatePass,
} from '../reducer/';

const AppReduces = combineReducers({
  login,
  registerIter,
  registerCompany,
  getJob,
  getCompanyPost,
  createPost,
  applyJob,
  forgotPassword,
  confirmCode,
  updatePass,
});

const rootReducer = (state, action) => {
  return AppReduces(state, action);
};

export const store = createStore(rootReducer, applyMiddleware(thunkMiddleware));
