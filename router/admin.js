var express=require('express');
var User=require('../schemas/users');
var Category=require('../schemas/category');
var Content=require('../schemas/contents');
var router=express.Router();
router.use(function(req,res,next){
    if(!req.userInfo.isAdmin){
        res.send('你不是管理员，禁止访问该接口');
        return;
    }
    next();
});
//首页
//退出管理后台
// router.get('/logout',function(req,res,next){
//     Category.find(function(category){
//         res.render('main/index',{
//             userInfo:req.userInfo,
//             category:category
//         });
//     })
// });
router.get('/',function(req,res,next){
    res.render('admin/index',{
        userInfo:req.userInfo
    });
});
//用户管理
router.get('/user',function(req,res,next){

    //分页
    var page=Number(req.query.page||1);
    var limit=4;
    var pageMax=0;
    User.count().then(function(count){
        pageMax=Math.ceil(count/limit);
        if(page>pageMax){
            page=pageMax;
        }
        if(page<1){
            page=1;
        }
        var skip=(page-1)*limit;
        User.find().limit(limit).skip(skip).then(function(data){
            res.render('admin/user_index',{
                userInfo:req.userInfo,
                data:data,
                page:page,
                pageMax:pageMax
            });
        });
    });
});

//分类管理
//1分类主页
router.get('/category',function(req,res,next){
    var page=Number(req.query.page||1);
    var limit=10;
    var pageMax=0;
    Category.count().then(function(count){
        pageMax=Math.ceil(count/limit);
        if(page>pageMax){
            page=pageMax;
        }
        if(page<1){
            page=1;
        }
        var skip=(page-1)*limit;
        //sort({ _id })
        Category.find().sort({_id:-1}).limit(limit).skip(skip).then(function(data){
            res.render('admin/category_index',{
                userInfo:req.userInfo,
                data:data,
                page:page,
                pageMax:pageMax
            });
        });
    });
});
//分类修改
router.get('/category/edit',function(req,res,next){
    var id=req.query.id||'';
    Category.findOne({_id:id},function(err,data){
        if(!err){
            res.render('admin/edit_index',{
                userInfo:req.userInfo,
                data:data
            })
        }
    })
});
//保存修改
router.post('/category/edit',function(req,res,next){
    var Name=req.body.name;
    //console.log(req.body.name);
    var id=req.query.id;
    if(Name==''){
        res.render('admin/error',{
            userInfo: req.userInfo,
            message: '不能将类名置空'
        });
        return;
    }else{
        Category.findOne({_id:{$ne:id},name:Name},function(err,data){
            if(data){
                console.log(data);
                res.render('admin/error',{
                    userInfo: req.userInfo,
                    message: '数据库中已有相同的类名'
                });
                return;
            }else{
                Category.update({_id: id},{name: Name}).then(function(){
                    res.render('admin/error',{
                        userInfo: req.userInfo,
                        message: '修改成功',
                        url:'/admin/category'
                    });
                });
            }
        });
    }
});
//分类删除
router.get('/category/delete',function(req,res,next){
    var id=req.query.id||'';
    Category.remove({_id:id},function(err){
        if(!err){
            res.render('admin/error',{
                userInfo:req.userInfo,
                message:'删除成功',
                url:'/admin/category'
            });
        }
    });
});

//2分类添加
router.get('/category/add',function(req,res,next){
    res.render('admin/add',{
        userInfo:req.userInfo
    })
});
router.post('/category/add',function(req,res,next){
    var name=req.body.name;
    if(name==''){
        res.render('admin/error',{
            userInfo:req.userInfo,
            info:'错误提示',
            message:'名称不能为空',
            url:''
        });
    }else{
        Category.findOne({name:name},function(err,data){
            if(!err){
                if(data){
                    res.render('admin/error',{
                        userInfo:req.userInfo,
                        info:'错误提示',
                        message:'分类已经存在了',
                        url:''
                    });
                }else{
                    var cate=new Category({name:name});
                    cate.save(function(err,data){
                        if(!err){
                            res.render('admin/error',{
                                userInfo:req.userInfo,
                                info:'成功提示',
                                message:'添加成功',
                                url:'/admin'
                            });
                        }
                    })
                }
            }
        });
    }
});

//3内容管理
//内容首页
router.get('/content',function(req,res,next){
    var page=Number(req.query.page||1);
    var limit=5;
    var pageMax=0;
    Content.count().then(function(count){
        pageMax=Math.ceil(count/limit);
        if(page>pageMax){
            page=pageMax;
        }
        if(page<1){
            page=1;
        }
        var skip=(page-1)*limit;
        //sort({ _id })
        Content.find().sort({_id:-1}).limit(limit).skip(skip).populate(['category','users']).then(function(content){

            res.render('admin/content_index',{
                userInfo:req.userInfo,
                content:content,
                page:page,
                pageMax:pageMax
            });
        });
    });
});
//内容添加
router.get('/content/add',function(req,res,next){
    Category.find().sort({_id:-1}).then(function(data){
        res.render('admin/content_add',{
            userInfo:req.userInfo,
            data:data
        });
    });
});
router.post('/content/add',function(req,res,next){
    var classIfy=req.body.classIfy;
    var title=req.body.title;
    var introduction=req.body.introduction;
    var content=req.body.content;

    if(title==''||introduction==''||content==''){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'标题，简介或内容为空'
        });
        return;
    }else{
        var newContent=new Content({
            category:classIfy,
            title:title,
            users:req.userInfo.userId.toString(),
            description:introduction,
            content:content
        });
        newContent.save(function(err,dat5afc3b5b57c5952784f1ee4aa){
            console.log(data);
            res.render('admin/error',{
                userInfo:req.userInfo,
                message:'保存成功',
                url:'/admin/content'
            })
        })
    }
});
//内容的修改
router.get('/content/edit',function(req,res,next){
    Category.find(function(err,data){
        var id=req.query.id;
        Content.findOne({_id:id}).populate('category').then(function(content){
            res.render('admin/content_edit',{
               userInfo:req.userInfo,
                data:data,
                content:content
            });
        });
    });
});
router.post('/content/edit',function(req,res,next){
    var id=req.query.id;
    var title=req.body.title;
    var classIfy=req.body.classIfy;
    var introduction=req.body.introduction;
    var content=req.body.content;
    if(title==''||introduction==''||content==''){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'标题，简介或内容为空'
        });
    }else{
        Content.update({_id:id},{category:classIfy,title:title,description:introduction,content:content}).then(function(content){
            res.render('admin/error',{
                userInfo:req.userInfo,
                message:'修改成功',
                url:'/admin/content'
            })
        })
    }
});
//内容删除
router.get('/content/delete',function(req,res,next){
    var id=req.query.id;
    Content.remove({_id:id},function(err,data){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'删除成功',
            url:'/admin/content'
        });
    });
});
module.exports=router;