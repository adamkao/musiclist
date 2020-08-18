const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const passportLocalMongoose = require('passport-local-mongoose');

const User = new Schema({
  username: String,
  firstName: String,
  lastName: String,
  passwordReset: { type: String, select: false },
  email: String,
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);
