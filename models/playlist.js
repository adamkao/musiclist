const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Playlist = new Schema({
  title: String,
  youtubeId: { type: String, unique: true },
  tracks: [Schema.Types.Mixed],
  images: [Schema.Types.Mixed],
});

module.exports = mongoose.model('Playlist', Playlist);
