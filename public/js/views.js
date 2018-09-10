var contentId=document.getElementById('contentId');
var ul=document.getElementById('ul');
var tPage=document.getElementsByClassName('tPage');
var aPage=document.getElementsByClassName('aPage');
var bPage=document.getElementsByClassName('bPage');
var pge=document.getElementsByClassName('page');
var pin=document.getElementsByClassName('pin');
var page=1;
var pageMax=0;
var pages=4;
var Contents=[];

window.onload=function(){
    var btn1=document.getElementById('btn');
    var btn2=document.getElementsByClassName('btn');
    var btn3=document.getElementById('btn1');
    var textarea=document.getElementById('textarea');
    var p=document.getElementsByClassName('p');
    var spany=document.getElementsByClassName('spany');
    function datalist(){
        ajax('get','api/comment','contentId='+contentId.value+'',function(data){
            var d=JSON.parse(data);
            if(d.data.comments==''){
                p[1].style.display='block';
                ul.style.display='none';
                pge[0].style.display='none';
                pin[0].style.display='none';
            }else{
                p[1].style.display='none';
                ul.style.display='block';
                pge[0].style.display='block';
                pin[0].style.display='block';
                spany[0].innerHTML='一共有'+d.data.comments.length+'评论';
                Contents=d.data.comments.reverse();
                commentContent(Contents);
            }

        });
    }
    datalist();
    btn1.onclick=function(){
        ajax('get','api/comment/post','',function(data){
            var d=JSON.parse(data);
            if(d.code==1){
                alert(d.message);
            }else{
                btn1.style.display='none';
                btn2[0].style.display='block';
            }
        });
    };
    btn3.onclick=function(){
        if(textarea.value==''){
            alert('评论不能为空');
        }else {
            ajax('post', 'api/comment/post', 'contentId=' + contentId.value + '&content=' + textarea.value + '', function (data) {
                var d = JSON.parse(data);
                textarea.value='';
                btn1.style.display = 'inline-block';
                btn2[0].style.display = 'none';
                //console.log(d.data.comments);
                commentContent(Contents);
                datalist();
            });
        }
    }
};
function postMissTime(time){
    var date1=new Date(time);
    return date1.getFullYear()+'年'+(date1.getMonth()+1)+'月'+date1.getDate()+'日'+date1.getHours()+':'+date1.getMinutes()+':'+date1.getSeconds();
}
function commentContent(contents){
    var html='';
    var star=Math.max(0,(page-1)*pages);
    var end=Math.min(star+pages,contents.length);
    for(var i=star;i<end;i++){
        html+='<li><div class="info"><span class="span1">'+contents[i].userName+'</span><span class="span2">'+postMissTime(contents[i].postTime)+'</span></div><div class="com"><span>'+contents[i].content+'</span></div>'+'</li><hr/>';
    }

    pageMax=Math.ceil(contents.length/pages);
    aPage[0].innerHTML=page+'/'+pageMax;
    //console.log(html);
    ul.innerHTML=html;
}
tPage[0].onclick=function(){
    page--;
    if(page<1){
        page=1;
    }
    commentContent(Contents);
}
bPage[0].onclick=function(){
    page++;
    if(page>pageMax){
        page=pageMax;
    }
    commentContent(Contents );
}
function ajax(menth,url,date,success){
    var xhr=new XMLHttpRequest();

    if(menth=="get"&&date){
        url+="?"+date;
    }

    xhr.open(menth,url,true);
    if(menth=="get"){
        xhr.send();
    }else{
        xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
        xhr.send(date);
    }


    xhr.onreadystatechange=function(){
        if(xhr.readyState==4){

            success&&success(xhr.responseText);
        }
    }
}