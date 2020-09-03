import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Row, Col, ListGroup, ListGroupItem } from 'reactstrap';

export default class AlbumsPage extends React.Component {
  constructor(props) {
    super(props);

    // bound functions
    this.createTable = this.createTable.bind(this);
    this.import = this.import.bind(this);
    this.authGoogle = this.authGoogle.bind(this);
    this.listAlbums = this.listAlbums.bind(this);
    this.showLfPlaylists = this.showLfPlaylists.bind(this);
    this.showRtPlaylists = this.showRtPlaylists.bind(this);

    // component state
    this.state = {
      lfPlaylistId: null,
      lfPlaylistTitle: '',
      rtPlaylistId: null,
      rtPlaylistTitle: '',
    };
  }

  import() {
    const { searchAlbumsFunction } = this.props;
    const formData = this.state;
    this.setState({ lfPlaylistId: null });
    this.setState({ lfPlaylistTitle: '' });
    this.setState({ rtPlaylistId: null });
    this.setState({ rtPlaylistTitle: '' });
    searchAlbumsFunction(formData, this.searchText);
  }

  authGoogle() {
//    const resp = window.open('http://localhost:8888/authenticate');
  }

  alertClicked(title, id, side) {
    const { getVideosLfFunction, getVideosRtFunction } = this.props;
    if (side === 'lf') {
      getVideosLfFunction(id);
      this.setState({ lfPlaylistId: id });
      this.setState({ lfPlaylistTitle: title });
    }
    if (side === 'rt') {
      getVideosRtFunction(id);
      this.setState({ rtPlaylistId: id });
      this.setState({ rtPlaylistTitle: title });
    }
  }

  showLfPlaylists() {
    this.setState({ lfPlaylistId: null });
    this.setState({ lfPlaylistTitle: '' });
    alert('showLfPlaylists');
  }

  showRtPlaylists() {
    this.setState({ rtPlaylistId: null });
    this.setState({ rtPlaylistTitle: '' });
  }

  createTable(albums, videoslf, videosrt) {
    const lfplt = this.state.lfPlaylistTitle;
    const rtplt = this.state.rtPlaylistTitle;

    return (
      <div className="container-fluid playlist-container">
        <Row className="playlist-row">
          <Col className="playlist-pane" lg="6"> { lfplt ?
            <div className="playlist-pane-header">
              <Button onClick={this.showLfPlaylists}>Playlist: {lfplt}</Button>
              <p />
            </div> : null }
            <ListGroup className="playlist-list">
              {this.fillPane(albums, videoslf, 'lf')}
            </ListGroup>
          </Col>
          <Col className="playlist-pane" lg="6"> { rtplt ?
            <div className="playlist-pane-header">
              <Button onClick={this.showRtPlaylists}>Playlist: {rtplt}</Button>
              <p />
            </div> : null }
            <ListGroup className="playlist-list">
              {this.fillPane(albums, videosrt, 'rt')}
            </ListGroup>
          </Col>
        </Row>
      </div>
    );
  }

  fillPane(albums, videos, side) {
    if (side === 'lf') {
      if (this.state.lfPlaylistId) {
        return this.listAlbums(videos, side, 40);
      }
      return this.listAlbums(albums, side, 20);
    }
    if (side === 'rt') {
      if (this.state.rtPlaylistId) {
        return this.listAlbums(videos, side, 40);
      }
      return this.listAlbums(albums, side, 20);
    }
    return side;
  }

  listAlbums(items, side, ht) {
    const divStyle = {
      display: 'flex',
      alignItems: 'center',
    };
    return items.map(item => (
      <ListGroupItem
        tag="button"
        action
        onClick={() => this.alertClicked(item.snippet.title, item.id, side)}
      >
        <div style={divStyle}>
          <div>
            <img
              src={item.snippet.thumbnails.default ? item.snippet.thumbnails.default.url : null}
              alt="thumbnail"
              height={ht}
            />
          </div>
          &ensp;
          <div>
            {item.snippet.title}
          </div>
        </div>
      </ListGroupItem>
    ));
  }

  renderHeader(isLoggedIn, firstName) {
    if (isLoggedIn) {
      return (
        <div>Welcome, {firstName}
          <Button color="primary" onClick={this.import}>Import</Button>
          <Button color="primary" onClick={this.authGoogle}>authorize</Button>
        </div>
      );
    }
    return (
      <div>
        <Button tag={Link} to="/account/login">Log In</Button>
        <Button tag={Link} to="/account/register">Register</Button>
        <Button color="primary" onClick={this.import}>Import</Button>
        <Button color="primary" onClick={this.authGoogle}>authorize</Button>
      </div>
    );
  }
  render() {
    const { albums, videoslf, videosrt } = this.props;
    const { isLoggedIn, firstName } = this.props.authentication;

    return (
      <div className="playlist-page">
        <div className="playlist-header">
          { this.renderHeader(isLoggedIn, firstName) }
        </div>
        <p />
        <div className="playlist-fill">
          {this.createTable(albums, videoslf, videosrt)}
        </div>
      </div>
    );
  }
}
