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

		return function(name, owner) {
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
.controller('MainCtrl', function ($scope, Candidate, CONFIG, $timeout) {
		var ref = new Firebase(CONFIG.firebaseId);
		var projects = ref.child("candidates")
		// var votes = ref.child('votes');

		$scope.newCandidate = {};

		projects.on("value", function(snapshot) {
  			$timeout(function() {
  				$scope.candidates = snapshot.val()
  				// var cand = snapshot.val()
  				// console.log(cand)
  				// angular.forEach(cand, function(k, c){
  				// 	$scope.candidates = new Candidate(c.name, c.owner),
  				// })	
  			}, 100);  			
		});

		// $scope.candidates = [
		// 	new Candidate('Un red social para perros (por: El Chico Terry)'),
		// 	new Candidate('Cocinar sin sal (por: Martín Carcamo)'),
		// 	new Candidate('Tomarse un gimnasio en Pokemon (por: Fyto Manga)')
		// ];

		$scope.createCandidate = function (c, form){
			form.$setPristine();
			$scope.newCandidate = {};
   			ref.child("candidates").push(c)

		}

		$scope.removeCandidate = function(pId){
			projects.child(pId).remove();
		}

		$scope.voteCandidate = function (id, candidate){
			console.log(candidate)
			console.log(id)
			if (angular.isDefined(candidate.votes)) {
				candidate.votes.push(1)		
			} else{
				candidate.votes = [1];
			}
			projects.child(id).update({votes: candidate.votes})
		}
		


  });