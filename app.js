var app = angular.module("webamp", ["firebase", "ui.sortable"]);

app.value('firebaseUrl', 'https://blistering-torch-5309.firebaseio.com/');

app.factory("SortableArray", function($FirebaseArray) {
    return $FirebaseArray.$extendFactory({
        moveTo: function(item, index) {
            // kinda ugly but lets us sort / reorder a list by updating the priority of a single item

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
        // hook for ng-sortable
        dragControlListeners : function() {
            return {
                orderChanged: function(event) {
                    var $list = event.source.sortableScope.modelValue;
                    $list.moveTo(event.source.itemScope.modelValue, event.dest.index);
                },    
            }
        }
    });
});

app.controller('QueueCtrl', ["$scope", "$firebase",
  function($scope, $firebase) {
  	var ref = new Firebase('https://blistering-torch-5309.firebaseio.com/queues/myqueue');
    $scope.songs = $firebase(ref, {arrayFactory: "SortableArray"}).$asArray();
}])