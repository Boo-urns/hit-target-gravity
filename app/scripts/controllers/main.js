'use strict';

// var app = angular.module('hitTargetGravityApp', []);

// app.config(function ($routeProvider) {
// 	$routeProvider
// 		.when('/', {
// 			templateUrl: 'views/main.html'
// 		});
// });

// app.controller('MainCtrl', function ($scope) {
//     $scope.awesomeThings = [
//       'HTML5 Boilerplate',
//       'AngularJS',
//       'Karma'
//     ];
// });
 angular.module('hitTargetGravityApp', ['ngRoute'])
  .config(function($routeProvider) {
  	$routeProvider
  		.when('/', {
  			templateUrl: 'views/main.html'
  		});
  });

function MainCtrl ($scope) {
  $scope.awesomeThings = [
    'HTML5 Boilerplate',
    'AngularJS',
    'Karma'
  ];
};