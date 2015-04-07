'use strict';

/**
 * @ngdoc function
 * @name WebampApp.controller:QueueCtrl
 * @description
 * # QueueCtrl
 * Controller of the WebampApp
 */
angular.module('WebampApp')
  .controller('QueueCtrl', function ($scope, $mdSidenav, $mdMedia) {
	    $scope.togglePlaylist = function() {
        if (!$mdMedia('gt-sm')) {
	        $mdSidenav('playlist').toggle();
        } else {
          $scope.playlistVisible = !$scope.playlistVisible;
        }
	    };
      $scope.playlistVisible = true;
  }
);
