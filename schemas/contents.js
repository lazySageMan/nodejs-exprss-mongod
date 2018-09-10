var mongoose=require('mongoose');
//分类的表结构
var Schema=mongoose.Schema;
var contentSchema=new Schema({
    //关联字段 内容分类的Id
    category:{
        //类型
        type:mongoose.Schema.Types.ObjectId,
        //引用
        ref:'category'
    },
    //用户
    users:{
        //类型
        type:mongoose.Schema.Types.ObjectId,
        //引用
        ref:'users'
    },
    //点击量
    views:{
        type:Number,
        default:0
    },
    //时间
    addTime:{
        type:Date,
        default:new Date()
    },
    //标题
    title:String,
    //简介
    description:{
        type:String,
        default:''
    },
    //内容
    content:{
        type:String,
        default:''
    },
    comments:{
        type:Array,
        default:[]
    }
});
//module.exports= userSchema;
//发布为模型
var content=mongoose.model('Content',contentSchema);
module.exports=content;