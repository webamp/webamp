'use strict';

/**
 * @ngdoc service
 * @name WebampApp.Soundcloud
 * @description
 * # Soundcloud
 * Factory in the WebampApp.
 */
angular.module('WebampApp')
  .factory('Soundcloud', function($q, $rootScope){
 
    var authed = false;
    var username = "";
    var userid = 0;

    var Soundcloud = {};

    Soundcloud.auth = function() {
      $q(function(resolve, reject) {
        // already logged in?
        if (authed) {
          resolve();
        }

        // kick off the auth
        SC.initialize({
          client_id: '7e93c6c53246047912be8885c59ee55a',
          redirect_uri: 'http://localhost:9000/callback.html'
        });

        // get details for logged in user
        SC.connect(function() {
            SC.get('/me', {}, function(me) { 
                userid = me.id;
                authed = true;
                username = me.username;
                resolve(sc);
            }, function(error) {
                console.log(error);
                reject(error);
            });
        }, function(error) {
            console.log(error);
            reject(error);
        });
      }).then(function() {
          $rootScope.$broadcast('$soundcloud::authed', Soundcloud);
      });
    }

    Soundcloud.isAuthed = function() {
      return authed;
    }

    Soundcloud.getUsername = function() {
      return username;
    }

    Soundcloud.getUserid = function() {
      return userid;
    }

    Soundcloud.search = function(query) {

      // $q(function(resolve, reject) {

      // }).then(function() {
      //   return results;
      // });
    }

    return Soundcloud;
  });