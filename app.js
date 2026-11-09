const motionButton=document.querySelector('#motion-toggle');
const motionMedia=matchMedia('(prefers-reduced-motion: reduce)');
let motionChoice=null;try{motionChoice=localStorage.getItem('greening-motion')}catch(e){}
function applyMotion(){const full=motionChoice==='full'||(motionChoice!=='reduced'&&!motionMedia.matches);document.documentElement.classList.toggle('motion-full',full);document.documentElement.classList.toggle('motion-reduced',!full);motionButton.textContent=full?'움직임 줄이기':'움직임 켜기';motionButton.setAttribute('aria-pressed',String(full));}
applyMotion();motionMedia.addEventListener('change',applyMotion);
motionButton.addEventListener('click',()=>{motionChoice=document.documentElement.classList.contains('motion-full')?'reduced':'full';try{localStorage.setItem('greening-motion',motionChoice)}catch(e){}applyMotion();document.querySelectorAll('.in-view').forEach(el=>{el.classList.remove('in-view');void el.offsetWidth;el.classList.add('in-view')})});
const toggle=document.querySelector('#menu-toggle'),menu=document.querySelector('#menu');
function closeMenu(){menu.classList.remove('open');toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','메뉴 열기')}
toggle.addEventListener('click',()=>{const open=menu.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'메뉴 닫기':'메뉴 열기')});menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu()});
const dialog=document.querySelector('#lightbox'),large=document.querySelector('#lightbox-image');let previousFocus;
function bindZoom(root=document){root.querySelectorAll('.zoom').forEach(b=>b.addEventListener('click',()=>{previousFocus=b;large.src=b.dataset.image;large.alt=b.querySelector('img').alt;document.querySelector('#lightbox-title').textContent=b.getAttribute('aria-label').replace(' 확대','');dialog.showModal()}))}
bindZoom();document.querySelector('#close-dialog').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});dialog.addEventListener('close',()=>previousFocus?.focus({preventScroll:true}));
const gallery=document.querySelector('#more-gallery');const extra=[['case-hair-2','헤어스트로크 · 결의 방향 비교'],['case-hair-3','헤어스트로크 · 눈썹 라인 비교'],['case-hair-4','헤어스트로크 · 눈매와 결 표현'],['case-shading-2','셰딩 · 음영과 형태 비교'],['case-embo-1','엠보 · 눈썹 전후 비교'],['case-embo-2','엠보 · 두께와 라인 비교']];
extra.forEach(([file,title])=>{const item=document.createElement('article');item.innerHTML=`<button class="zoom" data-image="assets/${file}.webp" aria-label="${title} 확대"><img src="assets/${file}.webp" alt="${title}" loading="lazy" width="900" height="1200"><span class="zoom-mark">↗</span></button><p>${title}</p>`;gallery.append(item)});bindZoom(gallery);
document.querySelector('#more').addEventListener('click',e=>{const b=e.currentTarget,open=gallery.hidden;gallery.hidden=!open;b.setAttribute('aria-expanded',String(open));b.innerHTML=open?'사례 접기 <span>−</span>':'실제 사례 더 보기 <span>＋</span>';if(!open)document.querySelector('#work').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'})});
if('IntersectionObserver'in window){const observer=new IntersectionObserver(entries=>{for(const e of entries){if(e.isIntersecting)e.target.classList.add('in-view');else e.target.classList.remove('in-view')}},{threshold:.12,rootMargin:'0px 0px -15px 0px'});document.querySelectorAll('.reveal').forEach(el=>observer.observe(el))}
const v=document.querySelector('#studio-video');function startVideo(){v.muted=true;v.play().catch(()=>{})}startVideo();document.addEventListener('visibilitychange',()=>{if(!document.hidden)startVideo()});v.addEventListener('error',()=>{v.style.display='none';const img=document.createElement('img');img.src=v.poster;img.alt='더그리닝 실제 공간';v.after(img)});
if(!location.hash){history.scrollRestoration='manual';window.addEventListener('load',()=>window.scrollTo({top:0,left:0,behavior:'instant'}),{once:true})}

v.querySelector('source')?.addEventListener('error',()=>{v.removeAttribute('autoplay');v.load()},{once:true});

// A personal reduced-motion preference also applies when the OS allows motion.
