// Example model

var mongoose = require('mongoose'),
  	Schema = mongoose.Schema;

var ArticleSchema = new Schema({
  	title: String,
  	topic: String,
	text: String,
	logo: String,
  	date: {type : Date, default: Date.now},
	cate: String,
	keyword : String,
});

mongoose.model('Article', ArticleSchema);

