const initialState = {
  locations: [],
  locationsLoading: false
};

function locationReducer(state = initialState, action) {
  switch (action.type) {
    case 'GET_LOCATIONS':
      return Object.assign({}, state, {
        locationsLoading: true,
      });
    case 'SET_LOCATIONS':
      return Object.assign({}, state, {
        locations: action.payload,
        locationsLoading: false,
      });

    default:
      return state;
  }
}

export default locationReducer;
