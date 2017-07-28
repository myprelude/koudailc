var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Article = mongoose.model('Article'),
  User = mongoose.model('User');
var moment = require('moment');
module.exports = function (app) {
  app.use('/', router);
};

router.get('/', function (req, res, next) {
  Article.find(function (err, articles) {
    if (err) return next(err);
    res.render('index',{
        art:articles
    });
  });
});
/**
 * [description] index
 */
router.get('/index', function (req, res, next) {
    Article.find(function (err, articles) {
        if (err) return next(err);
        res.render('index',{
            art:articles
        });
      });
});
/**
 * [description] 文章详情页
 */
router.get('/page', function (req, res, next) {
    console.log(req.query.id);
    var id = req.query.id;
     Article.findOne({_id:id}).then(function(pageInfo){
        if(!pageInfo){
           res.render('error',{
                message:'没有对应的文章',
                status:'404 Not found',
                stack:'不要瞎搞 我们服务器受不了'
            }); 
        }
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
    res.render('shuo');
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
        res.render('add');
    }else{
        res.redirect('/login')
       
    }
    
});
/**
 * [description] 提交文章信息
 */
router.post('/add', function (req, res, next) {
    console.log(moment().format('L'));
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