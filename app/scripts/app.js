'use strict';

/**
 * @ngdoc overview
 * @name webampgithubioApp
 * @description
 * # webampgithubioApp
 *
 * Main module of the application.
 */
var app = angular
  .module('WebampApp', [
    'ngAnimate',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ngMaterial',
    'drop-ng',
    'ngStorage',
    'firebase',
    'focusOn',
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
  .constant('FIREBASE_URL', 'https://blistering-torch-5309.firebaseio.com/')
  .constant('SOUNDCLIENT_CLIENTID', '7e93c6c53246047912be8885c59ee55a');

app.run(
  function($firebaseAuth, FIREBASE_URL, SOUNDCLIENT_CLIENTID, $localStorage, Soundcloud) {
    // auth firebase anonymously
    var ref = new Firebase(FIREBASE_URL);
    var auth = $firebaseAuth(ref);
    auth.$authAnonymously();

    // init soundcloud with client id and possibly access token
    var accessToken = $localStorage.accessToken;
    Soundcloud.init(SOUNDCLIENT_CLIENTID, accessToken);
  }
);
