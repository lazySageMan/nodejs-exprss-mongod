window.onload=function(){
    var register=document.getElementById('register');
    var login=document.getElementById('login');
    var userInfo=document.getElementById('userInfo');
    (function(){
        var oSpan=document.getElementsByClassName('link');
        if(oSpan[0]){
            oSpan[0].onclick=function(){
                register.style.display='none';
                login.style.display='block';
            };
            oSpan[1].onclick=function(){
                register.style.display='block';
                login.style.display='none';
            };
        }
    })();
    //注册
    (function(){
        if(register) {
            var oBtn1 = register.getElementsByTagName('input');
            oBtn1[3].onclick = function () {
                ajax('post', '/api/user/register', 'username=' + oBtn1[0].value + '&password=' + oBtn1[1].value + '&rePassword=' + oBtn1[2].value + '', function (data) {
                    var d = JSON.parse(data);
                    if (d.code == 1) {
                        alert(d.message);
                    } else if (d.code == 2) {
                        alert(d.message);
                    } else if (d.code == 3) {
                        alert(d.message);
                    } else {
                        alert(d.message);
                        register.style.display='none';
                        login.style.display='block';
                    }
                });
            }
        }
    })();
    //登录
    (function(){
        if(login) {
            var oBtn2 = login.getElementsByTagName('input');
            oBtn2[2].onclick = function () {
                ajax('post', '/api/user/login', 'username=' + oBtn2[0].value + '&password=' + oBtn2[1].value + '', function (data) {
                    var d = JSON.parse(data);
                    if (d.code == 1) {
                        alert(d.message);
                    } else if (d.code == 2) {
                        alert(d.message);
                    } else {
                        alert(d.message);
                        window.location.reload();
                    }
                });
            }
        }
    })();
    //退出
    (function(){
        if(userInfo){
            var logout=userInfo.getElementsByClassName('logout');
            logout[0].onclick=function(){
                ajax('get','/api/user/logout','',function(data){
                    var d=JSON.parse(data);
                    if(d.code==0){
                        alert(d.message);
                        window.location.reload();
                    }
                });
            }
        }
    })()

};
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