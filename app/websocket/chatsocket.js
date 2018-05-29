// var express = require('express');
// var expressWs = require('express-ws')(app);
module.exports = function (app) {
    app.ws('/chat', function(ws,req){
        ws.on('message',function(msg){
            console.log(msg)
        })
    });
  };
