const initialState = [];

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case 'MUSIC_VIDEOS_GET_SUCCESS': {
      alert('MUSIC_VIDEOS_GET_SUCCESS');
      const newState = action.json.slice();
      return newState;
    }
    default: {
      return state;
    }
  }
}
