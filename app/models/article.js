// Example model

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var ArticleSchema = new Schema({
  title: String,
  topic: String,
  text: String,
  date:{type:Date,default:Date.now},
  author:String,
  cate:String,

});

// ArticleSchema.virtual('date')
//   .get(function(){
//     return this._id.getTimestamp();
//   });

mongoose.model('Article', ArticleSchema);

