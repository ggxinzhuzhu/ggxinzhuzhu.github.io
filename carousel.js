const track = document.getElementById('hero-slides');
const slides = Array.from(track.querySelectorAll('.hero-slide'));
const titles = ['COMMUNITY + NATURE · LAKE PUSIANO', 'CASA FRANCESCO · ADAPTIVE REUSE', 'CASA FRANCESCO · BUILDING RENOVATION', 'LANDSCAPE DESIGN · PRODUCTIVE COURTYARD', 'PLAN OPTIMISATION · DAYLIGHT', 'ENVIRONMENTAL DESIGN · RADIATION ANALYSIS', 'BUILDING PHYSICS · DAYLIGHT ANALYSIS', 'BUILDING ENERGY · SOLAR PERFORMANCE', 'BUILDING ENERGY · ENERGY BALANCE', 'ADVANCED ENVELOPE · 3D DETAILS', 'ADVANCED ENVELOPE · SLAB EDGE', 'ENVELOPE ENGINEERING · THERMAL BRIDGE', 'STRUCTURAL ANALYSIS · STEEL FRAME', 'STRUCTURAL DESIGN · BENDING MOMENT'];
const count = document.getElementById('slide-count');
const title = document.getElementById('slide-title');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const mobile = window.matchMedia('(max-width: 800px)');
let index = 0;
let timer;
function translated(value){ return window.siteTranslate ? window.siteTranslate(value) : value; }
function updateUI(next){
  index = (next + slides.length) % slides.length;
  if (!mobile.matches) slides.forEach((slide,i)=>slide.classList.toggle('is-active',i===index));
  count.textContent = `${String(index + 1).padStart(2,'0')} / ${String(slides.length).padStart(2,'0')}`;
  title.textContent = translated(titles[index]);
  if (mobile.matches) track.scrollTo({left:slides[index].offsetLeft-track.offsetLeft-0.05*window.innerWidth,behavior:reducedMotion.matches?'instant':'smooth'});
}
function restart(){ clearInterval(timer); if(!reducedMotion.matches && !mobile.matches) timer=setInterval(()=>updateUI(index+1),5200); }
function move(direction){ updateUI(index+direction); restart(); }
document.getElementById('slide-prev').addEventListener('click',()=>move(-1));
document.getElementById('slide-next').addEventListener('click',()=>move(1));
track.addEventListener('keydown',event=>{if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();move(event.key==='ArrowRight'?1:-1);}});
track.addEventListener('mouseenter',()=>clearInterval(timer));
track.addEventListener('mouseleave',restart);
track.addEventListener('focusin',()=>clearInterval(timer));
track.addEventListener('focusout',restart);
let scrollQueued=false;
track.addEventListener('scroll',()=>{if(!mobile.matches||scrollQueued)return;scrollQueued=true;requestAnimationFrame(()=>{const center=track.scrollLeft+track.clientWidth/2;let best=0,dist=Infinity;slides.forEach((slide,i)=>{const d=Math.abs(slide.offsetLeft+slide.offsetWidth/2-center);if(d<dist){dist=d;best=i;}});index=best;count.textContent=`${String(index+1).padStart(2,'0')} / ${String(slides.length).padStart(2,'0')}`;title.textContent=translated(titles[index]);scrollQueued=false;});});
document.addEventListener('site-language-change',()=>updateUI(index));
mobile.addEventListener('change',()=>{updateUI(index);restart();});
updateUI(0);restart();
