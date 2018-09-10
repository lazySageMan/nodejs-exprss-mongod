var express=require('express');
var app=express();
var swig=require('swig');
var mongoose=require('mongoose');
var bodyParser=require('body-parser');
var cookies=require('cookies');
var User=require('./schemas/users');
app.engine('html',swig.renderFile);
app.set('views','./views');
app.set('view engine','html');
swig.setDefaults({cache:false});
app.use(bodyParser.urlencoded({extended:false}));

app.use(function(req,res,next){
    //创建一个新的cookies,保存在req.cookies中
   req.cookies=new cookies(req,res);
   //把cookies信息存储到req.userInfo
   req.userInfo={};
   if(req.cookies.get('userInfo')){
       req.userInfo=JSON.parse(req.cookies.get('userInfo'));
       //查询数据库，将isAdmin复制给req.userInfo.isAdmin
       User.findById(req.userInfo.userId,function(err,userInfo){
           req.userInfo.isAdmin=Boolean(userInfo.isAdmin);
           next();
       });
   }else{
       next();
   }
});
//静态文件托管
app.use('/public',express.static(__dirname+'/public'));
//分模块开发
var main=require('./router/main');
var api=require('./router/api');
var admin=require('./router/admin');
var HTML5=require('./router/HTML5');

app.use('/',main);
app.use('/api',api);
app.use('/admin',admin);
app.use('/HTML5',HTML5);

//数据库连接
mongoose.connect('mongodb://localhost:27018/blog',function(err){
   if(err){
       console.log('数据库连接失败');
   }else{
       console.log('数据库连接成功');
       app.listen(8888);
   }
});