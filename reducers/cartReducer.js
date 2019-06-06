const initialState = {
  count: 0,
};

function cartReducer(state = initialState, action) {
  switch (action.type) {
    case 'UPDATE_CART':
      return Object.assign({}, state, {
        count: action.count,
      });
    default:
      return state;
  }
}

export default cartReducer;
