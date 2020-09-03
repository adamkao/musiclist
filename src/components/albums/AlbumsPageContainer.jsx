import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { addAlbum, albumSearchClear, searchAlbums, getVideosLf, getVideosRt }
  from '../../actions/albums';

import AlbumsPage from './AlbumsPage';

export class AlbumsPageContainer extends React.Component {

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch(albumSearchClear());
  }

  render() {
    const {
      addAlbumFunction,
      albums,
      videoslf,
      videosrt,
      searchAlbumsFunction,
      getVideosLfFunction,
      getVideosRtFunction,
      user,
      authentication,
    } = this.props;

    return (
      <AlbumsPage
        addAlbumFunction={addAlbumFunction}
        albums={albums}
        videoslf={videoslf}
        videosrt={videosrt}
        searchAlbumsFunction={searchAlbumsFunction}
        getVideosLfFunction={getVideosLfFunction}
        getVideosRtFunction={getVideosRtFunction}
        user={user}
        authentication={authentication}
      />
    );
  }
}

const mapDispatchToProps = dispatch => bindActionCreators({
  addAlbumFunction: addAlbum,
  searchAlbumsFunction: searchAlbums,
  getVideosLfFunction: getVideosLf,
  getVideosRtFunction: getVideosRt,
  dispatch,
}, dispatch);

const mapStateToProps = state => {
  return ({
    albums: state.albums,
    videoslf: state.videoslf,
    videosrt: state.videosrt,
    user: state.user,
    authentication: state.authentication,
  });
};

export default connect(mapStateToProps, mapDispatchToProps)(AlbumsPageContainer);
