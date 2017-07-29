// Example model

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var RijiSchema = new Schema({
  title: String,
  text: String,
  date:String,
  author:String,
  cate:String,

});

// RijiSchema.virtual('date')
//   .get(function(){
//     return this._id.getTimestamp();
//   });

mongoose.model('Riji', RijiSchema);
