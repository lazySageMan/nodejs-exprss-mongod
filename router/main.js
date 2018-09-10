var express=require('express');
var router=express.Router();
var Category=require('../schemas/category');
var Content=require('../schemas/contents');
//console.log(req.userInfo);
var data;
router.use(function(req,res,next){
    data={
        userInfo:req.userInfo,
        category:req.query.id||'',
        categories:[]
    };
    next();
});
router.get('/',function(req,res,next){
        data.page=Number(req.query.page||1);
        data.count=0;
        data.limit=3;
        data.pageMax=0;
    var where={};
    if(data.category){
        where.category=data.category;
    }
    Category.find().then(function(categories){
        data.categories=categories;
        return Content.where(where).count()
    }).then(function(count){
        data.count=count;
        data.pageMax=Math.ceil(data.count/data.limit);
        if(data.page>data.pageMax){
            data.page=data.pageMax;
        }
        if(data.page<1){
            data.page=1;
        }
        var skip=(data.page-1)*data.limit;
        return Content.where(where).find().limit(data.limit).skip(skip).populate(['category','users']).sort({addTime:-1});
    }).then(function(content){
        data.content=content;
        //console.log(data);
        res.render('main/index',{data:data});
    });
});

router.get('/views',function(req,res,next){
    Category.find(function(err,categorys){
        data.categories=categorys;
    });
   var contentId=req.query.contentId||'';
   Content.findOne({_id:contentId}).populate(['category','users']).then(function(contents){
       data.content=contents;
       contents.views++;
       contents.save();
       res.render('main/views',{data:data});
   })
});

module.exports=router;