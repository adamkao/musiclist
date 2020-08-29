import { combineReducers } from 'redux';
import AlbumsReducer from '../reducers/albums';
import ArtistsReducer from '../reducers/artists';
import AuthenticationReducer from '../reducers/authentication';
import ErrorReducer from '../reducers/error';
import LatestReducer from '../reducers/latest';
import ListReducer from '../reducers/list';
import ProgressReducer from '../reducers/progress';
import UserReducer from '../reducers/user';
import VideosLfReducer from '../reducers/videoslf';
import VideosRtReducer from '../reducers/videosrt';

const reducers = {
  albums: AlbumsReducer,
  artists: ArtistsReducer,
  authentication: AuthenticationReducer,
  error: ErrorReducer,
  latest: LatestReducer,
  list: ListReducer,
  progress: ProgressReducer,
  user: UserReducer,
  videoslf: VideosLfReducer,
  videosrt: VideosRtReducer,
};

export default combineReducers(reducers);
