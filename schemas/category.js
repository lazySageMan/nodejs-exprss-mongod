var mongoose=require('mongoose');
//分类的表结构
var Schema=mongoose.Schema;
var categorySchema=new Schema({
    name:String
});
//module.exports= userSchema;
//发布为模型
var categorys=mongoose.model('category',categorySchema);
module.exports=categorys;