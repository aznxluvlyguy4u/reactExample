import { combineReducers } from 'redux';
import searchReducer from './searchReducer';
import cartReducer from './cartReducer';

const rootReducer = combineReducers({
  searchReducer,
  cartReducer,
});

export default rootReducer;
