'use strict';

/**
 * @ngdoc overview
 * @name webampgithubioApp
 * @description
 * # webampgithubioApp
 *
 * Main module of the application.
 */
angular
  .module('WebampApp', [
    'ngAnimate',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ngMaterial',
  ])
  .config(function ($routeProvider) {
    $routeProvider
      // .when('/', {
      //   templateUrl: 'views/main.html',
      //   controller: 'MainCtrl'
      // })
      // .when('/about', {
      //   templateUrl: 'views/about.html',
      //   controller: 'AboutCtrl'
      // })
      // .otherwise({
      //   redirectTo: '/'
      // });
  })
  .constant('FIREBASE_URL', 'https://blistering-torch-5309.firebaseio.com/');
