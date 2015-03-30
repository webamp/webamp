var app = angular.module("webamp", ["firebase", "ui.sortable"]);

app.value('firebaseUrl', 'https://blistering-torch-5309.firebaseio.com/');

app.run(["$firebaseAuth", 'firebaseUrl',
    function($firebaseAuth, firebaseUrl) {
        var ref = new Firebase(firebaseUrl);
        var auth = $firebaseAuth(ref);
        auth.$authAnonymously();
    }
]);

app.factory("SortableFirebaseArray", function($FirebaseArray, $firebase) {
    return $FirebaseArray.$extendFactory({
        highestPriority : 0,

        moveTo: function(item, index) {
            // THIS IS HELLA UGLY
            // This function assumes the order of the elements already changed
            // via ng-sortable (or anything else) and adjusts the $priority to reflect
            // the new order. We take the average of elements around our destination with
            // special handling for moving an item to the start / end of the list

            // if we move to the beginning of the list take half of the priority of what used to be the first element
            if (index == 0) {
                item.$priority = this.$list[1].$priority / 2.0;
            // end of list? priority of previous last element + whatever
            } else if (index == this.$list.length - 1) {
                item.$priority = this.$list[this.$list.length-2].$priority + 1000;
            // otherwise average between 2 elements we're between
            } else {
                item.$priority = (this.$list[index+1].$priority + this.$list[index-1].$priority) / 2.0;
            }
            this.$list.$save(item);
        },

        $$added : function(snap) {
            // THIS SHOULD BE REVISITED
            ret = $FirebaseArray.prototype.$$added.apply(this, arguments);
            if (ret.$priority == null) {
                ret.$priority = this.highestPriority;
                // This save doesn't seem to be working
                this.$list.$save(ret);
            } else {
                if (ret.$priority > this.highestPriority) {
                    this.highestPriority = ret.$priority;
                }
            }
            return ret;
        },
    });
});


app.service('FirebasePaths', ['firebaseUrl',
    function(firebaseUrl) {
        this.queue = function(queue_id) {
            return new Firebase(firebaseUrl + '/queues/' + queue_id);
        }
    }
]);

app.service('WebampQueue', ['FirebasePaths', '$firebase',
    function(FirebasePaths, $firebase){
        this.playerId = null;
        this.queueRef = null;
        this.tracks = [];

        this.unloadQueue = function() {
            if (this.queueRef === null) return;

            this.playerRef.remove();
            this.playerRef = null;
            this.queueRef = null;
            this.tracks = []
        }

        this.loadQueue = function(queue_id, name) {
            name = name || '[Choose name]';

            // unload the existing queue first.
            // TODO: optionally save items from unloaded queue into new queue? 
            this.unloadQueue();
            this.queueRef = FirebasePaths.queue(queue_id);


            // register ourselves as a player
            this.playerRef = this.queueRef.child('players').push({
                name : name,
                playing : true,
            });

            // make sure to delete from 'players' on disconnect
            this.playerRef.onDisconnect().remove();

            // load the tracks and players
            this.tracks = $firebase(this.queueRef.child('tracks'),{arrayFactory: "SortableFirebaseArray"}).$asArray();
            this.players = $firebase(this.queueRef.child('players')).$asArray();
        }

        this.renamePlayer = function(new_name) {
            if (this.playerRef === null) return;

            this.playerRef.update({name:new_name});
        }

        // TODO: need to find a better way to add this boilerplate to the SortableFirebaseArray
        this.dragControlListeners = {
            orderChanged: function(event) {
                var list = event.source.sortableScope.modelValue;
                list.moveTo(event.source.itemScope.modelValue, event.dest.index);
            }
        }
    }
]);

app.factory('$soundcloud', ['$q', '$rootScope', 
    function($q, $rootScope){

        var sc = {
            authed : false,
            userid : 0,
            name : ''
        }

        sc.auth = function() {
            return $q(function(resolve, reject) {
                // already logged in?
                if (sc.authed) {
                    resolve(sc);
                }

                // kick off the auth
                SC.initialize({
                  client_id: '7e93c6c53246047912be8885c59ee55a',
                  redirect_uri: 'http://localhost:9090/callback.html'
                });

                // get details for logged in user
                SC.connect(function() {
                    SC.get('/me', {}, function(me) { 
                        sc.userid = me.id;
                        sc.authed = true;
                        sc.name = me.username;
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
                $rootScope.$broadcast('$soundcloud::authed', sc)
            });
        }
        
        return sc;
    }
]);

app.controller('QueueCtrl', ['$scope', 'WebampQueue', 
    function($scope, WebampQueue){
        $scope.queue_id = "myqueue";
        $scope.player_name = 'Shlomo';
        $scope.queue = WebampQueue;

        $scope.$on('$soundcloud::authed', function(event, soundcloud) {
            // we just had a successful soundcloud auth, lets load the
            // queue for this user
            $scope.queue.loadQueue(soundcloud.userid, $scope.player_name);
            $scope.queue_id = soundcloud.userid;
        });

        //$scope.soundcloud = $soundcloud;        
    }
]);

app.controller('SoundCloudAuthCtrl', ['$scope', '$soundcloud', 
    function($scope, $soundcloud) {
        $scope.soundcloud = $soundcloud;        
    }
])


/*
app.controller('QueueCtrlOld', ["$scope", "$firebase", "firebaseUrl", "Soundcloud",
    function($scope, $firebase, firebaseUrl, Soundcloud) {
        $scope.loading = true;
        $scope.authed = false;

        $scope.songs = [];

        $scope.dragControlListeners = {
            orderChanged: function(event) {
                var list = event.source.sortableScope.modelValue;
                list.moveTo(event.source.itemScope.modelValue, event.dest.index);
            }
        }

        Soundcloud.auth().then(function() {
            console.log("Someone authed soundcloud, controller knows about it");
        })

        // $scope.doauth = function() {
        //     Soundcloud.auth().then(
        //         function() {
        //             $scope.authed = true;
        //             var ref = new Firebase(firebaseUrl + '/queues/' + Soundcloud.userid);
        //             $scope.songs = $firebase(ref, {arrayFactory: "SortableFirebaseArray"}).$asArray();
        //             $scope.songs.$loaded(
        //                 function(list) {
        //                     window.list = $scope.songs;
        //                     $scope.loading = false;
        //                 }, function(error) {
        //                     console.log("Error: " + error);
        //                 }
        //             );
        //         }, function(error) {
        //             console.log(error);
        //         }
        //     );
        // }
    }])
    */