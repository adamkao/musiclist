const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Playlist = new Schema({
  youtubeId: { type: String, unique: true },
  images: [Schema.Types.Mixed],
  title: String,
});

module.exports = mongoose.model('Playlist', Playlist);
