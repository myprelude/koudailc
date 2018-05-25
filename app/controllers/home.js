var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  formidable = require('formidable'),
  Article = mongoose.model('Article');
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
  res.render('index',{show:false});

});

router.get('/edit', function (req, res, next) {
    res.render('edit',{
      show:true,
      changeInfo:true,
      title:'',
      topic:'',
      keyword:'',
      cate:''
    });
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
router.get('/editor', function (req, res, next) {
	if(req.query.id){
		Article.findOne({_id:req.query.id},function(e,art){console.log(art)
			res.render('editdoc',{
				data:art,
				id:req.query.id
			})
		})
	}else{
		res.render('error')
	}
    
});

router.post('/update/doc',function(req, res, next){
    if(req.body.auth == 123456){
        Article.update(
			{_id:req.body.id},
			{title:req.body.title,
			text:req.body.text,
			topic:req.body.topic,
			keyword:req.body.keyword,
			cate:req.body.cate},function(error){
        if(error){
          res.json({message:'文章保存失败！',code:400})
        }else{
          console.log('saved OK!');
          res.json({message:'成功',code:200,id:req.body.id})
        }
      });
    }else{
		res.json({message:'您暂时没有提交权限！',code:400})
	}
});

router.get('/doc', function (req, res, next) {
  console.log(req.query.id);
  Article.find({cate:req.query.id},function(e,artCate){
    if(e){
      res.render('error')
    }else{
      res.render('document',{
		  	show:false,
			cate:artCate
		});
    }
  })
    
});
router.get('/doc/record', function (req, res, next) {
  Article.find({_id:req.query.id},function(e,art){
    if(e){
      res.render('error')
    }else{
      res.render('record',{
        doc:art,
        title:art[0].title
      })
    }
  })

});
router.post('/upload/doc',function(req, res, next){
    if(req.body.auth == 123456){
      var art = new Article({
        title:req.body.title,
        text:req.body.text,
        topic:req.body.topic,
        keyword:req.body.keyword,
        cate:req.body.cate})
        art.save(function(error){
        if(error){
          
        }else{
          console.log('saved OK!');
          res.json({message:'成功',code:200,id:art.id})
        }
      });
    }else{
		res.json({message:'您暂时没有提交权限！',code:400})
	}
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
			res.json(err);
		}else{
			res.json({path:'![img](upload/'+temp+name+')',message:'成功'});
		}
	});
});
router.get('*', function(req, res){
	res.render('error')
})