import moment from 'moment';

const initialState = {
  search: {
    keyword: '',
    deliveryLocation: '',
    collectionLocation: '',
    collectionDate:  moment().toISOString(),
    deliveryDate: moment(new Date()).add(1, 'days').toISOString(),
  },
};

function searchReducer(state = initialState, action) {
  switch (action.type) {
    case 'UPDATE_SEARCH':
      return Object.assign({}, state, {
        search: action.search,
      });

    case 'UPDATE_SEARCH_KEYWORD':
      let search = state.search
      search.keyword = action.payload
      return Object.assign({}, state, {
        search: search,
      });
    default:
      return state;
  }
}

export default searchReducer;
