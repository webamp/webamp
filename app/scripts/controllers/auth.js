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
  });
