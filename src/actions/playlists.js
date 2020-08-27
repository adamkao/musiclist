import 'whatwg-fetch';
import { decrementProgress, incrementProgress } from './progress';
import { clearError } from './error';

// Action Creators
export const playlistsSearchSuccess = json => ({ type: 'PLAYLISTS_SEARCH_SUCCESS', json });
