angular.module('chatApp', [])
  .controller('ChatController', function ($scope, $window) {
    var chat = this;
    chat.messages = [];
    chat.username = '';
    chat.showUsernameInput = true; // Initially show the username input container
    chat.messageBatchSize = 25; // Number of messages to load at a time

    // Load username from local storage
    if ($window.localStorage.getItem('chatUsername')) {
      chat.username = $window.localStorage.getItem('chatUsername');
    }

    // Load messages from local storage
    if ($window.localStorage.getItem('chatMessages')) {
      chat.messages = JSON.parse($window.localStorage.getItem('chatMessages'));
    }

    // Function to set username
    chat.setUserName = function () {
      if (chat.username && chat.username.length > 1) {
        $window.localStorage.setItem('chatUsername', chat.username);
        chat.showUsernameInput = false; // Hide the username input container after setting the username
      } else {
        alert("Username must have more than one character.");
      }
    };

    // Function to send a message
    chat.sendMessage = function () {
      if (chat.username && chat.newMessage) { // Check if both username and message are not empty
        // Generate unique message ID
        var messageId = Date.now().toString();
        chat.messages.push({ id: messageId, username: chat.username, text: chat.newMessage });
        chat.newMessage = '';

        // Save messages to local storage
        $window.localStorage.setItem('chatMessages', JSON.stringify(chat.messages));
      } else {
        alert("Please enter both your username and a message before sending.");
      }
    };

    // Function to load more messages
    chat.loadMoreMessages = function () {
      // Load additional messages from local storage or an API
      // For demonstration purposes, let's just duplicate the existing messages
      var startIndex = chat.messages.length;
      for (var i = 0; i < chat.messageBatchSize; i++) {
        var messageIndex = startIndex + i;
        if (messageIndex < chat.allMessages.length) {
          chat.messages.push(chat.allMessages[messageIndex]);
        }
      }
    };

    // Clean up local storage when the browser window is closed
    $window.onbeforeunload = function () {
      $window.localStorage.removeItem('chatMessages');
      $window.localStorage.removeItem('chatUsername');
    };

    // Listen for changes in local storage
    $window.addEventListener('storage', function (event) {
      if (event.key === 'chatMessages') {
        $scope.$apply(function () {
          chat.messages = JSON.parse(event.newValue);
        });
      }
    });

    // Initialize all messages (for demonstration purposes)
    chat.allMessages = chat.messages.slice(); // Make a copy of the initial messages

    // Function to check if a message was sent by the current user
    chat.isMessageFromCurrentUser = function (message) {
      return message.username === chat.username;
    };
  })
  .directive('infiniteScroll', function () {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        var raw = element[0];
        element.bind('scroll', function () {
          if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight) {
            scope.$apply(attrs.infiniteScroll);
          }
        });
      }
    };
  });
