import moment from 'moment';

const initialState = {
  count: 0,
  items: [],
  realtimeItems: [],
};

function cartReducer(state = initialState, action) {
  switch (action.type) {
    case 'UPDATE_CART':
      return Object.assign({}, state, {
        count: action.count,
      });

    case 'ADD_TO_CART':
        return Object.assign({}, state, {
          items: [...state.items, action.payload],
        });

    case 'EMPTY_CART':
      return Object.assign({}, state, {
        items: [],
      });

    case 'REMOVE_FROM_CART':
        let items = state.items;
        var list = items.filter(x => {
          return x.id != action.payload;
        })
      return Object.assign({}, state, {
        items: list,
      });

    case 'SET_CART':
      return Object.assign({}, state, {
        items: action.payload,
      });
    default:
      return state;
  }
}

export default cartReducer;
