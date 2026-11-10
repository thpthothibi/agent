/* HTB koi v4 — continuous dorsal swimming. Original texture: imagegen, 09 Nov 2026.
   No network requests beyond the local texture; no task execution. */
(function(root){
'use strict';
function create(canvas,options){
 let opt=Object.assign({enabled:true,active:false,image:'/mascot/koi-real-v4.png'},options||{});
 const ctx=canvas.getContext('2d',{alpha:true}); if(!ctx)return {set(){},destroy(){}};
 let image=new Image(),loaded=false,raf=0,destroyed=false,last=0,t=0,theta=-Math.PI/2,speed=0,x=0,y=0,heading=0,ready=false,w=360,h=250,dpr=1;
 function resize(){const r=canvas.getBoundingClientRect();w=Math.max(100,r.width);h=Math.max(100,r.height);dpr=Math.min(window.devicePixelRatio||1,2);canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);if(loaded)draw()}
 const observer=new ResizeObserver(resize);observer.observe(canvas);resize();
 const angleDiff=(a,b)=>Math.atan2(Math.sin(a-b),Math.cos(a-b));
 function pose(dt){
  const enabled=opt.enabled;const target=enabled?(opt.active?1:.08):0;speed+=(target-speed)*Math.min(1,dt*1.9);
  if(!enabled)return;
  t+=dt;theta+=dt*.20*speed;
  const length=Math.min(w*.43,h*.79,310),rx=Math.max(12,w*.5-length*.58-14),ry=Math.max(12,h*.5-length*.37-22);
  const swim=opt.active||speed>.2;
  const tx=swim?Math.cos(theta)*rx:Math.sin(t*.23)*5;
  const ty=swim?Math.sin(theta)*ry:Math.cos(t*.21)*3;
  let targetHeading=swim?Math.atan2(ry*Math.cos(theta),-rx*Math.sin(theta)):-.06+Math.sin(t*.27)*.045;
  if(!ready){x=tx;y=ty;heading=targetHeading;ready=true}
  x+=(tx-x)*Math.min(1,dt*2.7);y+=(ty-y)*Math.min(1,dt*2.7);
  heading+=angleDiff(targetHeading,heading)*Math.min(1,dt*1.65);
 }
 function draw(){
  if(!loaded||destroyed)return;
  ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);
  // Subtle water glints, kept behind the fish.
  const glow=ctx.createRadialGradient(w*.53,h*.45,2,w*.53,h*.45,w*.48);glow.addColorStop(0,'rgba(255,255,255,.48)');glow.addColorStop(1,'rgba(188,220,244,0)');ctx.fillStyle=glow;ctx.fillRect(0,0,w,h);
  for(let k=0;k<4;k++){const px=w*(.12+.24*k)+Math.sin(t*.35+k)*9,py=h*(.17+.19*(k%3))+Math.cos(t*.23+k)*7;ctx.beginPath();ctx.ellipse(px,py,21+k*5,5,.2+Math.sin(t*.2)*.3,0,Math.PI*1.8);ctx.strokeStyle='rgba(99,156,195,.10)';ctx.lineWidth=.8;ctx.stroke()}
  const L=Math.min(w*.43,h*.79,310),H=L*image.height/image.width;
  ctx.save();ctx.translate(w*.5+x,h*.5+y);ctx.rotate(heading);
  // Soft depth shadow; no floating CSS bob or abrupt mirrored sprites.
  ctx.save();ctx.translate(-2,8);ctx.scale(1,.84);ctx.globalAlpha=.09;ctx.filter='blur(7px)';ctx.drawImage(image,-L/2,-H/2,L,H);ctx.restore();
  const phase=t*(3.6+speed*4.0),amplitude=L*(.009+.041*speed),strips=180,sw=image.width/strips,dw=L/strips;
  // A traveling lateral wave starts behind the gills; amplitude grows toward the tail.
  // Piecewise local rotation preserves the fish's scale texture and natural silhouette.
  for(let i=0;i<strips;i++){
   const u=(i+.5)/strips,tail=1-u;
   const wave=amplitude*Math.pow(tail,2.5)*Math.sin(phase+u*6.1);
   const u2=Math.min(1,u+.006),tail2=1-u2;
   const wave2=amplitude*Math.pow(tail2,2.5)*Math.sin(phase+u2*6.1);
   const slope=Math.atan2(wave2-wave,L*.006);
   const finZone=Math.exp(-Math.pow((u-.71)/.15,2));
   const finScale=1+finZone*(.035+.045*speed)*Math.sin(phase*.72+u*2.1);
   ctx.save();ctx.translate((u-.5)*L,wave);ctx.rotate(slope);ctx.scale(1,finScale);
   ctx.drawImage(image,Math.max(0,i*sw-.8),0,Math.min(sw+1.6,image.width-i*sw),image.height,-dw*.5-.35,-H*.5,dw+.7,H);
   ctx.restore();
  }
  ctx.restore();
 }
 function tick(now){if(destroyed)return;const dt=last?Math.min(.045,(now-last)/1000):1/60;last=now;if(document.visibilityState!=='hidden'){pose(dt);draw()}if(opt.enabled)raf=requestAnimationFrame(tick);else raf=0}
 function start(){if(!raf&&!destroyed){last=0;raf=requestAnimationFrame(tick)}}
 image.onload=()=>{loaded=true;pose(1/60);draw();start()};image.src=opt.image;
 return {set(next){const old=opt.enabled;opt=Object.assign({},opt,next);if(opt.enabled&&!old)start();else if(!opt.enabled){cancelAnimationFrame(raf);raf=0;draw()}},destroy(){destroyed=true;cancelAnimationFrame(raf);observer.disconnect();image.onload=null}};
}
root.HTBKoi={create};
})(window);
