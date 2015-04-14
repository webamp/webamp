'use strict';

/**
 * @ngdoc function
 * @name WebampApp.controller:SearchCtrl
 * @description
 * # SearchCtrl
 * Controller of the WebampApp
 */
angular.module('WebampApp')
  .controller('SearchCtrl', function ($scope, Soundcloud) {
    $scope.selectedItem = null;
	$scope.searchText = "";
	$scope.searchResults = []
	$scope.nextResults = null;
	
	$scope.doSecondaryAction = function() {
		console.log("moshe");
	}

	$scope.getAutoCompleteMatches = function(query) {
		return Soundcloud.search(query).then(function(results) {
			var tracks = results.tracks;
			tracks.unshift({
				title: "Search for " + query,
				search: query,
			});
			return tracks;
		});
	}

	function processSearchResults(results) {
		$scope.searchResults.push.apply($scope.searchResults, results.tracks);
		$scope.nextResults = results.next;
	}

	$scope.getSearchResults = function(query) {
		$scope.searchResults = []
		$scope.nextResults = null;

		// HACK. This is not the angular way
		if (!$scope.selectedItem) {
			document.activeElement.blur();
		}

		if ($scope.selectedItem && $scope.selectedItem.search) {
			query = $scope.selectedItem.search;
			$scope.searchText = query;
		}
		
		if (query) {
			Soundcloud.search(query).then(function(results) {
				processSearchResults(results);
			});
		}
	}

	$scope.getNextSearchResults = function() {
		$scope.nextResults().then(function(results) {
			processSearchResults(results);
		})
	}
  });
