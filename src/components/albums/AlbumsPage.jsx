import React from 'react';
import { AvForm, AvGroup, AvInput, AvFeedback } from 'availity-reactstrap-validation';
import { Button, Label, Container, Row, Col, ListGroup, ListGroupItem } from 'reactstrap';

export default class AlbumsPage extends React.Component {
  constructor(props) {
    super(props);

    // bound functions
    this.addAlbum = this.addAlbum.bind(this);
    this.createTable = this.createTable.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleValidSubmit = this.handleValidSubmit.bind(this);
    this.listAlbums = this.listAlbums.bind(this);

    // component state
    this.state = {
      query: '',
      lfPlaylistId: null,
      lfPlaylistTitle: '',
      rtPlaylistId: null,
      rtPlaylistTitle: '',
    };
  }

  // update state as search value changes
  handleSearchChange(e) {
    this.setState({ query: e.target.value });
  }

  // Handle submission once all form data is valid
  handleValidSubmit() {
    const { searchAlbumsFunction } = this.props;
    const formData = this.state;
    this.setState({ lfPlaylistId: null });
    this.setState({ lfPlaylistTitle: '' });
    this.setState({ rtPlaylistId: null });
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

  createTable(albums, videoslf, videosrt) {
    const lfplt = this.state.lfPlaylistTitle;
    const rtplt = this.state.rtPlaylistTitle;
    return (
      <Container>
        <Row>
          <Col lg="6">
            { lfplt ? <div><Button>Playlist: {lfplt}</Button><p /></div> : null }
            <ListGroup as="ul">
              {this.fillPane(albums, videoslf, 'lf')}
            </ListGroup>
          </Col>
          <Col lg="6">
            { rtplt ? <div><Button>Playlist: {rtplt}</Button><p /></div> : null }
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

    return items.map(item => (
      <ListGroupItem
        tag="button"
        as="li"
        action
        onClick={() => this.alertClicked(item.snippet.title, item.id, side)}
      >
        <div style={divStyle}>
          <div>
            <img
              src={item.snippet.thumbnails.default.url}
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

  // Add an album to the user's list
  addAlbum(e) {
    const { addAlbumFunction } = this.props;
    // get id from button and send to the API
    addAlbumFunction(e.target.id);
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
