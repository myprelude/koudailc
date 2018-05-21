var express = require('express'),
  router = express.Router(),
//   mongoose = require('mongoose'),
  formidable = require('formidable');
//   Article = mongoose.model('Article'),
//   User = mongoose.model('User'),
//   Riji = mongoose.model('Riji');
var moment = require('moment');
var multer = require('multer');
var fs = require('fs');

var storage = multer.diskStorage({
  // destination # 设置文件上传路径,本地必须存在的物理路径
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  // filename # 重命名文件
  filename: function (req, file, cb) {
    // 重命名为现在的时间，加上自己的名字
    cb(null, Date.now() + file.originalname)
  }
})

var upload = multer({
  storage: storage
})
module.exports = function (app) {
  app.use('/', router);
};

router.get('/', function (req, res, next) {
  res.render('index');

});

router.get('/edit', function (req, res, next) {
    res.render('edit');
//   var count = 0,show;
//     var page = req.query.page?req.query.page:1;
//      if(req.cookies.userInfo!==undefined&&req.cookies.userInfo.sign){
//     show=true;}else{ show=false;}
//     Article.find().sort({_id:-1}).skip((page-1)*5).limit(5).exec(function(e,articles){
//         if (e) return next(e);
//         Article.find(function (err, r) {
//             if (err) return next(err);
//             count = r.length;
//              res.render('index',{
//                 art:articles,
//                 count:Math.ceil(count/5),
//                 page:page,
//                 show:show
//             });
//           });  
//     })
});
router.get('/doc', function (req, res, next) {
    res.render('document');

});
router.get('/doc/record', function (req, res, next) {
    res.render('record');

});
router.post('/upload/img',upload.single('avatar'), function (req, res, next) {
	var base = req.body.base,name = req.body.name;
	//过滤data:URL
	var base64Data = base.replace(/^data:image\/\w+;base64,/, "");
	var dataBuffer = new Buffer(base64Data, 'base64');
	var temp = Date.now();
	var url = 'public/upload/';
	fs.writeFile(url + temp + name, dataBuffer, function(err) {
		if(err){
			console.log(err)
			res.json(err);
		}else{
			res.json({path:'![img](upload/'+temp+name+')',message:'成功'});
		}
	});
});
router.get('*', function(req, res){
	res.render('error')
})