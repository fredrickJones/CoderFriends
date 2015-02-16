'use strict';
var Express = require('express'),
	Session = require('express-session'),
	Passport = require('passport'),
	GithubStrategy = require('passport-github').Strategy,
	GithubApi = require('github'),
	BodyParser = require('body-parser'),
	Cors = require('cors');

var env = require('./env');
	
var app = Express();
var port = 9099;


// middleware
app.use(Express.static(__dirname + '/public'));
app.use(BodyParser.urlencoded({extended: false}));
app.use(Session({secret: '032jhsjbGDRR09754dxdrgh54tscHCrDrd5ufyjjg'}));
app.use(Passport.initialize());
app.use(Passport.session());
app.use(Cors());


Passport.use(new GithubStrategy({
	clientID: env.GITHUB.CLIENT_ID,
	clientSecret: env.GITHUB.CLIENT_SECRET,
	callbackURL: 'http://localhost:9099/auth/github/callback'
}, function(token, refreshToken, profile, done) {
	// console.log(profile.username);
	done(null, profile);
}));


var isAuthed = function(req, res, next) {
	if(!req.isAuthenticated()) {
		return res.status(403).end();
	} else {
		next();
	}
};

var github = new GithubApi({
	version: '3.0.0'
});


Passport.serializeUser(function(user, done) {
	done(null, user);
});
Passport.deserializeUser(function(obj, done) {
	done(null, obj);
});


app.get('/auth/github', Passport.authenticate('github'));
app.get('/auth/github/callback', Passport.authenticate('github', {
	failureRedirect: '/login'
}), function(req, res) {
	res.redirect('/#/home');
});

app.get('/api/github/following', isAuthed, function(req, res) {
	// console.log(req.user);
	github.user.getFollowingFromUser({
		user: req.user.username
	}, function(err, resp) {
		// console.log(JSON.stringify(resp));
		res.json(resp);
		// res.send(JSON.stringify(resp)); //same as line above
	});
});

app.get('/api/github/:username/activity', isAuthed, function(req, res) {
	github.events.getFromUser({
		user: req.params.username
	}, function(err, resp) {
		res.json(resp);
	})
});



app.listen(port, function() {
	// console.log('Now listening on port 8080');
});