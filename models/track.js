const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Track = new Schema({
  youtubeId: { type: String, unique: true },
  images: [Schema.Types.Mixed],
  title: String,
});

module.exports = mongoose.model('Track', Track);
