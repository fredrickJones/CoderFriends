'use strict';
var app = angular.module('coderFriends', ['ngRoute']);

app.config(function($routeProvider) {
	$routeProvider
		.when('/home', {
			templateUrl: '/templates/home.html',
			controller: 'homeCtrl',
			resolve: {
				friends: function(GithubService) {
					return GithubService.getFollowing();
				}
			}
		})
		.when('/friend/:github_username', {
			templateUrl: '/templates/friend.html',
			controller: 'friendCtrl',
			resolve: {
				events: function() {}
			}
		})
		.otherwise({
			redirectTo: '/'
		});
});

app.config(function($httpProvider) {
	$httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
	$httpProvider.interceptors.push('myHttpInterceptor');
});

app.factory('myHttpInterceptor', function($q) {
	return {
		'responseError': function(rejection) {
			if (rejection.status == 403) {
				document.location = '/';
				return;
			}
			return $q.reject(rejection);
		}
	};
});