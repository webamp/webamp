'use strict';

/**
 * @ngdoc function
 * @name WebampApp.controller:AuthCtrl
 * @description
 * # AuthCtrl
 * Controller of the WebampApp
 */
angular.module('WebampApp')
  .controller('AuthCtrl', function ($scope, $localStorage, Soundcloud) {
    
    $scope.drop = {
      classes : 'drop-theme-arrows-bounce-dark',
      constrainToScrollParent : 'true',
      constrainToWindow: 'true',
      openOn: 'click',
      position: 'bottom right'
    }

    $scope.soundcloud = Soundcloud;
  	
  	$scope.$storage = $localStorage.$default({
  		accessToken : null,
  	});

  	$scope.$on('$soundcloud::authed', function() {
		$scope.$storage.accessToken = SC.accessToken();
  	});

  	$scope.$on('$soundcloud::unauthed', function() {
  		$scope.$storage.accessToken = null;
  	})
  });