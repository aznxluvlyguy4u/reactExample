import moment from 'moment';

const initialState = {
  productQuantity: 1,
  currentStep: 1,
  totalSteps: 0,
  productAccessories: [],
  productOptionalAccessories: [],
  productMandatoryAccessories: [],
  productConfigurations: [],
  selectedProduct: null,
  search: {
    keyword: '',
    deliveryLocation: '',
    collectionLocation: '',
    deliveryDate: moment().toISOString(),
    collectionDate: moment(new Date()).add(1, 'days').toISOString(),
  },
};

function localSearchReducer(state = initialState, action) {
  switch (action.type) {
    case 'UPDATE_LOCAL_SEARCH':
      return Object.assign({}, state, {
        search: action.search,
      });

    case 'UPDATE_LOCAL_SEARCH_KEYWORD':
      let search = state.search
      search.keyword = action.payload
      return Object.assign({}, state, {
        search: search,
      });

    case 'UPDATE_LOCAL_SEARCH_DELIVERY_LOCATION':
      let search1 = state.search
      search1.deliveryLocation = action.payload
      return Object.assign({}, state, {
        search: search1,
      });

    case 'UPDATE_LOCAL_SEARCH_COLLECTION_LOCATION':
      let search2 = state.search
      search2.collectionLocation = action.payload
      return Object.assign({}, state, {
        search: search2,
      });

    case 'UPDATE_LOCAL_SEARCH_DELIVERY_DATE':
      let search3 = state.search
      search3.deliveryDate = action.payload
      return Object.assign({}, state, {
        search: search3,
      });

    case 'UPDATE_LOCAL_SEARCH_COLLECTION_DATE':
      let search4 = state.search
      search4.collectionDate = action.payload
      return Object.assign({}, state, {
        search: search4,
      });

    case 'UPDATE_LOCAL_SEARCH_PRODUCT_QUANTITY':
      return Object.assign({}, state, {
        productQuantity: action.payload,
      });

    case 'SET_CURRENT_STEP':
      return Object.assign({}, state, {
        currentStep: action.payload,
      });

    case 'SET_TOTAL_STEPS':
      return Object.assign({}, state, {
        totalSteps: action.payload,
      });

    case 'SET_SELECTED_PRODUCT':
      return Object.assign({}, state, {
        selectedProduct: action.payload,
      });

    case 'SET_PRODUCT_ACCESSORIES':
      return Object.assign({}, state, {
        productAccessories: action.payload,
      });

    case 'SET_PRODUCT_OPTIONAL_ACCESSORIES':
      return Object.assign({}, state, {
        productOptionalAccessories: action.payload,
      });

    case 'SET_PRODUCT_MANDATORY_ACCESSORIES':
      return Object.assign({}, state, {
        productMandatoryAccessories: action.payload,
      });

    case 'SET_PRODUCT_CONFIGURATIONS':
      return Object.assign({}, state, {
        productConfigurations: action.payload,
      });

    case 'UPDATE_ACCESSORY_QUANTITY_BY_ID':
        const productOptionalAccessories = state.productOptionalAccessories.map(item => {
          if(item.id === action.payload.id) {
            item.quantity = action.payload.quantity;
          }
          return item;
        });
        return Object.assign({}, state, {
          productOptionalAccessories: productOptionalAccessories
        });
    default:
      return state;
  }
}

export default localSearchReducer;
