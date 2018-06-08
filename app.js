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
var userGroup = [],timeTip=null;
io.on('connection', function(socket){

    socket.on("message", function(obj) {
        //延迟3s返回信息给客户端
		if(timeTip){
			if(obj.timeTip-timeTip>60000){
				obj.timeTip = new Date().getTime();
			}else{
				obj.timeTip = false;
			}
		}else{
			obj.timeTip = new Date().getTime();
		}
		
		console.log(obj);

        io.emit("message", obj);
    });
    socket.on('loginIn',function(obj){
		userGroup.push(obj);
		timeTip = new Date().getTime();
		obj.timeTip = new Date().getTime();

		io.emit("loginIn", obj);

	})
	socket.on('loginOut',function(obj){

		userGroup.forEach(function(item,i){
			if(item.id == obj.id){
				userGroup.splice(i,1)
			}
		})

		if(obj.senderInfo.id){
			io.emit("loginOut", obj);
		}
		
    })
});
