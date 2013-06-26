
/**
 * Module dependencies.
 */

var express = require('express')
  , fs = require('fs')
  , passport = require('passport');

/**
 * Main application
 */

// Load configurations
// if test env, load example file
var env = process.env.NODE_ENV || 'development'
  , config = require('./config/config')[env]
  , auth = require('./config/middlewares/authorization')
  , socket = require('socket.io')
  , http = require('http')
  , mongoose = require('mongoose');

// Bootstrap db connection
mongoose.connect(config.db);

// Bootstrap models
var models_path = __dirname + '/app/models';
fs.readdirSync(models_path).forEach(function (file) {
  require(models_path + '/' + file);
})

// bootstrap passport config
require('./config/passport')(passport, config);

var app = express();

// express settings
require('./config/express')(app, config, passport);

// Bootstrap routes
require('./config/routes')(app, passport, auth);

// Start the app by listening on <port>
var port = process.env.PORT || 3000;

var server = http.Server(app);

var io = socket.listen(server);

server.listen(port);
console.log('Express app started on port ' + port);

// expose app
exports = module.exports = app;

io.configure(function () {
  io.set('transports', ['xhr-polling']);
  io.set('polling duration', 10);
});

var usernames = [];
var rooms = [];
io.sockets.on('connection', function (socket) {

  socket.on('adduser', function(username) {
    socket.username = username;
    usernames[username] = username;
    socket.join('room1');
    socket.emit('updatechat', 'SERVER', 'you have connected to room1');
    socket.broadcast.to('room1').emit('updatechat', 'SERVER', username + ' has connected to this room');
    socket.emit('updaterooms', rooms, 'room1');
  });

  socket.on('sendchat', function (data) {
    io.sockets.in(socket.room).emit('updatechat', socket.username, data);
  });

  socket.on('switchRoom', function(newroom) {
    socket.leave(socket.room);
    socket.join(newroom);
    socket.emit('updatechat', 'SERVER', 'you have connected to ' + newroom);
    socket.broadcast.to(socket.room).emit('updatechat', 'SERVER', socket.username + 'has left this room');
    socket.room = newroom
    socket.broadcast.to(newroom).emit('updatechat', 'SERVER', socket.username + 'has joined this room');
    socket.emit('updaterooms', rooms, newroom);
  });

  socket.on('disconnect', function () {
    delete usernames[socket.username];
    io.sockets.emit('updateusers', usernames);
    socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
  });
});