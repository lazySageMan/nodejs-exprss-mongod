var express=require('express');
var router=express.Router();

router.get('/',function(req,res){
   res.render('../html5/new ajax.html');
});

router.get('/geoLocation',function(req,res,next){
    res.render('../html5/geolocation.html');
});

router.get('/storage',function(req,res,next){
    res.render('../html5/storage.html');
});
router.get('/login',function(req,res,next){
    res.render('../html5/test login.html');
});
router.post('/login',function(req,res,next){
    res.json({"code":"1","message":"hello"});
});

router.get('/dataBase',function(req,res,next){
    res.render("../html5/database.html")
});
router.get('/manifest',function(req,res,next){
    res.render("../html5/manifest.html");
});
router.get('/IndexedDB',function(req,res,next){
    res.render("../html5/IndexedDB.html");
});
module.exports=router;