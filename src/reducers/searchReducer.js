import moment from 'moment';

const initialState = {
  search: {
    keyword: '',
    deliveryLocation: '',
    collectionLocation: '',
    deliveryDate: moment().format('YYYY-MM-DDTHH:mm:ss.ssZ'), //.toISOString(),
    // deliveryDate: moment().toISOString(),
    collectionDate: moment(new Date()).add(1, 'days').format('YYYY-MM-DDTHH:mm:ss.ssZ'), //.toISOString()
    // collectionDate: moment(new Date()).add(1, 'days').toISOString()
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

    case 'UPDATE_SEARCH_DELIVERY_LOCATION':
      let search1 = state.search
      search1.deliveryLocation = action.payload
      return Object.assign({}, state, {
        search: search1,
      });

    case 'UPDATE_SEARCH_COLLECTION_LOCATION':
      let search2 = state.search
      search2.collectionLocation = action.payload
      return Object.assign({}, state, {
        search: search2,
      });

    case 'UPDATE_SEARCH_DELIVERY_DATE':
      let search3 = state.search
      search3.deliveryDate = action.payload
      return Object.assign({}, state, {
        search: search3
      });

    case 'UPDATE_SEARCH_COLLECTION_DATE':
      let search4 = state.search
      search4.collectionDate = action.payload
      return Object.assign({}, state, {
        search: search4
      });

    default:
      return state;
  }
}

export default searchReducer;
