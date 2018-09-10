var express=require('express');
var router=express.Router();
var Users=require('../schemas/users');
var Content=require('../schemas/contents');
var responseData;
router.use(function(req,res,next){
    responseData={
        code:0,
        message:''
    };
    next();
});
router.post('/user/register',function(req,res,next){
    var userName=req.body.username;
    var passWord=req.body.password;
    var rePassword=req.body.rePassword;
    if(userName==''||passWord==''||rePassword==''){
        responseData.code=1;
        responseData.message='账号或密码为空';
        res.json(responseData);
        return;
    }
    if(passWord!=rePassword){
        responseData.code=2;
        responseData.message='两次密码不一致';
        res.json(responseData);
        return;
    }
    Users.findOne({userName:userName},function(err,userInfo){
        if(err){
            console.log('查询失败');
        }else{
            if(userInfo){
                responseData.code=3;
                responseData.message='用户名已经存在了';
                res.json(responseData);
                return;
            }else{
                var user=new Users({
                    userName:userName,
                    passWord:passWord
                });
                user.save();
                responseData.message='注册成功';
                res.json(responseData);
            }
        }
    });
});
router.post('/user/login',function(req,res,next){
    var userName=req.body.username;
    var passWord=req.body.password;
    if(userName==''||passWord==''){
        responseData.code=1;
        responseData.message='用户名或密码为空';
        res.json(responseData);
        return;
    }
    Users.findOne({userName:userName,passWord:passWord},function(err,userInfo){
       if(err){
           console.log('查询错误');
       } else{
           if(!userInfo){
               responseData.code=2;
               responseData.message='用户名或密码错误';
               res.json(responseData);
               return;
           }else{
               responseData.message='登录成功';
               responseData.userInfo={
                   userId:userInfo._id,
                   userName:userInfo.userName
               };
               //设置req.cookies并发送给浏览器
               req.cookies.set('userInfo',JSON.stringify({userId:userInfo._id,userName:userInfo.userName}));
               res.json(responseData);
           }
       }
    });
});
router.get('/user/logout',function(req,res,next){
    req.cookies.set('userInfo',null);
    responseData.message='退出成功';
    res.json(responseData);
});
//验证是否登录
router.get('/comment/post',function(req,res,next){
    if(req.userInfo.userId==undefined){
        responseData.code=1;
        responseData.message='请先登录';
        res.json(responseData);
    }else{
        responseData.message='请评论';
        res.json(responseData);
    }

});
//评论保存
router.post('/comment/post',function(req,res,next){
    /*console.log(req.body.content);*/
    var contentId=req.body.contentId||'';
    var postData={
        userName:req.userInfo.userName,
        postTime:new Date(),
        content:req.body.content
    };
    Content.findOne({_id:contentId}).then(function(contentData){
        contentData.comments.push(postData);
        contentData.save();
        return contentData
    }).then(function(data){
        console.log(data);
        responseData.message="评论成功";
        responseData.data=data;
        res.json(responseData);

    })
});
//获取指定文章的评论
router.get('/comment',function(req,res,next){
    var contentId=req.query.contentId||'';
    Content.findOne({_id:contentId}).then(function(contents){
        responseData.data=contents;
        res.json(responseData);
    });
});

module.exports=router;