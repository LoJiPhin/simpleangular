// Define the AngularJS module
var chatApp = angular.module('chatApp', []);

// Define the chat controller
chatApp.controller('ChatController', function($scope) {
    $scope.messages = []; // Array to hold chat messages

    // Function to send a new message
    $scope.sendMessage = function() {
        // Add the message to the messages array
        $scope.messages.push($scope.newMessage);
        $scope.newMessage = ''; // Clear the message input
    };
});
