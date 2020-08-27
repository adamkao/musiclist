const initialState = [];
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case 'MUSIC_ARTIST_SEARCH_SUCCESS': {
      alert('MUSIC_ARTIST_SEARCH_SUCCESS');
      alert(JSON.stringify(action.json.results));
      const newState = action.json.results.slice();
      return newState;
    }
    case 'MUSIC_ARTIST_SEARCH_CLEAR': {
      const newState = initialState.slice();
      return newState;
    }
    default: {
      return state;
    }
  }
}
