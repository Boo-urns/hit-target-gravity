'use strict';

 angular.module('hitTargetGravityApp', ['ngRoute'])
  .config(function($routeProvider) {
  	$routeProvider
  		.when('/', {
  			templateUrl: 'views/main.html',
        controller: 'MainCtrl'
  		});
  });


function MainCtrl ($scope) {

  $scope.userData = {};

  // Setting up a default for now
  $scope.userData = {
    target: 1.080,
    collected: 6.5,
    batchSize: 5
  }
  $scope.dme = [
              {dme: 'Briess Pilsen Light', ppg: 44},
              {dme: 'Briess Golden Light', ppg: 43},
              {dme: 'Muntons Light', ppg: 44},
              {dme: 'Muntons Extra Light', ppg: 37}
            ];

  $scope.$watchCollection('userData', function(newValues){
    console.log($scope.userData);
  });
};