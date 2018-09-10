var mongoose=require('mongoose');
//用户的表结构
var Schema=mongoose.Schema;
var userSchema=new Schema({
    userName:String,
    passWord:String,
    isAdmin:{
        type:Boolean,
        default:false
    }
});
//module.exports= userSchema;
//发布为模型
var personSchema=mongoose.model('users',userSchema);
module.exports=personSchema;