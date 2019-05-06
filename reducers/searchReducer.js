const initialState = {
  search: {
    keyword: '',
    products: '',
  },
};

function searchReducer(state = initialState, action) {
  switch (action.type) {
    case 'UPDATE_SEARCH':
      return Object.assign({}, state, {
        search: action.search,
      });
    case 'GET_PRODUCTS':
      return Object.assign({}, state, {
        products: action.products,
      });
    default:
      return state;
  }
}

export default searchReducer;
