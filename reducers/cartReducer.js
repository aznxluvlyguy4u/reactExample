const initialState = {
  cart: {
    id: undefined,
    quantity: undefined,
    period: {
      start: undefined,
      end: undefined,
    },
    location: {
      collectionId: undefined,
      dropOffId: undefined,
    },
  },
};

function cartReducer(state = initialState, action) {
  switch (action.type) {
    case 'UPDATE_CART':
      return Object.assign({}, state, {
        cart: action.cart,
      });
    default:
      return state;
  }
}

export default cartReducer;
