'use strict';
var app = angular.module('coderFriends');

app.controller('friendCtrl', function($scope, events) {
	$scope.events = events
})