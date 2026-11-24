
'use strict';
(()=>{
const root=document.getElementById('pageRoot');if(!root)return;
const surah=Number(root.dataset.surah||0),rid=root.dataset.reciter||'',edition=document.getElementById('pageEdition'),sura=document.getElementById('pageSurah'),player=document.getElementById('pageAudio'),status=document.getElementById('pageStatus'),play=document.getElementById('pagePlay'),tracks=document.getElementById('pageTracks'),repeat=document.getElementById('pageRepeat');
let list=[],request=0,loop=false;
const option=(v,t)=>{const o=document.createElement('option');o.value=v;o.textContent=t;return o};
async function json(url){const c=new AbortController(),t=setTimeout(()=>c.abort(),12000);try{const r=await fetch(url,{signal:c.signal});if(!r.ok)throw Error(r.status);return await r.json()}finally{clearTimeout(t)}}
function picked(){return list.find(x=>x.id===edition.value)}
function render(){const r=picked();sura.replaceChildren();if(!r){play.disabled=true;return}const ids=surah?[surah]:r.ids;ids.forEach(n=>sura.append(option(n,'سورة '+Quran.names[n-1])));play.disabled=!ids.length;if(tracks){tracks.replaceChildren();for(const n of ids){const b=document.createElement('button');b.textContent='سورة '+Quran.names[n-1];b.onclick=()=>{sura.value=n;start()};tracks.append(b)}}}
function start(){const t=Quran.track(picked(),Number(sura.value));if(!t)return;player.src=t.url;player.loop=loop;status.textContent=t.title+' · '+t.reader;player.play().catch(()=>{status.textContent='اضغط تشغيل أو أعد المحاولة عند توفر الاتصال.'})}
repeat.onclick=()=>{loop=!loop;player.loop=loop;repeat.setAttribute('aria-pressed',String(loop))};edition.onchange=render;play.onclick=start;play.disabled=true;player.addEventListener('error',()=>status.textContent='تعذر تشغيل التسجيل من المصدر.');
if(surah)document.getElementById('pageSurahLabel').hidden=true;
async function load(){try{const d=await json('https://www.mp3quran.net/api/v3/reciters?language=ar'+(rid?'&reciter='+encodeURIComponent(rid):''));list=Quran.catalog(d).filter(x=>(!rid||x.id.split('-')[0]===rid)&&(!surah||x.ids.includes(surah))).sort((a,b)=>a.name.localeCompare(b.name,'ar'));if(!list.length)throw Error('empty');edition.replaceChildren(...list.map(x=>option(x.id,x.name+' · '+x.edition)));const wanted=new URLSearchParams(location.search).get('edition');if(list.some(x=>x.id===wanted))edition.value=wanted;render();status.textContent='اختر الرواية واضغط استمع.'}catch{status.textContent='تعذر تحديث مكتبة التلاوات. جرّب إعادة تحميل الصفحة.'}}
async function read(){const box=document.getElementById('pageVerses');if(!box)return;try{const d=await json('https://api.alquran.cloud/v1/surah/'+surah+'/quran-uthmani');if(!Array.isArray(d.data?.ayahs)||!d.data.ayahs.length)throw Error('empty');box.replaceChildren();for(const a of d.data.ayahs){const v=document.createElement('div');v.className='verse';v.textContent=a.text+' ';const num=document.createElement('small');num.textContent='﴿'+a.numberInSurah+'﴾';v.append(num);box.append(v)}}catch{box.textContent='تعذر تحميل النص من المصدر. أعد تحميل الصفحة.'}}
load();if(surah)read();
})();
