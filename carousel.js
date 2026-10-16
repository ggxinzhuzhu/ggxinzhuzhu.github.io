const track = document.getElementById('hero-slides');
const slides = Array.from(track.querySelectorAll('.hero-slide'));
const titles = ['COMMUNITY + NATURE · LAKE PUSIANO', 'CASA FRANCESCO · ADAPTIVE REUSE', 'CASA FRANCESCO · BUILDING RENOVATION', 'LANDSCAPE DESIGN · PRODUCTIVE COURTYARD', 'PLAN OPTIMISATION · DAYLIGHT', 'ENVIRONMENTAL DESIGN · RADIATION ANALYSIS', 'BUILDING PHYSICS · DAYLIGHT ANALYSIS', 'BUILDING ENERGY · SOLAR PERFORMANCE', 'BUILDING ENERGY · ENERGY BALANCE', 'ADVANCED ENVELOPE · 3D DETAILS', 'ADVANCED ENVELOPE · SLAB EDGE', 'ENVELOPE ENGINEERING · THERMAL BRIDGE', 'STRUCTURAL ANALYSIS · STEEL FRAME', 'STRUCTURAL DESIGN · BENDING MOMENT'];
const count = document.getElementById('slide-count');
const title = document.getElementById('slide-title');
const toggle = document.getElementById('slide-toggle');
const progress = document.querySelector('.hero-progress');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const mobile = window.matchMedia('(max-width: 800px)');
const INTERVAL = 5200;
let index = 0;
let timer;
let paused = reducedMotion.matches;
let hovering = false;

function translated(value){ return window.siteTranslate ? window.siteTranslate(value) : value; }
function pad(n){ return String(n).padStart(2,'0'); }
function setStatus(){
  count.textContent = `${pad(index + 1)} / ${pad(slides.length)}`;
  title.textContent = translated(titles[index]);
}
function autoplayActive(){ return !paused && !hovering && !mobile.matches; }
function restartProgress(){
  if (!progress) return;
  progress.classList.remove('is-running');
  progress.style.setProperty('--hero-interval', `${INTERVAL}ms`);
  void progress.offsetWidth; // restart the CSS animation
  if (autoplayActive()) progress.classList.add('is-running');
}
function updateUI(next){
  index = (next + slides.length) % slides.length;
  if (!mobile.matches) slides.forEach((slide,i)=>slide.classList.toggle('is-active',i===index));
  setStatus();
  if (mobile.matches) track.scrollTo({left:slides[index].offsetLeft-track.offsetLeft-0.05*window.innerWidth,behavior:reducedMotion.matches?'instant':'smooth'});
}
function restart(){
  clearInterval(timer);
  if (autoplayActive()) timer = setInterval(()=>{ updateUI(index+1); restartProgress(); }, INTERVAL);
  restartProgress();
}
function move(direction){ updateUI(index+direction); restart(); }
function setPaused(value){
  paused = value;
  toggle.setAttribute('aria-pressed', String(paused));
  toggle.classList.toggle('is-paused', paused);
  restart();
}

document.getElementById('slide-prev').addEventListener('click',()=>move(-1));
document.getElementById('slide-next').addEventListener('click',()=>move(1));
toggle.addEventListener('click',()=>setPaused(!paused));
track.addEventListener('keydown',event=>{if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();move(event.key==='ArrowRight'?1:-1);}});
track.addEventListener('mouseenter',()=>{hovering=true;restart();});
track.addEventListener('mouseleave',()=>{hovering=false;restart();});
track.addEventListener('focusin',()=>{hovering=true;restart();});
track.addEventListener('focusout',()=>{hovering=false;restart();});
let scrollQueued=false;
track.addEventListener('scroll',()=>{if(!mobile.matches||scrollQueued)return;scrollQueued=true;requestAnimationFrame(()=>{const center=track.scrollLeft+track.clientWidth/2;let best=0,dist=Infinity;slides.forEach((slide,i)=>{const d=Math.abs(slide.offsetLeft+slide.offsetWidth/2-center);if(d<dist){dist=d;best=i;}});index=best;setStatus();scrollQueued=false;});});
document.addEventListener('site-language-change',setStatus);
document.addEventListener('visibilitychange',()=>{hovering=document.hidden;restart();});
mobile.addEventListener('change',()=>{updateUI(index);restart();});
toggle.setAttribute('aria-pressed', String(paused));
toggle.classList.toggle('is-paused', paused);
updateUI(0);restart();
