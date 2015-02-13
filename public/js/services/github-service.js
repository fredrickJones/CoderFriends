'use strict';
var app = angular.module('coderFriends');

app.service('GithubService', function($http) {
	this.getFollowing = function() {
		return $http.get('/api/github/following').then(function(res) {
			return res.data;
		});
	};
});

