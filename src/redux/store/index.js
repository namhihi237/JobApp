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
  createIterCv,
  getCv,
  searchJob,
  deletePost,
  changePassword
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
  createIterCv,
  getCv,
  searchJob,
  deletePost,
  changePassword
});

const rootReducer = (state, action) => {
  return AppReduces(state, action);
};

export const store = createStore(rootReducer, applyMiddleware(thunkMiddleware));
