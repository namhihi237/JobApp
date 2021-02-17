import thunkMiddleware from 'redux-thunk';
import {createStore, combineReducers, applyMiddleware} from 'redux';

import {login, registerIter} from '../reducer/';

const AppReduces = combineReducers({
  login,
  registerIter,
});

const rootReducer = (state, action) => {
  return AppReduces(state, action);
};

export const store = createStore(rootReducer, applyMiddleware(thunkMiddleware));
