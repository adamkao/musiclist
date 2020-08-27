var express = require('express');
var app = express();
var passport = require('passport');
app.use(passport.initialize());
var YoutubeV3Strategy = require('passport-youtube-v3').Strategy;

passport.use(new YoutubeV3Strategy({
    clientID: YOUR_CLIENT_ID,
    clientSecret: YOUR_CLIENT_SECRET,
    callbackURL: 'http://localhost:8888/redirect',
    scope: ['https://www.googleapis.com/auth/youtube']
},
function (accessToken, refreshToken, profile, cb) {
    var user = {
        accessToken: accessToken,
        refreshToken: refreshToken
    };
    return cb(null, user)
}
));

passport.serializeUser(function(user, cb) {
    cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
    cb(null, obj);
});

app.get('/ytauthenticate', passport.authenticate('youtube'))
app.get('/ytredirect', passport.authenticate('youtube', { failureRedirect: '/login' }),
function(req, res) {
    res.redirect('http://localhost:3000' + '?access_token=' + req.user.accessToken)
})

getAPIdata() {
    let parsed = queryString.parse(window.location.search);
    let accessToken = parsed.access_token
    fetch('https://www.googleapis.com/youtube/v3/playlists?part=snippet', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
            'Authorization': 'Bearer ' + accessToken,
        },
        body: JSON.stringify({
            'snippet':
            {
                'title':this.state.inputTitle
            }
        })
    }).then(response => response.json()).then(data => {
        console.log(data)
        window.alert('https://www.youtube.com/playlist?list=' + data.id)
    })
}
