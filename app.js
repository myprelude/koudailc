var express = require('express');
var app = express(),
	// server = require("http").createServer(app),
	config = require('./config/config');
	glob = require('glob'),
	mongoose = require('mongoose'),
	sio = require("socket.io"); 
	mongoose.connect(config.db,{useMongoClient:true});


var db = mongoose.connection;

db.on('error', function () {
  throw new Error('unable to connect to database at ' + config.db);
});

var models = glob.sync(config.root + '/app/models/*.js');
models.forEach(function (model) {
  require(model);
});
 
module.exports = require('./config/express')(app, config);

var server = app.listen(config.port, function () {
  console.log('Express server listening on port ' + config.port);
});

var io = sio.listen(server);

io.on('connection', function(socket){
	console.log('a user connected');

	socket.on("start", function(obj) {
		var time = new Date().getTime();
		obj.time = time;

        io.emit("start",obj);
    });
	
    socket.on("disconnect", function() {
        console.log("a user go out");
    });

    socket.on("message", function(obj) {
        //延迟3s返回信息给客户端
		console.log(obj);
		var time = new Date().getTime();
		obj.time = time;
        io.emit("message", obj);
    });
    socket.on('login',function(obj){
		io.emit("logining", obj);
        console.log(obj);
	})
	socket.on('loginout',function(obj){
		io.emit("loginout", obj);
    })
});
