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
 
    var Soundcloud = {
      authed : false,
      username : "",
      userid : 0,
    };

    function completeAuth() {
      $q(function(resolve, reject) {
        SC.get('/me', {}, function(me) { 
          Soundcloud.userid = me.id;
          Soundcloud.authed = true;
          Soundcloud.username = me.username;
          resolve(Soundcloud);
        }, function(error) {
          console.log(error);
          reject(error);
        });
      }).then(function() {
        $rootScope.$broadcast('$soundcloud::authed', Soundcloud);
      })
    }

    Soundcloud.init = function(client_id, access_token) {
      SC.initialize({
        client_id: client_id,
        redirect_uri: 'http://localhost:9000/callback.html',
        access_token: access_token,
      });

      if (SC.isConnected()) {
        completeAuth();
      }
    }

    Soundcloud.auth = function() {
      return $q(function(resolve, reject) {
        if (Soundcloud.authed || SC.isConnected()) {
          resolve();
        } else {
          SC.connect(resolve, reject);
        }
      }).then(function() {
        completeAuth();
      });
    }

    Soundcloud.unauth = function() {
      SC.disconnect();
      Soundcloud.username = "";
      Soundcloud.userid = 0;
      Soundcloud.authed = false;
      $rootScope.$broadcast('$soundcloud::unauthed', Soundcloud);
    }

    function returnFromSoundcloudQuery(results) {
        var ret = {
          tracks : results.collection,
        }
        if (results.next_href) {
          ret.next = function() {
            return nextResults(results.next_href);
          }
        }
        return ret;
      }

    function nextResults(next_href) {
      return $q(function(resolve, reject) {
        SC.get(next_href, {}, resolve, reject)
      }).then(function(results) {
        return returnFromSoundcloudQuery(results);
      });
    }

    Soundcloud.search = function(query, page_size) {
      page_size = page_size || 20;
      return $q(function(resolve, reject) {
        SC.get('/tracks', { q: query, limit: page_size, linked_partitioning: 1 }, resolve, reject);
      }).then(function(results) {
        return returnFromSoundcloudQuery(results);
      });
    }

    Soundcloud.getAccessToken = function() {
      return SC.accessToken();
    }

    return Soundcloud;
  });
