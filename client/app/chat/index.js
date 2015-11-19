// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('../..')(server);
var port = process.env.PORT || 3000;

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(__dirname + '/public'));

// Chatroom

// usernames which are currently connected to the chat
var usernames = {};
var numUsers = 0;
//list of users online
var allUsers = [{nickname:"", color:"#000"}];

io.on('connection', function (socket) {
  var addedUser = false;

  // when the client emits 'new message', this listens and executes
  socket.on('new message', function (data) {
    // we tell the client to execute 'new message'
    if (data.to) {
      usernames[data.to].emit('new message', {
        username: socket.username,
        message: data
      });
    } else {
      socket.broadcast.emit('new message', {
        username: socket.username,
        message: data 
      });
    }  
  });

  // when the client emits 'add user', this listens and executes
  socket.on('add user', function (username) {
    if (usernames[username]) {
      socket.emit('isAdded', {result: false});
    } else {
      socket.emit('isAdded', {result: true});
      // we store the username in the socket session for this client
      socket.username = username;
      // add the client's username to the global list
      usernames[username] = username;
      ++numUsers;
      addedUser = true;
      allUsers.push(data);
      // echo to the new user with number of online users
      socket.emit('login', allUsers);
      // echo globally (all clients) that a person has connected
      socket.broadcast.emit('user joined', {
        username: socket.username,
        numUsers: numUsers
      });
    }
  });

  // when the client emits 'typing', we broadcast it to others
  socket.on('typing', function () {
    socket.broadcast.emit('typing', {
      username: socket.username
    });
  });

  // when the client emits 'stop typing', we broadcast it to others
  socket.on('stop typing', function () {
    socket.broadcast.emit('stop typing', {
      username: socket.username
    });
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', function () {
    // remove the username from global usernames list
    if (addedUser) {
      delete usernames[socket.username];
      --numUsers;

      // echo globally that this client has left
      socket.broadcast.emit('user left', {
        username: socket.username,
        numUsers: numUsers
      });


      for (var i = 0; i < allUsers.length; ++i) {
        if (allUsers[i].username === socket.username)
          allUsers.splice(i, 1);
      }
    }
  });
});
