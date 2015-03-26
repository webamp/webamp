var app = angular.module("webamp", ["firebase", "ui.sortable"]);

app.value('firebaseUrl', 'https://blistering-torch-5309.firebaseio.com/');

app.factory("SortableArray", function($FirebaseArray, $firebase) {
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

        // $$added : function(snap) {
        //     // var obj = $firebase(snap.ref()).$asObject();
        //     // if (obj.$priority === null) {
        //     //     this.highestPriority += 1000;
        //     //     obj.$priority = this.highestPriority;
        //     //     obj.$save();
        //     // } else if (obj.$priority > this.highestPriority) {
        //     //     this.highestPriority = obj.$priority;
        //     // }
        //     ret = $FirebaseArray.prototype.$$added.apply(this, arguments);
        //     console.log(ret);
        //     console.log(this.highestPriority);
        //     ret.$priority = 666;
        //     return ret;
        // },
    });
});

app.factory("Soundcloud", function($q, $rootScope) {
    var sc = {
        userid : null,
        authed : false,
        _sc_user : null,
        _SC : SC,

    }

    sc.auth = function() {
        return $q(function(resolve, reject) {
            // already logged in?
            if (sc.authed) {
                resolve(sc.userid);
            }

            SC.initialize({
              client_id: '7e93c6c53246047912be8885c59ee55a',
              redirect_uri: 'http://localhost:9090/callback.html'
            });

            SC.connect(function() {
                SC.get('/me', {}, function(me) { 
                    sc.userid = me.id;
                    sc.authed = true;
                    sc._sc_user = me;
                    console.log("Userid: " + me.id);
                    $rootScope.$broadcast("login-success");
                    resolve(sc);
                }, function(error) {
                    console.log(error);
                    reject(error);
                });
            }, function(error) {
                console.log(error);
                reject(error);
            });
        });
    }

    return sc;
});

app.controller('QueueCtrl', ["$scope", "$firebase", "firebaseUrl", "Soundcloud",
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

        $scope.doauth = function() {
            Soundcloud.auth().then(
                function() {
                    $scope.authed = true;
                    var ref = new Firebase(firebaseUrl + '/queues/' + Soundcloud.userid);
                    $scope.songs = $firebase(ref, {arrayFactory: "SortableArray"}).$asArray();
                    $scope.songs.$loaded(
                        function(list) {
                            window.list = $scope.songs;
                            $scope.loading = false;
                        }, function(error) {
                            console.log("Error: " + error);
                        }
                    );
                }, function(error) {
                    console.log(error);
                }
            );
        }
    }])