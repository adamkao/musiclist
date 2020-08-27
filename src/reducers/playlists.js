const initialState = [];
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case 'PLAYLISTS_SEARCH_SUCCESS': {
      const newState = action.json.results.slice();
      return newState;
    }
    default: {
      return state;
    }
  }
}
