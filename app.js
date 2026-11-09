const toggle=document.querySelector('#menu-toggle'),menu=document.querySelector('#menu');
function closeMenu(){menu.classList.remove('open');toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','메뉴 열기')}
toggle.addEventListener('click',()=>{const open=menu.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'메뉴 닫기':'메뉴 열기')});menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu()});
const dialog=document.querySelector('#lightbox'),large=document.querySelector('#lightbox-image');let previousFocus;
function bindZoom(root=document){root.querySelectorAll('.zoom').forEach(b=>b.addEventListener('click',()=>{previousFocus=b;large.src=b.dataset.image;large.alt=b.querySelector('img').alt;document.querySelector('#lightbox-title').textContent=b.getAttribute('aria-label').replace(' 확대','');dialog.showModal()}))}
bindZoom();document.querySelector('#close-dialog').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});dialog.addEventListener('close',()=>previousFocus?.focus({preventScroll:true}));
const gallery=document.querySelector('#more-gallery');
const extra=[['case-hair-4','눈썹 사례 · 눈매와 결 표현'],['case-hair-3','눈썹 사례 · 라인 비교'],['case-embo-2','눈썹 사례 · 두께와 라인 비교'],['case-hair-2','헤어스트로크 · 결의 방향 비교'],['case-hair-1','헤어스트로크 · 빈 부위 결 표현'],['case-shading-1','눈썹 사례 · 잔흔과 형태 비교'],['case-shading-2','셰딩 · 음영과 형태 비교']];
extra.forEach(([file,title])=>{const item=document.createElement('article');item.innerHTML='<button class="zoom" data-image="assets/'+file+'.webp" aria-label="'+title+' 확대"><img src="assets/'+file+'.webp" alt="'+title+'" loading="lazy" width="900" height="1200"><span class="zoom-mark">전체 보기 ↗</span></button><p>'+title+'</p>';gallery.append(item)});bindZoom(gallery);
document.querySelector('#more').addEventListener('click',e=>{const b=e.currentTarget,open=gallery.hidden;gallery.hidden=!open;b.setAttribute('aria-expanded',String(open));b.innerHTML=open?'사례 접기 <span>−</span>':'실제 사례 더 보기 <span>＋</span>';if(!open)document.querySelector('#work').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'})});
if('IntersectionObserver'in window){const observer=new IntersectionObserver(entries=>{for(const e of entries){if(e.isIntersecting)e.target.classList.add('in-view');else e.target.classList.remove('in-view')}},{threshold:.12,rootMargin:'0px 0px -12px 0px'});document.querySelectorAll('.reveal').forEach(el=>observer.observe(el))}
const v=document.querySelector('#studio-video');function startVideo(){v.muted=true;v.play().catch(()=>{})}startVideo();document.addEventListener('visibilitychange',()=>{if(!document.hidden)startVideo()});function videoFallback(){if(v.nextElementSibling?.classList.contains('video-fallback'))return;const img=document.createElement('img');img.src=v.poster;img.alt='더그리닝 실제 매장 공간';img.className='video-fallback';v.hidden=true;v.after(img)}v.addEventListener('error',videoFallback);v.querySelector('source')?.addEventListener('error',videoFallback,{once:true});
history.scrollRestoration='manual';
const reloaded=performance.getEntriesByType('navigation')[0]?.type==='reload';
window.addEventListener('load',()=>{if(reloaded||!location.hash){if(reloaded&&location.hash)history.replaceState(null,'',location.pathname+location.search);window.scrollTo({top:0,left:0,behavior:'instant'})}},{once:true});



const deck=document.querySelector('.result-deck'),cards=[...document.querySelectorAll('.result-card')];let activeCard=0,lastCardInteraction=0;
function moveCard(step,automatic=false){if(!automatic)lastCardInteraction=Date.now();activeCard=(activeCard+step+cards.length)%cards.length;cards.forEach((card,i)=>{const offset=(i-activeCard+cards.length)%cards.length;card.dataset.position=offset===0?'center':cards.length===2?'right':offset===1?'left':'right'});document.querySelector('#deck-status').textContent=String(activeCard+1).padStart(2,'0')+' / '+String(cards.length).padStart(2,'0')}
document.querySelector('#deck-prev').addEventListener('click',()=>moveCard(-1));document.querySelector('#deck-next').addEventListener('click',()=>moveCard(1));deck.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();moveCard(e.key==='ArrowRight'?1:-1)}});
let touchStart=null,deckSwiped=false;deck.addEventListener('touchstart',e=>{deckSwiped=false;touchStart=e.touches[0].clientX},{passive:true});deck.addEventListener('touchend',e=>{if(touchStart!==null){const delta=e.changedTouches[0].clientX-touchStart;if(Math.abs(delta)>45){deckSwiped=true;moveCard(delta<0?1:-1)}}touchStart=null},{passive:true});

deck.addEventListener('click',e=>{if(deckSwiped){e.preventDefault();e.stopImmediatePropagation();deckSwiped=false}},true);

let deckPaused=false,deckVisible=false;const pauseDeck=document.querySelector('#deck-pause');
pauseDeck.addEventListener('click',()=>{deckPaused=!deckPaused;pauseDeck.textContent=deckPaused?'▷':'Ⅱ';pauseDeck.setAttribute('aria-label',deckPaused?'사진 자동 넘김 재생':'사진 자동 넘김 일시정지');pauseDeck.setAttribute('aria-pressed',String(deckPaused));lastCardInteraction=Date.now()});
if('IntersectionObserver' in window){new IntersectionObserver(entries=>{deckVisible=entries[0].isIntersecting},{threshold:.35}).observe(deck)}else{deckVisible=true}
setInterval(()=>{if(deckVisible&&!deckPaused&&!document.hidden&&!dialog.open&&!deck.matches(':hover')&&!deck.contains(document.activeElement)&&Date.now()-lastCardInteraction>6000)moveCard(1,true)},5000);
