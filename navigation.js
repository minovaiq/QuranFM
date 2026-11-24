'use strict';
(()=>{
 const main=document.querySelector('main'),sections=[...main.querySelectorAll('[data-screen]')],menu=document.querySelector('.nav-more'),routes=new Set(['home','player','radio','reciters','surahs','reading','adhkar','library','services','prayer','qibla','plan','about']),services=new Set(['prayer','qibla','plan']);
 let last='';
 function render(){
   const raw=location.hash.slice(1),route=routes.has(raw)?raw:'home',screen=route==='player'?'home':services.has(route)?'services':route;
   main.dataset.route=screen;
   sections.forEach(el=>{el.hidden=!(el.dataset.screen===screen||(screen==='home'&&el.dataset.screen==='radio'))});
   document.querySelectorAll('[data-service]').forEach(el=>{el.hidden=services.has(route)&&el.dataset.service!==route});
   document.querySelector('#services .service-grid').classList.toggle('single-service',services.has(route));
   document.querySelectorAll('header nav a').forEach(a=>{if(a.getAttribute('href')==='#'+screen)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});
   if(screen!=='reading'){document.body.classList.remove('reading-focus');document.getElementById('readingMode').setAttribute('aria-pressed','false')}
   if(menu)menu.open=false;
   if(last!==route){last=route;if(route==='player')requestAnimationFrame(()=>document.getElementById('player').scrollIntoView({block:'start'}));else window.scrollTo({top:0,behavior:'instant'})}
 }
 window.addEventListener('hashchange',render);render();
 document.addEventListener('click',e=>{if(menu&&menu.open&&!menu.contains(e.target))menu.open=false});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu)menu.open=false});
})();