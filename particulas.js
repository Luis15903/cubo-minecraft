(function(){
  var cv=document.getElementById('fx'),g=cv.getContext('2d'),W,H,P=[],still=matchMedia('(prefers-reduced-motion:reduce)').matches;
  function size(){var r=devicePixelRatio||1;W=cv.width=innerWidth*r;H=cv.height=innerHeight*r;g.setTransform(r,0,0,r,0,0);W/=r;H/=r}
  addEventListener('resize',size);size();
  function mk(init){
    var a=Math.random()*6.283,rad=60+Math.random()*190;
    return{x:W/2+Math.cos(a)*rad*1.2,y:init?Math.random()*H:H*0.46+Math.random()*180,r:0.6+Math.random()*2.2,vy:0.15+Math.random()*0.55,ph:Math.random()*6.283,sw:0.2+Math.random()*0.6,tw:0.5+Math.random()*1.5};
  }
  for(var i=0;i<260;i++)P.push(mk(true));
  function draw(t){
    g.clearRect(0,0,W,H);g.globalCompositeOperation='lighter';
    P.forEach(function(p,i){
      if(!still){p.y-=p.vy;p.x+=Math.sin(t/1000*p.sw+p.ph)*0.35}
      if(p.y<-10){P[i]=mk(false);return}
      var a=(0.35+0.65*Math.abs(Math.sin(t/1000*p.tw+p.ph)))*Math.min(1,p.y/(H*0.4));
      var gr=g.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*6);
      gr.addColorStop(0,'rgba(190,250,255,'+a+')');gr.addColorStop(0.3,'rgba(63,216,255,'+a*0.55+')');gr.addColorStop(1,'rgba(26,155,255,0)');
      g.fillStyle=gr;g.beginPath();g.arc(p.x,p.y,p.r*6,0,6.283);g.fill();
    });
    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
})();