const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const passportLocalMongoose = require('passport-local-mongoose');

const User = new Schema({
  albums: [Schema.Types.Mixed],
  artists: [Schema.Types.Mixed],
  playlists: [Schema.Types.Mixed],
  accessToken: String,
  email: String,
  firstName: String,
  lastName: String,
  passwordReset: { type: String, select: false },
  username: String,
  local: {
    email: String,
    password: String,
  },
  google: {
    id: String,
    token: String,
    email: String,
  },
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);
