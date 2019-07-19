const initialState = {
  count: 0,
  items: []
};

function cartReducer(state = initialState, action) {
  switch (action.type) {
    case 'UPDATE_CART':
      return Object.assign({}, state, {
        count: action.count,
      });

    case 'ADD_TO_CART':
      return Object.assign({}, state, {
        items: [...items, action.payload],
      });

    case 'REMOVE_FROM_CART':
        let items = state.items;
        var list = items.filter(x => {
          return x.id != action.payload;
        })
      return Object.assign({}, state, {
        items: list,
      });

    default:
      return state;
  }
}

export default cartReducer;
