'use strict';
var app = angular.module('coderFriends', ['ngRoute']);

app.config(function($routeProvider, $httpProvider) {
	$httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
	$httpProvider.interceptors.push('myHttpInterceptor');

	$routeProvider
		.when('/home', {
			templateUrl: '/templates/home.html',
			controller: 'homeCtrl',
			resolve: {
				friends: function(githubService) {
					return githubService.getFollowing();
				}
			}
		})
		.when('/friend/:github_username', {
			templateUrl: '/templates/friend.html',
			controller: 'friendCtrl',
			resolve: {
				events: function(githubService, $route) {
					return githubService.getEvents($route.current.params.github_username);
				}
			}
		})
		.otherwise({
			redirectTo: '/'
		});
});

app.factory('myHttpInterceptor', function($q) {
	return {
		'responseError': function(rejection) {
			if(rejection.status == 403) {
				document.location = '/';
				return;
			}
			return $q.reject(rejection);
		}
	};
});