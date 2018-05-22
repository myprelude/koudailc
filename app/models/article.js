// Example model

var mongoose = require('mongoose'),
  	Schema = mongoose.Schema;

var ArticleSchema = new Schema({
  	title: String,
  	topic: String,
  	text: String,
  	date: String,
 	cate: String,
});

mongoose.model('Article', ArticleSchema);

