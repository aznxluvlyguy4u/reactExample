import { combineReducers } from 'redux';
import searchReducer from './searchReducer';
import cartReducer from './cartReducer';
import locationReducer from './locationReducer';

const rootReducer = combineReducers({
  searchReducer,
  cartReducer,
  locationReducer
});

export default rootReducer;
