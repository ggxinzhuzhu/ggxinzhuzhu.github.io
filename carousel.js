const track = document.getElementById('hero-slides');
const titles = ['SOCIAL HOUSING · SECTION & ELEVATION', 'PRECAMPEL · CONCEPT MAP', 'PRECAMPEL · URBAN DESIGN GOALS'];
const count = document.getElementById('slide-count');
const title = document.getElementById('slide-title');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const currentIndex = () => Math.round(track.scrollLeft / track.clientWidth);
function updateCaption() {
  const index = Math.max(0, Math.min(titles.length - 1, currentIndex()));
  count.textContent = `${index + 1} / ${titles.length}`;
  title.textContent = window.siteTranslate(titles[index]);
}
document.addEventListener('site-language-change', updateCaption);
updateCaption();
function move(direction) {
  const index = (currentIndex() + direction + titles.length) % titles.length;
  track.scrollTo({left: index * track.clientWidth, behavior: reducedMotion.matches ? 'instant' : 'smooth'});
}
document.getElementById('slide-prev').addEventListener('click', () => move(-1));
document.getElementById('slide-next').addEventListener('click', () => move(1));
track.addEventListener('keydown', event => {
  if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
    event.preventDefault();
    move(event.key === 'ArrowRight' ? 1 : -1);
  }
});
let queued = false;
track.addEventListener('scroll', () => {
  if (queued) return;
  queued = true;
  requestAnimationFrame(() => {
    const index = Math.max(0, Math.min(titles.length - 1, currentIndex()));
    count.textContent = `${index + 1} / ${titles.length}`;
    title.textContent = window.siteTranslate(titles[index]);
    queued = false;
  });
});
let savedIndex = 0;
track.addEventListener('scrollend', () => { savedIndex = currentIndex(); });
new ResizeObserver(() => {
  track.scrollTo({left: savedIndex * track.clientWidth, behavior: 'instant'});
}).observe(track);
