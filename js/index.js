'use strict';

/**
 * Service - Voting Candidate
 */
angular
.module('firebaseVotingApp', ['firebase'])
.constant('CONFIG', {
    firebaseId: "https://hackaton-2brains.firebaseio.com/"
})
.factory('Candidate', ['$firebase', 'CONFIG', function ($firebase, CONFIG) {

		return function(name, description, url, owner) {
			var self = this;
			var fb =  new Firebase(CONFIG.firebaseId);
			var entry = fb.child('/votes/' + name);
			var sync = $firebase(entry);
	  
			self.name = name;
			self.votes = sync.$asArray();
			console.log(self)
	 
			self.vote = function() {
				console.log("bote")
				self.votes.$add(1);				
			};
		};
}])
.controller('MainCtrl', function ($scope, Candidate, CONFIG, $timeout, $interval) {
	var ref = new Firebase(CONFIG.firebaseId);
	var projects = ref.child("candidates")

	$scope.newCandidate = {};

	projects.on("value", function(snapshot) {
		$timeout(function() {
			$scope.candidates = snapshot.val();
		}, 100);  			
	});

	$scope.createCandidate = function (c, form){
		form.$setPristine();
		$scope.newCandidate = {};
		ref.child("candidates").push(c);
	}

	$scope.removeCandidate = function(pId){
		projects.child(pId).remove();
	}

	$scope.voteCandidate = function (id, candidate){
		console.log(candidate);
		console.log(id);
		if (angular.isDefined(candidate.votes)) {
			candidate.votes.push(1)		
		} else{
			candidate.votes = [1];
		}
		projects.child(id).update({votes: candidate.votes})
	}

	$interval(function(){
		var targetElements = ["h1", "h2", "h3", "h4", "span", "p", "a", "small"]

		var elements = document.querySelectorAll(targetElements[Math.floor(Math.random() * (targetElements.length))])
		if (elements.length > 0) {
			var b = baffle(elements[Math.floor(Math.random() * (elements.length))], {exclude: ['áéíóú'],speed:70})
			b.reveal(2400)
		};
		

	}, 2500)
});