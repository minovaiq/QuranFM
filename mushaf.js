
'use strict';
(()=>{
const D=window.QFMMushafData,id=s=>document.getElementById(s),P=604,base='https://raw.githubusercontent.com/akram-seid/quran-hd-images/03cc496028d428eedf15d1ca9197e7eaf88b0bda/images/',cacheName='qfm-mushaf-pages-v1',clamp=n=>Math.max(1,Math.min(P,Math.trunc(Number(n)||1))),url=n=>base+String(n).padStart(3,'0')+'.jpg',L=(a,b)=>lang==='ar'?a:b;
let page=clamp(get('mushafPage',1)),layout=get('mushafLayout','auto'),night=!!get('mushafNight',false),zoom=Math.max(100,Math.min(200,Number(get('mushafZoom',100))||100)),mode=get('mushafMode','paper')==='text'?'text':'paper',token=0,visiblePages=[];
if(!['auto','single','double'].includes(layout))layout='auto';
const mq=matchMedia('(min-width:800px)');
function double(){return layout==='double'||layout==='auto'&&mq.matches}
function spread(n){return !double()||n===1?[n]:[n%2===0?n:n-1,Math.min(P,n%2===0?n+1:n)].filter((v,i,a)=>a.indexOf(v)===i)}
function status(a,b){id('paperStatus').textContent=L(a,b)}
function tab(el,on){el.classList.toggle('gold',on);el.classList.toggle('ghost',!on);el.setAttribute('aria-pressed',String(on))}
function modeSwitch(m){mode=m==='text'?'text':'paper';put('mushafMode',mode);id('paperReader').hidden=mode!=='paper';id('textReader').hidden=mode!=='text';tab(id('paperTab'),mode==='paper');tab(id('textTab'),mode==='text');render()}
window.qfmReadingMode=modeSwitch;id('paperTab').onclick=()=>modeSwitch('paper');id('textTab').onclick=()=>modeSwitch('text');
function juz(n){let k=1;for(let i=0;i<D.juz.length;i++)if(D.juz[i]<=n)k=i+1;return k}
function labels(){id('paperNumber').value=page;id('paperSurah').value=D.pages[page-1][0];id('paperJuz').value=juz(page);id('paperIndicator').textContent=L('صفحة ','Page ')+visiblePages.join(' – ')+' / '+P+' · '+L('الجزء ','Juz ')+juz(page);id('paperPrev').disabled=visiblePages[0]===1;id('paperNext').disabled=visiblePages.at(-1)===P}
function render(){if(location.hash!=='#reading'||mode!=='paper')return;const t=++token,nums=spread(page),box=id('paperSpread');visiblePages=nums;labels();status('','');box.replaceChildren();box.classList.toggle('two',nums.length===2);for(const n of nums){const fig=document.createElement('figure'),im=document.createElement('img'),cap=document.createElement('figcaption');fig.className='paper-sheet';im.alt=L('صفحة المصحف رقم '+n,'Mushaf page '+n);im.decoding='async';im.draggable=false;im.crossOrigin='anonymous';im.onerror=()=>{if(t!==token)return;const retry=document.createElement('button');retry.className='ghost';retry.textContent=L('تعذر تحميل الصفحة '+n+' · إعادة المحاولة','Page '+n+' unavailable · Retry');retry.onclick=render;im.replaceWith(retry);status('تحقق من الاتصال أو افتح صفحة سبق حفظها.','Check your connection or open a previously saved page.')};im.src=url(n);cap.textContent=n;fig.append(im,cap);box.append(fig)}id('paperViewport').scrollTo({left:0,top:0});box.style.setProperty('--paper-zoom',zoom/100);id('paperReader').classList.toggle('paper-night',night)}
function go(n){page=clamp(n);put('mushafPage',page);render()}
function step(dir){const list=spread(page);go(dir>0?list.at(-1)+1:list[0]-1)}
C.names.forEach((n,i)=>id('paperSurah').append(opt(i+1,n)));D.juz.forEach((_,i)=>id('paperJuz').append(opt(i+1,L('الجزء ','Juz ')+(i+1))));
id('paperSurah').onchange=()=>go(D.surahs[Number(id('paperSurah').value)-1]);id('paperJuz').onchange=()=>go(D.juz[Number(id('paperJuz').value)-1]);id('paperJump').onsubmit=e=>{e.preventDefault();go(id('paperNumber').value)};
id('paperPrev').onclick=()=>step(-1);id('paperNext').onclick=()=>step(1);
id('paperLayout').value=layout;id('paperLayout').onchange=()=>{layout=id('paperLayout').value;put('mushafLayout',layout);render()};
id('paperZoom').value=zoom;id('paperZoom').oninput=()=>{zoom=Number(id('paperZoom').value);put('mushafZoom',zoom);id('paperSpread').style.setProperty('--paper-zoom',zoom/100)};
id('paperNight').setAttribute('aria-pressed',String(night));id('paperNight').onclick=()=>{night=!night;put('mushafNight',night);id('paperNight').setAttribute('aria-pressed',String(night));id('paperReader').classList.toggle('paper-night',night)};
id('paperFocus').onclick=()=>{id('readingMode').click();id('paperFocus').setAttribute('aria-pressed',String(document.body.classList.contains('reading-focus')))};
id('paperMark').onclick=()=>{put('mushafBookmark',page);toast(L('تم حفظ الصفحة '+page,'Bookmarked page '+page))};
id('paperRestore').onclick=()=>{const n=get('mushafBookmark',null);if(n===null)return toast(L('لا توجد علامة محفوظة','No bookmark saved'));go(n)};
id('paperListen').onclick=()=>{const n=D.pages[page-1][0],r=chosen(),t=C.track(r,n);if(!t){id('readSurah').value=n;modeSwitch('text');loadReading();toast(L('اختر قارئاً يوفر هذه السورة','Choose a reciter with this surah'));return}playTrack(t);toast(L('تشغيل السورة من بدايتها','Playing surah from its beginning'))};
id('paperOffline').onclick=async()=>{if(!('caches'in window)||!navigator.serviceWorker?.controller)return toast(L('أعد فتح الموقع عبر HTTPS لتفعيل الحفظ','Reopen over HTTPS to enable offline saving'));const nums=spread(page);id('paperOffline').disabled=true;try{const c=await caches.open(cacheName);for(const n of nums){const req=new Request(url(n),{mode:'cors'});const res=await fetch(req);if(!res.ok||!res.headers.get('content-type')?.startsWith('image/'))throw Error('image');await c.put(req,res)}status('تم حفظ الصفحات '+nums.join('، ')+' دون إنترنت.','Saved pages '+nums.join(', ')+' offline.')}catch{status('تعذر حفظ الصفحات. تحقق من الاتصال والمساحة.','Offline saving failed. Check connection and storage.')}finally{id('paperOffline').disabled=false}};
id('paperClearOffline').onclick=async()=>{if(!('caches'in window))return;try{await caches.delete(cacheName);status('تم مسح الصور المحفوظة.','Saved images cleared.')}catch{status('تعذر مسح الصور.','Unable to clear images.')}};
let touch=null;const v=id('paperViewport');v.addEventListener('touchstart',e=>{touch=e.touches.length===1&&zoom===100?[e.touches[0].clientX,e.touches[0].clientY]:null},{passive:true});v.addEventListener('touchend',e=>{if(!touch||!e.changedTouches.length)return;const dx=e.changedTouches[0].clientX-touch[0],dy=e.changedTouches[0].clientY-touch[1];touch=null;if(Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy)*1.5)step(dx>0?1:-1)},{passive:true});
document.addEventListener('keydown',e=>{if(location.hash!=='#reading'||mode!=='paper'||e.target.closest('input,select,button,textarea,summary'))return;if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();step(e.key==='ArrowLeft'?1:-1)}});
mq.addEventListener?.('change',render);window.addEventListener('hashchange',render);id('languageSelect').addEventListener('change',render);modeSwitch(mode);
})();
