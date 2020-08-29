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
      rtPlaylistId: null,
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
    searchAlbumsFunction(formData, this.searchText);
  }

  alertClicked(title, id, side) {
    const { getVideosFunction } = this.props;
    getVideosFunction(id);
    if (side === 'lf') {
      this.setState({ lfPlaylistId: id });
    }
    if (side === 'rt') {
      this.setState({ rtPlaylistId: id });
    }
  }

  createTable(albums, videos) {
    return (
      <Container>
        <Row>
          <Col lg="6">
            <ListGroup as="ul">
              {this.fillPane(albums, videos, 'lf')}
            </ListGroup>
          </Col>
          <Col lg="6">
            <ListGroup as="ul">
              {this.fillPane(albums, videos, 'rt')}
            </ListGroup>
          </Col>
        </Row>
      </Container>
    );
  }

  fillPane(albums, videos, side) {
    alert('albums ' + JSON.stringify(albums));
    alert('videos ' + JSON.stringify(videos));
    if (side === 'lf') {
      if (this.state.lfPlaylistId) {
        return this.listAlbums(videos, side);
      }
      return this.listAlbums(albums, side);
    }
    if (side === 'rt') {
      if (this.state.rtPlaylistId) {
        return this.listAlbums(videos, side);
      }
      return this.listAlbums(albums, side);
    }
    return side;
  }

  listAlbums(albums, side) {
    const { user } = this.props;
    return albums.map(album => (
      <ListGroupItem
        tag="button"
        as="li"
        action
        onClick={() => this.alertClicked(album.snippet.title, album.id, side)}
      >
        <img src={album.snippet.thumbnails.default.url} alt="thumbnail" height="20" />
        &ensp; {album.id} &ensp; {album.snippet.title}
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
    const { albums, videos } = this.props;
    return (
      <div>
        <div className="row justify-content-center">
          <div className="col-10 col-sm-7 col-md-5 col-lg-4">
            <AvForm onValidSubmit={this.handleValidSubmit}>
              <AvGroup>
                <h2><Label for="search">Search Albums</Label></h2>
                <p>
                  Find albums you own and add them to your MusicList.
                  You can search by album title or artist name.
                </p>
                <AvInput
                  id="search"
                  name="search"
                  onChange={this.handleSearchChange}
                  onKeyPress={this.handleKeyPress}
                  placeholder="Queens of the Stone Age"
                  required
                  type="text"
                  value={this.state.searchText}
                />
                <AvFeedback>Required</AvFeedback>
              </AvGroup>
              <Button color="primary">Search Albums</Button>
            </AvForm>
          </div>
        </div>
        <p />
        <div className="row">
          <div className="col-12 col-sm-12">
            {this.createTable(albums, videos)}
          </div>
        </div>
      </div>
    );
  }
}
