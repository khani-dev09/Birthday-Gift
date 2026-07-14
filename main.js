
/* ================= CONFIG ================= */
const CONFIG = {
  name: "Usman (GODA)",
  age: 21,
  giftType: "message",
  giftContent: "Here's to another year of chaos, laughter, and unforgettable memories together. 🥂"
};

/* ================= AMBIENT BACKGROUND ================= */
const ambient = document.getElementById('ambient');
function makeStars(n){for(let i=0;i<n;i++){const s=document.createElement('div');s.className='star';s.style.top=Math.random()*100+'%';s.style.left=Math.random()*100+'%';s.style.animationDuration=(2+Math.random()*3)+'s';s.style.animationDelay=(Math.random()*4)+'s';ambient.appendChild(s);}}
function makeBokeh(n){const colors=['rgba(255,95,162,0.5)','rgba(111,216,255,0.5)','rgba(232,196,104,0.5)'];for(let i=0;i<n;i++){const b=document.createElement('div');b.className='bokeh';const size=60+Math.random()*90;b.style.width=size+'px';b.style.height=size+'px';b.style.top=Math.random()*100+'%';b.style.left=Math.random()*100+'%';b.style.background=`radial-gradient(circle, ${colors[i%colors.length]}, transparent 70%)`;b.style.animationDuration=(6+Math.random()*6)+'s';b.style.animationDelay=(Math.random()*4)+'s';ambient.appendChild(b);}}
function makeBalloons(n){const colors=['linear-gradient(160deg,#ff85bd,#ff5fa2)','linear-gradient(160deg,#8fe6ff,#6fd8ff)','linear-gradient(160deg,#f6e3a1,#e8c468)'];for(let i=0;i<n;i++){const b=document.createElement('div');b.className='balloon';const size=34+Math.random()*20;b.style.width=size+'px';b.style.height=(size*1.2)+'px';b.style.left=(5+Math.random()*90)+'%';b.style.background=colors[i%colors.length];b.style.animationDuration=(14+Math.random()*10)+'s';b.style.animationDelay=(Math.random()*12)+'s';ambient.appendChild(b);}}
makeStars(45); makeBokeh(6); makeBalloons(7);

/* ================= CANVAS FX ================= */
const canvas=document.getElementById('fx-canvas'); const ctx=canvas.getContext('2d');
function resizeCanvas(){canvas.width=innerWidth;canvas.height=innerHeight;}
resizeCanvas(); window.addEventListener('resize',resizeCanvas);
let particles=[]; const FX_COLORS=['#e8c468','#f6e3a1','#ff5fa2','#6fd8ff','#ffffff'];
function spawnConfetti(x,y,count=40,spread=1){for(let i=0;i<count;i++){const angle=Math.random()*Math.PI*2;const speed=(2+Math.random()*5)*spread;particles.push({x,y,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed-2,size:4+Math.random()*5,color:FX_COLORS[Math.floor(Math.random()*FX_COLORS.length)],rot:Math.random()*360,vrot:(Math.random()-0.5)*12,life:0,maxLife:70+Math.random()*40,gravity:0.12,shape:Math.random()>0.5?'rect':'circle'});}}
function spawnConfettiRain(count=6){for(let i=0;i<count;i++){particles.push({x:Math.random()*canvas.width,y:-10,vx:(Math.random()-0.5)*1.5,vy:2+Math.random()*2,size:4+Math.random()*5,color:FX_COLORS[Math.floor(Math.random()*FX_COLORS.length)],rot:Math.random()*360,vrot:(Math.random()-0.5)*10,life:0,maxLife:400,gravity:0.01,shape:Math.random()>0.5?'rect':'circle'});}}
let fireworksActive=false;
function launchFirework(){if(!fireworksActive)return;const x=40+Math.random()*(canvas.width-80);const y=60+Math.random()*(canvas.height*0.35);spawnConfetti(x,y,55,1.6);setTimeout(launchFirework,500+Math.random()*700);}
function tickParticles(){ctx.clearRect(0,0,canvas.width,canvas.height);particles.forEach(p=>{p.life++;p.vy+=p.gravity;p.x+=p.vx;p.y+=p.vy;p.rot+=p.vrot;const fade=Math.max(0,1-(p.life/p.maxLife));ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.rot*Math.PI/180);ctx.globalAlpha=fade;ctx.fillStyle=p.color;if(p.shape==='rect'){ctx.fillRect(-p.size/2,-p.size/2,p.size,p.size*0.5);}else{ctx.beginPath();ctx.arc(0,0,p.size/2,0,Math.PI*2);ctx.fill();}ctx.restore();});particles=particles.filter(p=>p.life<p.maxLife&&p.y<canvas.height+30);requestAnimationFrame(tickParticles);}
tickParticles();
let rainInterval=null;
function startConfettiRain(){if(rainInterval)return;rainInterval=setInterval(()=>spawnConfettiRain(4),260);}

/* ================= HELPERS ================= */
function showContinue(id){const btn=document.getElementById(id+'-continue');if(btn)btn.classList.add('show');}
function staggerShow(container,selector,gap,after){
  const items=container.querySelectorAll(selector);
  items.forEach((el,i)=>setTimeout(()=>el.classList.add('show'),i*gap));
  if(after)setTimeout(after,items.length*gap+250);
}

/* ================= SCREEN INITIALIZERS ================= */
function initSystemUpdate(id){
  const container=document.getElementById(id);
  const fill=document.getElementById('progressFill');
  requestAnimationFrame(()=>fill.style.width='100%');
  setTimeout(()=>{
    staggerShow(container,'.seq',220,()=>showContinue(id));
  },1200);
}
function initBars(id){
  const container=document.getElementById(id);
  const bars=container.querySelectorAll('.bar-fill[data-pct]');
  bars.forEach((b,i)=>setTimeout(()=>{b.style.width=b.dataset.pct+'%';},i*220));
  setTimeout(()=>showContinue(id), bars.length*220+500);
}
function initSeq(id){
  const container=document.getElementById(id);
  staggerShow(container,'.seq',200,()=>showContinue(id));
}
function initDna(id){
  setTimeout(()=>{
    document.getElementById(id+'-loader').textContent='Results Found';
    initSeq(id);
  },1300);
}
function initMaturity(id){
  const pctEl=document.getElementById(id+'-pct');
  const steps=[10,20,40,60,80];
  let i=0;
  const t=setInterval(()=>{
    if(i>=steps.length){
      clearInterval(t);
      pctEl.textContent='❌';
      document.getElementById(id+'-result').classList.add('show');
      showContinue(id);
      return;
    }
    pctEl.textContent=steps[i]+'%';
    i++;
  },450);
}
function initFinance(id){
  setTimeout(()=>{
    document.getElementById(id+'-loading').style.display='none';
    document.getElementById(id+'-result').classList.add('show');
    showContinue(id);
  },1400);
}

const initializers={
  'screen-2':initSystemUpdate,
  'screen-stats':initBars,
  'screen-3':initSeq,
  'screen-dna':initDna,
  'screen-maturity':initMaturity,
  'screen-ai':initSeq,
  'screen-iq':initBars,
  'screen-finance':initFinance
};
const played=new Set();
function activateInit(id){
  if(played.has(id))return;
  played.add(id);
  const fn=initializers[id];
  if(fn)fn(id);
}

/* ================= NAVIGATION ================= */
function goTo(id){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  activateInit(id);
}
document.querySelectorAll('.nav-btn').forEach(btn=>btn.addEventListener('click',()=>goTo(btn.dataset.next)));

/* Ripple on buttons */
document.querySelectorAll('.btn').forEach(btn=>{
  btn.addEventListener('click',function(e){
    const rect=this.getBoundingClientRect();
    const ripple=document.createElement('span');
    ripple.className='ripple';
    const size=Math.max(rect.width,rect.height);
    ripple.style.width=ripple.style.height=size+'px';
    ripple.style.left=(e.clientX-rect.left-size/2)+'px';
    ripple.style.top=(e.clientY-rect.top-size/2)+'px';
    this.appendChild(ripple);
    setTimeout(()=>ripple.remove(),650);
  });
});

/* Auto-btn clicks also navigate (they carry data-next too) */
document.querySelectorAll('.auto-btn').forEach(btn=>{
  if(btn.dataset.next) btn.addEventListener('click',()=>goTo(btn.dataset.next));
});

/* ================= ENVELOPE ================= */
document.getElementById('openBtn').addEventListener('click',()=>{
  const env=document.getElementById('envelope');
  env.classList.add('open');
  spawnConfetti(innerWidth/2, innerHeight*0.4, 30, 1);
  setTimeout(()=>goTo('screen-1'),1000);
});

/* ================= QUIZ ================= */
document.querySelectorAll('[data-quiz]').forEach(opt=>{
  opt.addEventListener('click',()=>{
    document.querySelectorAll('[data-quiz]').forEach(o=>o.style.opacity='0.5');
    opt.style.opacity='1';
    opt.style.boxShadow='0 0 22px rgba(232,196,104,0.6)';
    const rect=opt.getBoundingClientRect();
    spawnConfetti(rect.left+rect.width/2, rect.top, 60, 1.4);
    document.getElementById('card4-reveal').classList.add('show');
  });
});

/* ================= GIFT TAP ================= */
let taps=0;
const giftBox=document.getElementById('giftBox');
const tapCountEl=document.getElementById('tapCount');
const screen5=document.getElementById('screen-5');
giftBox.addEventListener('click',()=>{
  if(taps>=5)return;
  taps++;
  tapCountEl.textContent=`${taps} / 5 taps`;
  giftBox.classList.remove('shake');
  void giftBox.offsetWidth;
  giftBox.classList.add('shake');
  const rect=giftBox.getBoundingClientRect();
  spawnConfetti(rect.left+rect.width/2, rect.top+rect.height/2, 16+taps*4, 0.8+taps*0.15);
  screen5.style.backgroundColor=`rgba(0,0,0,${taps*0.09})`;
  giftBox.style.filter=`drop-shadow(0 0 ${taps*8}px rgba(255,95,162,${0.3+taps*0.1}))`;
  if(taps>=5){
    setTimeout(()=>{
      giftBox.classList.add('exploded');
      spawnConfetti(rect.left+rect.width/2, rect.top+rect.height/2, 120, 2.2);
      setTimeout(revealFinal,550);
    },300);
  }
});

/* ================= FINAL REVEAL ================= */
function renderGift(){
  const el=document.getElementById('gift-content');
  if(!CONFIG.giftContent){el.innerHTML='';return;}
  switch(CONFIG.giftType){
    case 'photo': el.innerHTML=`<img src="${CONFIG.giftContent}" alt="gift photo" style="width:100%;border-radius:12px;">`;break;
    case 'video': el.innerHTML=`<video src="${CONFIG.giftContent}" controls playsinline style="width:100%;border-radius:12px;"></video>`;break;
    case 'qr': el.innerHTML=`<img src="${CONFIG.giftContent}" alt="QR code" style="width:100%;border-radius:12px;"><p style="margin-top:10px;">Scan to reveal your surprise ✨</p>`;break;
    case 'link': el.innerHTML=`<p>Tap below to open your surprise 🎁</p><a href="${CONFIG.giftContent}" target="_blank" rel="noopener" style="color:var(--gold2);font-weight:600;">Open Gift →</a>`;break;
    case 'coupon': el.innerHTML=`<p style="letter-spacing:2px;font-weight:700;color:var(--gold2);font-size:18px;">${CONFIG.giftContent}</p><p style="margin-top:8px;">Redeem this anytime 😉</p>`;break;
    case 'meme': el.innerHTML=`<img src="${CONFIG.giftContent}" alt="funny meme" style="width:100%;border-radius:12px;">`;break;
    default: el.innerHTML=`<div class="secret-box" style="text-align:left;">${CONFIG.giftContent}</div>`;
  }
}
function revealFinal(){
  document.getElementById('finalName').textContent=`You have officially unlocked Level ${CONFIG.age}`;
  renderGift();
  goTo('screen-final');
  fireworksActive=true;
  launchFirework();
  startConfettiRain();
  setTimeout(()=>document.getElementById('finalPs').classList.add('show'),2200);
}

/* ================= SECRET BUTTONS ================= */
document.getElementById('secretGiftBtn').addEventListener('click',()=>{
  document.getElementById('secretGiftReveal').classList.toggle('show');
});
document.getElementById('secretScanBtn').addEventListener('click',()=>{
  document.getElementById('secretScanReveal').classList.toggle('show');
});

document.title=`Happy Birthday ${CONFIG.name}!`;
