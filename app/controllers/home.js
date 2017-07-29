var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Article = mongoose.model('Article'),
  User = mongoose.model('User'),
  Riji = mongoose.model('Riji');
var moment = require('moment');
module.exports = function (app) {
  app.use('/', router);
};

router.get('/', function (req, res, next) {
  var count = 0,show;
    var page = req.query.page?req.query.page:1;
     if(req.cookies.userInfo!==undefined&&req.cookies.userInfo.sign){
    show=true;}else{ show=false;}
    Article.find().skip((page-1)*5).limit(5).exec(function(e,articles){
        if (e) return next(e);
        Article.find(function (err, r) {
            if (err) return next(err);
            count = r.length;
             res.render('index',{
                art:articles,
                count:Math.ceil(count/5),
                page:page,
                show:show
            });
          });  
    })
});
/**
 * [description] index
 */
router.get('/index', function (req, res, next) {
    var count = 0,show;
    var page = req.query.page?req.query.page:1;
     if(req.cookies.userInfo!==undefined&&req.cookies.userInfo.sign){
    show=true;}else{ show=false;}
    Article.find().skip((page-1)*5).limit(5).exec(function(e,articles){
        if (e) return next(e);
        Article.find(function (err, r) {
            if (err) return next(err);
            count = r.length;
             res.render('index',{
                art:articles,
                count:Math.ceil(count/5),
                page:page,
                show:show
            });
          });  
    })
});
/**
 * [description] 文章详情页
 */
router.get('/page', function (req, res, next) {
    var id = req.query.id;
     Article.findOne({_id:id}).then(function(pageInfo){
        res.render('page',{
            art:pageInfo
        });
     })
    
});
/**
 * [description] 关于我们
 */
router.get('/about', function (req, res, next) {
    res.render('about');
});
/**
 * [description] 口袋每日
 */
router.get('/shuo', function (req, res, next) {
    var count = 0,show;
    var page = req.query.page?req.query.page:1;
    if(req.cookies.userInfo!==undefined&&req.cookies.userInfo.sign){
    show=true;}else{ show=false;}
    Riji.find().skip((page-1)*5).limit(5).exec(function(e,articles){
        if (e) return next(e);
        Riji.find(function (err, r) {
            if (err) return next(err);
            count = r.length;
             res.render('shuo',{
                art:articles,
                count:Math.ceil(count/5),
                page:page,
                show:show
            });
          });  
    })
});
/**
 * [description]添加口袋每日
 */
router.post('/shuo', function (req, res, next) {
    var message={};
    if(req.body.title===''||req.body.info===''){
        message.code=1;
        message.message='信息填写不完整';
        res.json(message);
        return;
    }else{
        var art = new Riji({
            title:req.body.title,
            text:req.body.info,
            author:req.cookies.userInfo.name,
            date:moment().format('L')
        });
        art.save().then(function(info){
            message.code=0;
            message.message='文章添加成功';
            res.json(message);
        })
    }
});
/**
 * [description] 杂
 */
router.get('/riji', function (req, res, next) {
    res.render('riji');
});
/**
 * [description] 口袋活动
 */
router.get('/xc', function (req, res, next) {
    res.render('xc');
});
/**
 * [description] 学无止境
 */
router.get('/learn', function (req, res, next) {
    res.render('learn');
});
/**
 * [description] 添加文章
 */
router.get('/add', function (req, res, next) {
    if(req.cookies.userInfo!==undefined&&req.cookies.userInfo.sign){
        if(req.query.id==undefined){
            res.render('add');
        }else{
            var id = req.query.id;
             Article.findOne({_id:id}).then(function(pageDate){
                res.render('add',{
                    arts:pageDate,
                });
            });
        }
    }else{
        res.redirect('/login')  
    }
    
});
/**
 * [description] 提交文章信息
 */
router.post('/add', function (req, res, next) {
    var message={};
    if(req.body.title===''||req.body.info===''||req.body.topic===''||req.body.cate===''){
        message.code=1;
        message.message='信息填写不完整';
        res.json(message);
        return;
    }else{
        var art = new Article({
            title:req.body.title,
            topic:req.body.topic,
            text:req.body.info,
            author:req.cookies.userInfo.name,
            cate:req.body.cate,
            date:moment().format('L')
        });
        art.save().then(function(info){
            message.code=0;
            message.message='文章添加成功';
            res.json(message);
        })
    }
});
/**
 * [description] login
 */
router.get('/login', function (req, res, next) {
    res.render('login');
});
router.post('/login', function (req, res, next) {
    var name = req.body.name;
    var password = req.body.password;
    var responseMessage={};
    if(name==''){
        // 验证用户名不能为空
        responseMessage.code=1;
        responseMessage.message='用户名不能为空';
        res.json(responseMessage);
        return;
    }
    if(password==''){
        // 验证密码不能为空
        responseMessage.code=1;
        responseMessage.message='密码不能为空';
        res.json(responseMessage);
        return;
    }
    User.findOne({name:name,password:password}).then(function(userInfo){
        // userInfo 为null  表示没有找到用户
        if(!userInfo){
            responseMessage.code=1;
            responseMessage.message='用户名或者密码错误';
            res.json(responseMessage);
            return;
        }
        responseMessage.code=0;
        responseMessage.message='登录成功';
        res.cookie('userInfo',{
            _id:userInfo._id,
            name:name,
            sign:true,
        },{ expires: new Date(Date.now() + 9000000)})
        res.json(responseMessage);
        return;
    })
});