'use strict';
var Express = require('express');
var Session = require('express-session');
var Passport = require('passport');
var GithubStrategy = require('passport-github').Strategy;
var GithubApi = require('github');

var App = Express();
var port = 8080;


var github = new GithubApi({
	version: '3.0.0'
});


// middleware
App.use(Express.static(__dirname + '/public'));
App.use(Session({secret: '032jhsjbGDRR09754dxdrgh54tscHCrDrd5ufyjjg'}));
App.use(Passport.initialize());
App.use(Passport.session());


Passport.use(new GithubStrategy({
	clientID: 'cf6cc6428f860048dbef',
	clientSecret: 'd813ec14d3082e2cc8012dd515c81c3611c7fab6',
	callbackURL: 'http://localhost:8080/auth/github/callback'
}, function(token, refreshToken, profile, done) {
	// console.log(profile);
	return done(null, profile);
}));


App.get('/auth/github', Passport.authenticate('github'));
App.get('/auth/github/callback', Passport.authenticate('github', {
	failureRedirect: '/'
}), function(req, res) {
	res.redirect('/#/home');
});

Passport.serializeUser(function(user, done) {
	done(null, user);
});
Passport.deserializeUser(function(obj, done) {
	done(null, obj);
});


var isAuth = function(req, res, next) {
	if(!req.isAuthenticated()) {
		res.status(403).end();
	}
	next();
};


App.get('/api/github/following', isAuth, function(req, res) {
	// console.log(req.user);
	github.user.getFollowingFromUser({
		user: req.user.username
	}, function(err, resp) {
		// console.log(JSON.stringify(resp));
		res.json(resp);
		// res.send(JSON.stringify(resp)); //same as line above
	});
});



App.listen(port, function() {
	// console.log('Now listening on port 8080');
});