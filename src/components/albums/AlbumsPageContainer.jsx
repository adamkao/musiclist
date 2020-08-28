import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { addAlbum, albumSearchClear, searchAlbums, getVideos } from '../../actions/albums';

import AlbumsPage from './AlbumsPage';

export class AlbumsPageContainer extends React.Component {

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch(albumSearchClear());
  }

  render() {
    const { addAlbumFunction, albums, searchAlbumsFunction, getVideosFunction, user } = this.props;
    return (
      <AlbumsPage
        addAlbumFunction={addAlbumFunction}
        albums={albums}
        searchAlbumsFunction={searchAlbumsFunction}
        getVideosFunction={getVideosFunction}
        user={user}
      />
    );
  }
}

const mapDispatchToProps = dispatch => bindActionCreators({
  addAlbumFunction: addAlbum,
  searchAlbumsFunction: searchAlbums,
  getVideosFunction: getVideos,
  dispatch,
}, dispatch);

const mapStateToProps = state => {
  return ({ albums: state.albums, user: state.user });
};

export default connect(mapStateToProps, mapDispatchToProps)(AlbumsPageContainer);
