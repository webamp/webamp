'use strict';

/**
 * @ngdoc service
 * @name WebampApp.Queue
 * @description
 * # Queue
 * Factory in the WebampApp.
 */
angular.module('WebampApp')
  .factory('Queue', ['FIREBASE_URL', '$firebase',
    function(FIREBASE_URL, $firebase){
      var ref = new Firebase(FIREBASE_URL);
      var Queue = {};

      Queue.tracks = function(queueId) {
        return $firebase(ref.child('queues').child(queueId).child('tracks'),{arrayFactory: "SortableFirebaseArray"}).$asArray();
      }

      Queue.players = function(queueId) {
        return $firebase(ref.child('queues').child(queueId).child('players')).$asArray();
      }

      Queue.addPlayer = function(queueId, name) {
        name = name || '[Choose name]';
        var playerRef = ref.child('queues').child(queueId).child('players').push({
          name : name,
          playing : true,
        });

        playerRef.onDisconnect().remove();
        return playerRef;
      }

      return Queue;
    }
]);
