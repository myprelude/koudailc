var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var UserSchema = new Schema({
  username:String,
  password:String,
  data:{type:Date,default:Date.now}
});

mongoose.model('User', UserSchema);