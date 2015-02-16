'use strict';
var app = angular.module('coderFriends');

app.service('githubService', function($http) {
	this.login = function() {
		var deferred = $q.defer();
		$http.get('/auth/github');
		return deferred.promise;
	};

	this.getFollowing = function() {
		var deferred = $q.defer();
		$http.get('/api/github/following').then(function(res) {
			deferred.resolve(res.data);
		}, function(err) {
			deferred.reject(err);
		});
		return deferred.promise;
	};

	this.getEvents = function(username) {
		var deferred = $q.defer();
		$http.get('/api/github/' + username + '/activity').then(function(res) {
			deferred.resolve(res.data);
		}, function(err) {
			deferred.reject(err);
		});
		return deferred.promise;
	};
});


