const initialState = {
  locations: [],
};

function locationReducer(state = initialState, action) {
  switch (action.type) {
    case 'SET_LOCATIONS':
      return Object.assign({}, state, {
        locations: action.payload,
      });
    default:
      return state;
  }
}

export default locationReducer;
