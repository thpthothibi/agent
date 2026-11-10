/* HTB Carp v5. Original supplied character, high-resolution texture and continuous motion. */
(function(root){
'use strict';
function create(canvas,options){
 const opt=Object.assign({enabled:true,active:false,image:'/mascot/carp-original-v5.png'},options||{});
 const ctx=canvas.getContext('2d',{alpha:true});if(!ctx)return{set(){},destroy(){}};
 let w=420,h=280,dpr=1,raf=0,last=0,time=0,phase=0,speed=.65,loaded=false,dead=false;
 const image=new Image();
 function resize(){const box=canvas.getBoundingClientRect();w=Math.max(120,box.width);h=Math.max(140,box.height);dpr=Math.min(root.devicePixelRatio||1,2);canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);draw()}
 const observer=new ResizeObserver(resize);observer.observe(canvas);resize();
 function draw(){
  if(!loaded||dead)return;
  ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);
  const fishW=Math.min(w*.55,h*.83,310),fishH=fishW*image.height/image.width;
  const range=Math.max(10,(w-fishW)*.37),x=Math.sin(phase)*range;
  const y=Math.sin(phase*2+.4)*Math.min(h*.09,25)+Math.sin(time*.75)*3;
  const velocity=Math.cos(phase),facing=Math.tanh(velocity*5);
  const widthFactor=Math.max(.065,Math.abs(facing));
  // Shimmer lines and small bubbles are subordinate to the character.
  for(let i=0;i<4;i++){const bx=w*(.13+.23*i)+Math.sin(time*.35+i)*6,by=h*(.18+.18*(i%3));ctx.beginPath();ctx.ellipse(bx,by,22+i*7,5,-.17,0,Math.PI*1.8);ctx.strokeStyle='rgba(68,133,203,.10)';ctx.lineWidth=1;ctx.stroke()}
  for(let i=0;i<3;i++){const bx=w*(.18+.29*i),by=h-((time*14+i*73)%(h+20));ctx.beginPath();ctx.arc(bx,by,2+i,0,Math.PI*2);ctx.strokeStyle='rgba(61,132,203,.18)';ctx.stroke()}
  // Water-depth shadow follows the fish rather than a screen-wide bouncing CSS transform.
  ctx.save();ctx.translate(w*.5+x,h*.5+y+fishH*.48);ctx.scale(widthFactor,1);ctx.beginPath();ctx.ellipse(0,0,fishW*.27,5,0,0,Math.PI*2);ctx.fillStyle='rgba(45,95,158,.12)';ctx.filter='blur(5px)';ctx.fill();ctx.restore();
  ctx.save();ctx.translate(w*.5+x,h*.48+y);ctx.rotate(Math.sin(phase*2+.6)*.065);ctx.scale(facing>=0?widthFactor:-widthFactor,1);
  const wavePhase=time*(4.0+speed*2.8),amp=fishH*(.018+.025*speed),strips=148,sw=image.width/strips,dw=fishW/strips;
  for(let i=0;i<strips;i++){
   const u=(i+.5)/strips,tail=1-u;
   const wave=amp*Math.pow(tail,2.35)*Math.sin(wavePhase+u*5.7);
   const step=.006,u2=Math.min(1,u+step),wave2=amp*Math.pow(1-u2,2.35)*Math.sin(wavePhase+u2*5.7);
   const tilt=Math.atan2(wave2-wave,fishW*step);
   const fin=1+.025*Math.sin(wavePhase*.8+u*3)*Math.exp(-Math.pow((u-.5)/.3,2));
   ctx.save();ctx.translate((u-.5)*fishW,wave);ctx.rotate(tilt);ctx.scale(1,fin);ctx.drawImage(image,Math.max(0,i*sw-.6),0,Math.min(sw+1.2,image.width-i*sw),image.height,-dw*.5-.4,-fishH*.5,dw+.8,fishH);ctx.restore();
  }
  ctx.restore();
 }
 function tick(now){if(dead)return;const dt=last?Math.min(.05,(now-last)/1000):1/60;last=now;if(document.visibilityState!=='hidden'){time+=dt;speed+=((opt.active?1.25:.65)-speed)*Math.min(1,dt*1.8);phase+=dt*.32*speed;draw()}if(opt.enabled)raf=requestAnimationFrame(tick);else raf=0}
 function start(){if(!raf&&!dead){last=0;raf=requestAnimationFrame(tick)}}
 image.onload=()=>{loaded=true;draw();if(opt.enabled)start()};image.src=opt.image;
 return {set(next){const was=opt.enabled;Object.assign(opt,next);if(opt.enabled&&!was)start();if(!opt.enabled){cancelAnimationFrame(raf);raf=0;draw()}},destroy(){dead=true;cancelAnimationFrame(raf);observer.disconnect();image.onload=null}};
}
root.HTBCarp={create};
})(window);
