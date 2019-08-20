import { combineReducers } from 'redux';
import searchReducer from './searchReducer';
import cartReducer from './cartReducer';
import locationReducer from './locationReducer';
import localSearchReducer from './localSearchReducer';

const rootReducer = combineReducers({
  searchReducer,
  cartReducer,
  locationReducer,
  localSearchReducer
});

export default rootReducer;
