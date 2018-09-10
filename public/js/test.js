window.onload=function(){
    var oBox=document.getElementById("box");
    var oDiv=oBox.getElementsByTagName("div");
    var off=true;
    /*让div旋转起来*/
    setTimeout(go,300);
    oDiv[9].onclick=function(){
        if(off){
            shink();
        }else{
            go()
        }
        off=!off;
    };
    for(var i=0;i<oDiv.length-1;i++){
        oDiv[i].index=i;
        oDiv[i].onclick=function(){
            for(var i=0;i<oDiv.length;i++){
                if(i<this.index){
                    oDiv[i].style.transform="rotate("+(350-(i*17)+this.index*17-80+10)+"deg)";
                }
                if(i>this.index){
                    oDiv[i].style.transform="rotate("+(350-(i*17)+this.index*17-80-10)+"deg)";
                }
            }
            oDiv[this.index].style.transform="rotate("+(350-(this.index*17)+this.index*17-80)+"deg)";
        }
    }
    function go(){
        for(var i=0;i<oDiv.length;i++){
            oDiv[i].style.transform="rotate("+(350-(i*17))+"deg)";
        }
    }
    function shink(){
        for(var i=0;i<oDiv.length;i++){
            oDiv[i].style.transform="rotate(0deg)";
        }
    }
};