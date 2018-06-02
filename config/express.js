var express = require('express');
var glob = require('glob');

var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compress = require('compression');
var methodOverride = require('method-override');
var session = require('express-session');
var util = require('util'); 


module.exports = function(app, config) {

  var env = process.env.NODE_ENV || 'development';
  app.locals.ENV = env;
  app.locals.ENV_DEVELOPMENT = env == 'development';
  
  app.set('views', config.root + '/app/views');
  app.set('view engine', 'ejs');

  // app.use(favicon(config.root + '/public/img/favicon.ico'));
  app.use(logger('dev'));
  app.use(bodyParser.json({limit: '50mb'}));
  app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
  app.use(cookieParser());
  app.use(compress());
  app.use(express.static(config.root + '/public'));
  app.use(methodOverride());
  // app.use(session({
  //   secret: 'secret', //为了安全性的考虑设置secret属性
  //   cookie: {maxAge: 60 * 1000 * 60 * 3}, //设置过期时间
  //   resave: true, // 即使 session 没有被修改，也保存 session 值，默认为 true
  //   saveUninitialized: false, //
  // }));
  var controllers = glob.sync(config.root + '/app/controllers/*.js');
  controllers.forEach(function (controller) {
    require(controller)(app);
  });

  // var websockets =  glob.sync(config.root + '/app/websocket/*.js');
  // websockets.forEach(function (websocket) {
  //   require(websocket)(app);
  // });
  //全局我们查看 session 判断是否登录
  // app.use(function(req,res,next){
  //   if(req.session.sign){
  //     console.log(1213464);
  //   }else{
  //     console.log('error....');
  //   }
  // });
  app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });
  
  if(app.get('env') === 'development'){
    app.use(function (err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: err,
        title: 'error'
      });
    });
  }

  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: {},
        title: 'error'
      });
  });

  return app;
};
