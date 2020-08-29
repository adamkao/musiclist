import React from 'react';
import { AvForm } from 'availity-reactstrap-validation';
import { Button, Container, Row, Col, ListGroup, ListGroupItem } from 'reactstrap';

export default class AlbumsPage extends React.Component {
  constructor(props) {
    super(props);

    // bound functions
    this.createTable = this.createTable.bind(this);
    this.handleValidSubmit = this.handleValidSubmit.bind(this);
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

  // Handle submission once all form data is valid
  handleValidSubmit() {
    const { searchAlbumsFunction } = this.props;
    const formData = this.state;
    this.setState({ lfPlaylistId: '' });
    this.setState({ lfPlaylistTitle: '' });
    this.setState({ rtPlaylistId: '' });
    this.setState({ rtPlaylistTitle: '' });
    searchAlbumsFunction(formData, this.searchText);
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
    this.setState({ lfPlaylistId: '' });
    this.setState({ lfPlaylistTitle: '' });
  }

  showRtPlaylists() {
    this.setState({ rtPlaylistId: '' });
    this.setState({ rtPlaylistTitle: '' });
  }

  createTable(albums, videoslf, videosrt) {
    const lfplt = this.state.lfPlaylistTitle;
    const rtplt = this.state.rtPlaylistTitle;
    return (
      <Container>
        <Row>
          <Col lg="6">
            { lfplt ?
              <div>
                <Button onClick={this.showLfPlaylists}>Playlist: {lfplt}</Button>
                <p />
              </div>
              : null }
            <ListGroup as="ul">
              {this.fillPane(albums, videoslf, 'lf')}
            </ListGroup>
          </Col>
          <Col lg="6">
            { rtplt ?
              <div>
                <Button onClick={this.showRtPlaylists}>Playlist: {rtplt}</Button>
                <p />
              </div>
              : null }
            <ListGroup as="ul">
              {this.fillPane(albums, videosrt, 'rt')}
            </ListGroup>
          </Col>
        </Row>
      </Container>
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
    return items.map((item) => {
      console.log(JSON.stringify(item.snippet));
      return (
      <ListGroupItem
        tag="button"
        as="li"
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
    );
    });
  }

  render() {
    const { albums, videoslf, videosrt } = this.props;
    return (
      <div>
        <div className="row justify-content-center">
          <AvForm onValidSubmit={this.handleValidSubmit}>
            <Button color="primary">Import</Button>
          </AvForm>
        </div>
        <p />
        <div className="row">
          {this.createTable(albums, videoslf, videosrt)}
        </div>
      </div>
    );
  }
}
